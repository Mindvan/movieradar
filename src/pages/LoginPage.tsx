import { Button, Card, Form, Input, Layout, Typography, theme } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout

type LoginPageProps = {
  isAuthorized: boolean
  onLoginSuccess: (login: string) => void
}

export function LoginPage({ isAuthorized, onLoginSuccess }: LoginPageProps) {
  const { token } = theme.useToken()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthorized) {
      navigate('/')
    }
  }, [isAuthorized, navigate])

  return (
    <Content style={{ padding: token.paddingLG }}>
      <div style={{ maxWidth: 460, marginInline: 'auto' }}>
        <Card>
          <Typography.Title level={3}>Login</Typography.Title>
          <Form
            layout="vertical"
            onFinish={(values: { login: string; password: string }) => onLoginSuccess(values.login)}
          >
            <Form.Item
              label="Login"
              name="login"
              rules={[{ required: true, message: 'Please enter login' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 4, message: 'Password must be at least 4 characters long' },
                {
                  pattern: /[a-z]/i,
                  message: 'Password must contain at least one Latin letter',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item style={{ marginBottom: token.marginSM }}>
              <Button type="primary" htmlType="submit" block>
                Sign in
              </Button>
            </Form.Item>
          </Form>
          <Typography.Text type="secondary">
            Password must be at least 4 characters long and contain at least one Latin letter. There is
            no server-side authorization, so you can enter any data that passes validation.
          </Typography.Text>
        </Card>
      </div>
    </Content>
  )
}
