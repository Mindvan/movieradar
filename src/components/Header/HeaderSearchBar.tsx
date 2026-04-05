import { Input, theme as antdTheme } from 'antd'
import { SearchSuggestionsPanel } from './SearchSuggestionsPanel'
import { useSearch } from '../../hooks/useSearch'

const { Search } = Input

export function HeaderSearchBar() {
  const { token } = antdTheme.useToken()
  const { search, data, handleChange } = useSearch()

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        minWidth: 0,
        paddingInline: token.paddingMD,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 440,
        }}
      >
        <Search
          value={search}
          onChange={handleChange}
          placeholder="Введи название фильма"
          allowClear
          enterButton
          style={{ width: '100%' }}
        />
        <SearchSuggestionsPanel query={search} items={data} />
      </div>
    </div>
  )
}
