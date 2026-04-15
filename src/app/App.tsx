import { Layout, theme } from 'antd'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SchedulePage } from '../pages/SchedulePage'
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
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get('search') ?? '')
  const [authData, setAuthData] = useState<AuthData | null>(readAuthData)
  const isAuthorized = authData !== null

  useEffect(() => {
    const searchFromUrl = new URLSearchParams(location.search).get('search') ?? ''
    setSearch((prev) => (prev === searchFromUrl ? prev : searchFromUrl))
  }, [location.search])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    const trimmedValue = value.trim()
    const targetSearch = trimmedValue ? `?search=${encodeURIComponent(trimmedValue)}` : ''
    navigate({ pathname: '/', search: targetSearch })
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

  const toggleWatchLater = (showId: number, title: string) => {
    setAuthData((prevAuthData) => {
      if (!prevAuthData) return prevAuthData

      const alreadyInWatchLater = prevAuthData.watchLater.some((item) => item.showId === showId)
      const nextAuthData: AuthData = {
        ...prevAuthData,
        watchLater: alreadyInWatchLater
          ? prevAuthData.watchLater.filter((item) => item.showId !== showId)
          : [...prevAuthData.watchLater, { showId, title }],
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthData))
      return nextAuthData
    })
  }

  const setMovieRating = (showId: number, title: string, rating: number) => {
    setAuthData((prevAuthData) => {
      if (!prevAuthData) return prevAuthData

      const existingMovie = prevAuthData.ratedMovies.some((movie) => movie.showId === showId)
      const nextRatedMovies = existingMovie
        ? prevAuthData.ratedMovies.map((movie) =>
            movie.showId === showId ? { ...movie, rating, title } : movie,
          )
        : [...prevAuthData.ratedMovies, { showId, title, rating }]

      const nextAuthData: AuthData = {
        ...prevAuthData,
        ratedMovies: nextRatedMovies,
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuthData))
      return nextAuthData
    })
  }

  const layoutStyle = {
    minHeight: '100vh',
    background: token.colorBgLayout,
    '--app-header-height': `${fixedHeaderHeight}px`,
    '--app-footer-height': `${fixedFooterHeight}px`,
  } as CSSProperties

  const footerStyle = {
    '--footer-bg': token.colorBgContainer,
    '--footer-z': token.zIndexBase,
  } as CSSProperties

  return (
    <AuthContext.Provider value={{ authData, isAuthorized, login, logout, toggleWatchLater, setMovieRating }}>
      <Layout className="app-shell" style={layoutStyle}>
        <AppHeader
          search={search}
          setSearch={handleSearchChange}
          onHome={handleHome}
        />
        <Routes>
          <Route path="/" element={<ShowListPage search={search} />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
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
        <Footer className="app-footer" style={footerStyle}>
          2026 Mindvan / Ivan Eroshin. Использованы данные из API REST TV Maze / Возможно, потребуется VPN
        </Footer>
      </Layout>
    </AuthContext.Provider>
  )
}

export default App
