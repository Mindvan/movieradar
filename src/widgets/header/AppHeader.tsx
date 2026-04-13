import { Layout, theme as antdTheme } from 'antd'
import { HeaderActions } from './HeaderActions'
import { HeaderBrand } from './HeaderBrand'
import { HeaderSearchBar } from './HeaderSearchBar'

const { Header } = Layout

type AppHeaderProps = {
  search: string
  setSearch: (value: string) => void
  onHome: () => void
}

export function AppHeader({ search, setSearch, onHome }: AppHeaderProps) {
  const { token } = antdTheme.useToken()

  return (
    <Header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: token.zIndexPopupBase,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 520px) minmax(0, 1fr)',
        alignItems: 'center',
        columnGap: token.paddingMD,
        paddingInline: token.paddingLG,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        lineHeight: 1,
      }}
    >
      <div style={{ justifySelf: 'start' }}>
        <HeaderBrand onClick={onHome} />
      </div>
      <HeaderSearchBar search={search} setSearch={setSearch} />
      <div style={{ justifySelf: 'end' }}>
        <HeaderActions />
      </div>
    </Header>
  )
}
