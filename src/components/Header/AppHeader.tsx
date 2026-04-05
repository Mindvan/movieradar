import { Input, Layout, Space, Typography, theme } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useContext, useEffect } from 'react'
import { ThemeContext } from '../../context/ThemeContext'

const { Header } = Layout
const { Search } = Input
const themeName = {
  dark: 'Тёмная',
  light: 'Светлая'
}

export function AppHeader() {
  const { token } = theme.useToken()
  const brandSize = token.fontSizeHeading4

  const {theme: themeValue, setTheme} = useContext(ThemeContext);

  useEffect(() => {
    console.log(themeValue);
  }, [themeValue, setTheme])

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: token.paddingLG,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          columnGap: token.marginXS,
          fontSize: brandSize,
          fontWeight: token.fontWeightStrong,
          color: token.colorText,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            lineHeight: 0,
            transform: 'translateY(0.08em)',
          }}
        >
          <SearchOutlined style={{ fontSize: '1em', color: token.colorPrimary }} />
        </span>
        <span style={{ lineHeight: 1 }}>MovieRadar</span>
      </span>
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          minWidth: 0,
          paddingInline: token.paddingMD,
        }}
      >
        <Search
          placeholder="Введи название фильма"
          allowClear
          enterButton
          style={{ maxWidth: 440, width: '100%' }}
        />
      </div>
      <Space size="large" align="center">
        <Typography.Link>Войти</Typography.Link>
        <Typography.Link onClick={() => setTheme(themeValue === 'dark' ? 'light' : 'dark')}>Тема: {themeName[themeValue]}</Typography.Link>
      </Space>
    </Header>
  )
}
