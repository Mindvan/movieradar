import { Layout, theme as antdTheme } from 'antd'
import type { CSSProperties } from 'react'
import { HeaderActions } from './HeaderActions'
import { HeaderBrand } from './HeaderBrand'
import { HeaderSearchBar } from './HeaderSearchBar'
import { HeaderThemeToggle } from './HeaderThemeToggle'

const { Header } = Layout

type AppHeaderProps = {
  search: string
  setSearch: (value: string) => void
  onHome: () => void
}

export function AppHeader({ search, setSearch, onHome }: AppHeaderProps) {
  const { token } = antdTheme.useToken()
  const headerStyle = {
    '--header-bg': token.colorBgContainer,
    '--header-border': token.colorBorderSecondary,
    '--header-z': token.zIndexPopupBase,
  } as CSSProperties

  return (
    <Header className="app-header" style={headerStyle}>
      <div className="app-header__brand">
        <div className="app-header__brand-inner">
          <HeaderBrand onClick={onHome} />
          <HeaderThemeToggle />
        </div>
      </div>
      <HeaderSearchBar search={search} setSearch={setSearch} />
      <div className="app-header__actions">
        <HeaderActions />
      </div>
    </Header>
  )
}
