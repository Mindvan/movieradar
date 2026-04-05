import { theme as antdTheme } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export function HeaderBrand() {
  const { token } = antdTheme.useToken()
  const brandSize = token.fontSizeHeading4

  return (
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
  )
}
