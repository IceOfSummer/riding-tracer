import React from 'react'
import { Form, Input, Button, Card } from 'antd-mobile'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { tryLogin } from '~/server/db/user.server'
import { commitSession, createSession } from '~/server/session.server'
import { useFetcher } from '@remix-run/react'
import ('./auth-login.css')


export const action = async ({ request }: ActionFunctionArgs) => {
  const req = await request.json() as LoginFrom
  const loginResult = await tryLogin(req.username, req.password)
  if (!loginResult) {
    return json({
      error: true,
      message: '用户名或密码错误'
    })
  }

  const session = await createSession(request, {
    userId: loginResult.id
  })

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  })
}

type LoginFrom = {
  username: string
  password: string
}

const AuthLogin: React.FC = () => {
  const [form] = Form.useForm<LoginFrom>()
  const fetcher = useFetcher<typeof action>()
  
  const doLogin = () => {
    form.validateFields().then(r => {
      fetcher.submit(JSON.stringify(r), { method: 'post', encType: 'application/json' })
    })
  }

  return (
    <div>
      <div>
        <span>登录</span>
      </div>
      {
        fetcher.data && fetcher.data.error ? (
          <Card title="登录失败">
            {fetcher.data.message}
          </Card>
        ) : null
      }
      <div>
        <Form form={form}>
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名"/>
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true }]}>
            <Input placeholder="请输入密码" type="password"/>
          </Form.Item>
          <div>
            <Button onClick={doLogin}>登录</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default AuthLogin