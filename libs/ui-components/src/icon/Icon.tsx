/// <reference types="vite/client" />
import React from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import type { IconType } from './icon.config'
import icons from './icon.config'

import styles from './Icon.module.css'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const iconModules = import.meta.glob<IconComponent>('./icons/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
})

function getIconComponent(icon: IconType): IconComponent | null {
  return iconModules[`./icons/${icon}.svg`] ?? null
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

  const Component = getIconComponent(icon)
  if (!Component && !icons.includes(icon)) {
    console.warn(`<Icon /> ui-component is missing "${icon}" icon. Rendering null`)
  }

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
