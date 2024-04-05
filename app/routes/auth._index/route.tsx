import type React from 'react'
import { Card, Form, Input, Button } from 'antd-mobile'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { tryLogin } from '~/server/db/user.server'
import { commitSession, createSession } from '~/server/session.server'
import { useFetcher } from '@remix-run/react'
import styles from './styles.module.css'
import {useNavigate} from "react-router";




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
  const navigate = useNavigate()
  
  const doLogin = () => {
    form.validateFields().then(r => {
      fetcher.submit(JSON.stringify(r), { method: 'post', encType: 'application/json' })
    })
  }

  return (
    <div>
      <div className={styles.header}>
        <span>登录</span>
      </div>
      {
        fetcher.data && fetcher.data.error ? (
          <Card title="登录失败">
            {fetcher.data.message}
          </Card>
        ) : null
      }
      <Form form={form} className={styles.form}>
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名"/>
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input placeholder="请输入密码" type="password"/>
        </Form.Item>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button fill="none" color="primary" onClick={() => navigate('/auth/register')}>注册账号</Button>
          <Button color="primary" onClick={doLogin} loading={fetcher.state !== 'idle'}>登录</Button>
        </div>
      </Form>
    </div>
  )
}

export default AuthLogin