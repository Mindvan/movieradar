import { Empty, List, Typography, theme as antdTheme } from 'antd'

type SearchSuggestionsPanelProps = {
  query: string
  items: string[]
}

export function SearchSuggestionsPanel({ query, items }: SearchSuggestionsPanelProps) {
  const { token } = antdTheme.useToken()

  if (query.trim() === '') return null

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: token.marginXS,
        maxHeight: 280,
        overflowY: 'auto',
        background: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: token.boxShadowSecondary,
        zIndex: token.zIndexPopupBase,
      }}
    >
      {items.length > 0 ? (
        <List
          size="small"
          split={false}
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              key={`${item}-${index}`}
              style={{
                margin: 0,
                padding: `${token.paddingXS}px ${token.paddingSM}px`,
                cursor: 'pointer',
                borderRadius: token.borderRadius,
                transition: `background-color ${token.motionDurationFast}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = token.controlItemBgHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Typography.Text ellipsis style={{ width: '100%' }}>
                {item}
              </Typography.Text>
            </List.Item>
          )}
        />
      ) : (
        <Empty
          description={
            <Typography.Text type="secondary">
              По запросу ничего не нашлось — попробуйте другие слова
            </Typography.Text>
          }
          styles={{
            root: { margin: 0, padding: `${token.paddingMD}px ${token.paddingSM}px` },
          }}
        />
      )}
    </div>
  )
}
