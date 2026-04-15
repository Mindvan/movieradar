import { Typography } from 'antd'
import { useContext } from 'react'
import { KEY_THEME } from '../../app/providers/AppProvider'
import { ThemeContext, type ThemeContextType, type ThemeType } from '../../app/providers/ThemeContext'

const themeName: Record<ThemeType, string> = {
  dark: 'Dark',
  light: 'Light',
}

export function HeaderThemeToggle() {
  const { theme: themeValue, setTheme } = useContext<ThemeContextType>(ThemeContext)

  function toggleTheme() {
    const value = themeValue === 'dark' ? 'light' : 'dark'
    localStorage.setItem(KEY_THEME, value)
    setTheme(value)
  }

  return (
    <Typography.Link
      className={`header-theme-toggle header-theme-toggle--${themeValue}`}
      onClick={toggleTheme}
    >
      <span className="header-theme-toggle__label">Theme</span>
      <span className="header-theme-toggle__value">{themeName[themeValue]}</span>
    </Typography.Link>
  )
}
