import React, { lazy,Suspense } from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import type { IconType } from './icon.config'
import icons from './icon.config'

import styles from './Icon.module.css'

const IconComponents = icons.reduce(
  (acc, icon) => {
    acc[icon] = lazy(() =>
      import(
        /* webpackChunkName: "icon-[request]" */
        `./icons/${icon}.svg`
      ).then((m) => ({ default: m.ReactComponent || m.default || m }))
    )
    return acc
  },
  {} as Record<IconType, any>
)

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
