import { SearchOutlined } from '@ant-design/icons'
import { theme as antdTheme } from 'antd'

type HeaderBrandProps = {
  onClick: () => void
}

export function HeaderBrand({ onClick }: HeaderBrandProps) {
  const { token } = antdTheme.useToken()
  const brandSize = token.fontSizeHeading4

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        columnGap: token.marginXS,
        fontSize: brandSize,
        fontWeight: token.fontWeightStrong,
        color: token.colorText,
        cursor: 'pointer',
        userSelect: 'none',
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
