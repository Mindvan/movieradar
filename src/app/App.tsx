import { Layout, theme } from 'antd'
import { useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ShowListPage } from '../pages/ShowListPage'
import { ShowPage } from '../pages/ShowPage'
import { AppHeader } from '../widgets/header/index'
import { AUTH_STORAGE_KEY, readAuthData, type AuthData } from '../entities/user'
import { AuthContext } from './providers/AuthContext'
import '../shared/styles/index.css'

const { Footer } = Layout
const fixedHeaderHeight = 64
const fixedFooterHeight = 56

function App() {
  const { token } = theme.useToken()
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [authData, setAuthData] = useState<AuthData | null>(readAuthData)
  const isAuthorized = authData !== null

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleHome = () => {
    navigate('/')
  }

  const login = (login: string) => {
    const nextAuthData: AuthData = {
      login,
      ratedMovies: [],
      watchLater: [],
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthData))
    setAuthData(nextAuthData)
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuthData(null)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ authData, isAuthorized, login, logout }}>
      <Layout
        style={{
          minHeight: '100vh',
          background: token.colorBgLayout,
          paddingTop: fixedHeaderHeight,
          paddingBottom: fixedFooterHeight,
        }}
      >
        <AppHeader
          search={search}
          setSearch={handleSearchChange}
          onHome={handleHome}
        />
        <Routes>
          <Route path="/" element={<ShowListPage search={search} />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route
            path="/login"
            element={<LoginPage isAuthorized={isAuthorized} onLoginSuccess={login} />}
          />
          <Route
            path="/profile"
            element={
              authData ? (
                <ProfilePage authData={authData} />
              ) : (
                <LoginPage isAuthorized={false} onLoginSuccess={login} />
              )
            }
          />
        </Routes>
        <Footer
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            height: fixedFooterHeight,
            display: 'flex',
            alignItems: 'center',
            textAlign: 'left',
            background: token.colorBgContainer,
            zIndex: token.zIndexBase,
          }}
        >
          2026 Mindvan / Ivan Eroshin. Использованы данные из API REST TV Maze / Возможно, потребуется VPN
        </Footer>
      </Layout>
    </AuthContext.Provider>
  )
}

export default App
