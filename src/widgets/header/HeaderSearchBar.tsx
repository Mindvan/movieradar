import { Input, theme as antdTheme } from 'antd'

const { Search } = Input

type HeaderSearchBarProps = {
  search: string
  setSearch: (value: string) => void
}

export function HeaderSearchBar({ search, setSearch }: HeaderSearchBarProps) {
  const { token } = antdTheme.useToken()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minWidth: 0,
        paddingInline: token.paddingMD,
      }}
    >
      <Search
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        allowClear
        enterButton
        placeholder="Enter the movie name"
        style={{ width: '100%', maxWidth: 440 }}
      />
    </div>
  )
}
