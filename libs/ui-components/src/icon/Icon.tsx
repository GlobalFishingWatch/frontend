/// <reference types="vite/client" />
import React from 'react'
import cx from 'classnames'

import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import type { IconType } from './icon.config'

import styles from './Icon.module.css'

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>

const NullIcon = () => null

// builds the IconComponents map synchronously at module load
const svgModules = import.meta.glob<Record<string, any>>('./icons/*.svg', { eager: true })

const IconComponents = Object.entries(svgModules).reduce<Record<string, IconComponent>>(
  (acc, [path, svgModule]) => {
    const name = path.slice('./icons/'.length, -'.svg'.length)
    acc[name] = svgModule?.ReactComponent || svgModule?.default || svgModule || NullIcon
    return acc
  },
  {}
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
      <Component
        className={cx(styles.icon, styles[type], className)}
        style={style}
        {...(testId && { 'data-test': testId })}
      />
    </Tooltip>
  )
}
