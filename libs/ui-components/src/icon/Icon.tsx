import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import type { IconType } from './icon.config'
import icons from './icon.config'

import styles from './Icon.module.css'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const NullIcon = () => null

// Resolved icon components cached at module scope so an already-loaded icon renders
// synchronously on later mounts (no re-fetch, no flicker on route change). Always
// empty on the server, which keeps the first client (hydration) render in sync.
const iconCache = new Map<IconType, IconComponent>()

async function loadIcon(icon: IconType): Promise<IconComponent> {
  const svgModule: any = await import(`./icons/${icon}.svg`)
  return svgModule?.ReactComponent || svgModule?.default || svgModule || NullIcon
}

export interface IconProps {
  className?: string
  icon: IconType
  style?: React.CSSProperties
  type?: 'default' | 'warning' | 'original-colors'
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
  testId?: string
}

const defaultStyle = {}

export function Icon(props: IconProps) {
  const { icon, tooltip, type = 'default', className = '', style = defaultStyle, testId } = props
  // Re-render trigger once an uncached icon finishes loading. Kept per-icon so a prop
  // change to a not-yet-loaded icon doesn't briefly render the previous one.
  const [loaded, setLoaded] = useState<{ icon: IconType; Component: IconComponent } | null>(null)

  useEffect(() => {
    if (!icons.includes(icon)) {
      console.warn(`<Icon /> ui-component is missing "${icon}" icon. Rendering null`)
      return
    }
    if (iconCache.has(icon)) {
      return
    }
    let active = true
    loadIcon(icon).then((LoadedIcon) => {
      iconCache.set(icon, LoadedIcon)
      if (active) {
        setLoaded({ icon, Component: LoadedIcon })
      }
    })
    return () => {
      active = false
    }
  }, [icon])

  // Resolved synchronously from cache (empty on the server, so the first client
  // render matches the server markup), otherwise from the load above.
  const Component = iconCache.get(icon) ?? (loaded?.icon === icon ? loaded.Component : null)

  return (
    <Tooltip content={tooltip as React.ReactNode} placement="top">
      {Component
        ? React.createElement(Component, {
            className: cx(styles.icon, styles[type], className),
            style,
            ...(testId && { 'data-test': testId }),
          })
        : null}
    </Tooltip>
  )
}
