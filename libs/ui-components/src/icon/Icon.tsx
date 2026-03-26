/// <reference types="vite/client" />
import React, { lazy,Suspense } from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import type { IconType } from './icon.config'
import icons from './icon.config'

import styles from './Icon.module.css'

type IconComponent = React.LazyExoticComponent<React.ComponentType<any>>

const IconComponents = icons.reduce<Record<IconType, IconComponent>>((acc, icon) => {
  acc[icon] = lazy(async () => {
    const svgModule: any = await import(`./icons/${icon}.svg`)
    return {
      default: svgModule.ReactComponent || svgModule.default || svgModule,
    }
  })
  return acc
}, {} as Record<IconType, IconComponent>)

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
  const Component = IconComponents[icon]
  if (!Component) {
    console.warn(`<Icon /> ui-component is missing "${icon}" icon. Rendering null`)
    return null
  }
  return (
    <Tooltip content={tooltip as React.ReactNode} placement="top">
      <Suspense fallback={null}>
        <Component
          className={cx(styles.icon, styles[type], className)}
          style={style}
          {...(testId && { 'data-test': testId })}
        />
      </Suspense>
    </Tooltip>
  )
}
