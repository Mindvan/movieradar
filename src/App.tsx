import { useEffect } from 'react'
import { Layout, theme } from 'antd'
// import './App.css'
import { AppHeader } from './components/Header/AppHeader'

const { Content } = Layout

function App() {
  const { token } = theme.useToken()

  const fetchData = async () => {
    const url = 'https://api.tvmaze.com/search/shows?q=miraculous';

    try {
      const response = await fetch(url);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <AppHeader />
      <Content style={{ padding: token.paddingLG }}>
        HELLO, WORLD
      </Content>
    </Layout>
  )
}

export default App
