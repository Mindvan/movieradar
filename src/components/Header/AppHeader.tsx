import { Layout, theme as antdTheme } from 'antd'
import { HeaderActions } from './HeaderActions'
import { HeaderBrand } from './HeaderBrand'
import { HeaderSearchBar } from './HeaderSearchBar'

const { Header } = Layout

export function AppHeader() {
  const { token } = antdTheme.useToken()

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
      <HeaderBrand />
      <HeaderSearchBar />
      <HeaderActions />
    </Header>
  )
}
