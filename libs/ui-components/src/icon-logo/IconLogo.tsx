/// <reference types="vite/client" />
import type React from 'react'

import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

// Logos are mostly embedded PNGs, so they ship as image files fetched only when rendered,
// not as components bundled with every <Icon>. Files under Vite's inline limit become data URIs.
const logoUrls = import.meta.glob<string>('./logos/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export type IconLogoType =
  | 'blue-habitats'
  | 'copernicus'
  | 'duke'
  | 'fao'
  | 'gca'
  | 'gebco'
  | 'gfw'
  | 'hycom'
  | 'isa'
  | 'marine-regions'
  | 'mci'
  | 'nasa'
  | 'pacioos'
  | 'protected-planet'
  | 'protected-seas'
  | 'unep'

export interface IconLogoProps {
  icon: IconLogoType
  className?: string
  style?: React.CSSProperties
  tooltip?: TooltipTypes
  testId?: string
}

export function IconLogo({ icon, className, style, tooltip, testId }: IconLogoProps) {
  return (
    <Tooltip content={tooltip as React.ReactNode} placement="top">
      <img
        src={logoUrls[`./logos/${icon}.svg`]}
        alt=""
        className={className}
        style={style}
        {...(testId && { 'data-test': testId })}
      />
    </Tooltip>
  )
}
