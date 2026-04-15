import { SearchOutlined } from '@ant-design/icons'
import { theme as antdTheme } from 'antd'
import type { CSSProperties } from 'react'

type HeaderBrandProps = {
  onClick: () => void
}

export function HeaderBrand({ onClick }: HeaderBrandProps) {
  const { token } = antdTheme.useToken()
  const brandStyle = {
    '--brand-size': `${token.fontSizeHeading4}px`,
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: token.marginXS,
    fontWeight: token.fontWeightStrong,
    color: token.colorText,
    cursor: 'pointer',
    userSelect: 'none',
  } as CSSProperties

  return (
    <span
      onClick={onClick}
      className="header-brand"
      style={brandStyle}
      aria-label="MovieRadar"
    >
      <span
        className="header-brand__icon"
        style={{
          display: 'inline-flex',
          lineHeight: 0,
          transform: 'translateY(0.08em)',
        }}
      >
        <SearchOutlined style={{ fontSize: '1em', color: token.colorPrimary }} />
      </span>
      <span className="header-brand__text" style={{ lineHeight: 1 }}>MovieRadar</span>
    </span>
  )
}
