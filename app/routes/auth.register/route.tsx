import type React from 'react'
import { useEffect } from 'react'
import styles from './styles.module.css'
import { Button, Card, Form, Input } from 'antd-mobile'
import { useFetcher } from '@remix-run/react'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { registerUser } from '~/server/db/user.server'
import { useNavigate } from 'react-router'
import type { ValidatorRule } from 'rc-field-form/lib/interface'


type UserCreateArgs = {
  username: string
  password: string
}

export const action = async ({ request }: ActionFunctionArgs) => {
  // TODO
  const data = await request.json() as UserCreateArgs
  const user = await registerUser(data.username, data.password)
  if (!user) {
    return json({
      error: true,
      message: '用户名重复'
    })
  }
  return json({
    error: false,
    message: ''
  })
}

type FromType = {
  username: string
  password1: string
  password2: string
}

const AuthRegister:React.FC = () => {
  const [form] = Form.useForm<FromType>()
  const fetcher = useFetcher<typeof action>()
  const navigate = useNavigate()

  const doRegister = () => {
    form.validateFields().then(r => {
      const arg: UserCreateArgs = {
        username: r.username,
        password: r.password1
      }
      fetcher.submit(JSON.stringify(arg), { method: 'post', encType: 'application/json' })
    })
  }
  
  const confirmPwdValidator:ValidatorRule['validator'] = (_, value, callback) => {
    const val = form.getFieldValue('password1')
    if (val !== value) {
      callback('两次密码必须输入相同的内容')
      return
    }
    callback()
  } 
  
  useEffect(() => {
    if (fetcher.data && !fetcher.data.error) {
      navigate('/auth')
    }
  }, [fetcher.data])
  
  return (
    <div>
      <div className={styles.header}>
        <span>注册</span>
      </div>
      {
        fetcher.data && fetcher.data.error ? (
          <Card title="注册失败">
            {fetcher.data.message}
          </Card>
        ) : null
      }
      <Form form={form} className={styles.form}>
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名"/>
        </Form.Item>
        <Form.Item name="password1" label="密码" rules={[{ required: true }]}>
          <Input placeholder="请输入密码" type="password"/>
        </Form.Item>
        <Form.Item name="password2" label="确认密码" rules={[{ required: true }, { validator: confirmPwdValidator }]}>
          <Input placeholder="请输入密码" type="password"/>
        </Form.Item>
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Button fill="none" color="primary" onClick={() => navigate('/auth')}>已有账号? 立即登录</Button>
          <Button color="primary" onClick={doRegister} loading={fetcher.state !== 'idle'}>注册</Button>
        </div>
      </Form>
    </div>
  )
}

export default AuthRegister