import { Button, Layout, Result, theme } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Content } = Layout

export function NotFoundPage() {
  const { token } = theme.useToken()
  const navigate = useNavigate()

  return (
    <Content style={{ padding: token.paddingLG }}>
      <Result
        status="404"
        title="404"
        subTitle="Страница не найдена"
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            На главную
          </Button>
        }
      />
    </Content>
  )
}
