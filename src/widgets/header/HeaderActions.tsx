import { Space, Typography } from 'antd'
import { useContext } from 'react'
import { KEY_THEME } from '../../app/providers/AppProvider'
import { AuthContext } from '../../app/providers/AuthContext'
import { ThemeContext, type ThemeContextType, type ThemeType } from '../../app/providers/ThemeContext'
import { useNavigate } from 'react-router-dom'

const themeName: Record<ThemeType, string> = {
  dark: 'Dark',
  light: 'Light',
}

export function HeaderActions() {
  const navigate = useNavigate()
  const { isAuthorized, logout } = useContext(AuthContext)
  const { theme: themeValue, setTheme } = useContext<ThemeContextType>(ThemeContext)

  function toggleTheme() {
    const value = themeValue === 'dark' ? 'light' : 'dark'
    localStorage.setItem(KEY_THEME, value)
    setTheme(value)
  }

  return (
    <Space size="large" align="center">
      {isAuthorized ? (
        <>
          <Typography.Link onClick={() => navigate('/profile')}>My profile</Typography.Link>
          <Typography.Link onClick={logout}>Log out</Typography.Link>
        </>
      ) : (
        <Typography.Link onClick={() => navigate('/login')}>Login</Typography.Link>
      )}
      <Typography.Link onClick={toggleTheme}>
        Theme: {themeName[themeValue]}
      </Typography.Link>
    </Space>
  )
}
