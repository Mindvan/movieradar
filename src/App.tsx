import { Layout, theme } from 'antd'
import { AppHeader } from './components/Header'
import './index.css'

const { Content } = Layout

function App() {
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout  }}>
      <AppHeader />
      <Content style={{ padding: token.paddingLG }}>
        HELLO, WORLD
      </Content>
    </Layout>
  )
}

export default App
