import { Input, theme as antdTheme } from 'antd'
import type { CSSProperties } from 'react'

const { Search } = Input

type HeaderSearchBarProps = {
  search: string
  setSearch: (value: string) => void
}

export function HeaderSearchBar({ search, setSearch }: HeaderSearchBarProps) {
  const { token } = antdTheme.useToken()

  return (
    <div className="header-search-wrap" style={{ '--header-search-pad': `${token.paddingMD}px` } as CSSProperties}>
      <Search
        className="header-search-input"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        allowClear
        enterButton
        placeholder="Enter the movie name"
        style={{ width: '100%' }}
      />
    </div>
  )
}
