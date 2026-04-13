import { ConfigProvider, theme as antdTheme } from 'antd'
import { useState, type ReactNode } from 'react'
import { ThemeContext, type ThemeType } from './ThemeContext'

export const KEY_THEME = 'theme'

function defaultThemeValue() {
  if (typeof window === 'undefined') return 'light'
  const value = localStorage.getItem(KEY_THEME)
  return value === 'dark' ? 'dark' : 'light'
}

type AppProviderProps = {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  const [theme, setTheme] = useState<ThemeType>(defaultThemeValue)
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ConfigProvider
        theme={{
          algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}
