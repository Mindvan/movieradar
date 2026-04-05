import { Space, Typography } from 'antd'
import { useContext } from 'react'
import { ThemeContext, type ThemeContextType, type ThemeType } from '../../context/ThemeContext'

const themeName: Record<ThemeType, string> = {
  dark: 'Тёмная',
  light: 'Светлая',
}

export function HeaderActions() {
  const { theme: themeValue, setTheme } = useContext<ThemeContextType>(ThemeContext)

  return (
    <Space size="large" align="center">
      <Typography.Link>Войти</Typography.Link>
      <Typography.Link onClick={() => setTheme(themeValue === 'dark' ? 'light' : 'dark')}>
        Тема: {themeName[themeValue]}
      </Typography.Link>
    </Space>
  )
}
