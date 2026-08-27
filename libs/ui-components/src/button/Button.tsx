import React from 'react'
import cx from 'classnames'

import { Spinner } from '../spinner'
import type { TooltipPlacement } from '../tooltip'
import { Tooltip } from '../tooltip'
import type { TooltipTypes } from '../types/types'

import styles from './Button.module.css'

export type ButtonType = 'default' | 'secondary' | 'border-secondary'
export type ButtonSize = 'tiny' | 'small' | 'medium' | 'default' | 'big' | 'verybig'
export type HTMLButtonType = 'submit' | 'reset' | 'button' | undefined

export interface ButtonProps {
  id?: string
  type?: ButtonType
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
  tooltip?: TooltipTypes
  tooltipPlacement?: TooltipPlacement
  onClick?: (e: React.MouseEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  href?: string
  target?: string
  htmlType?: HTMLButtonType
  testId?: string
  /**
   * Lets a router link (eg. tanstack's `Link`) look like a button
   * without this lib depending on a router.
   **/
  asChild?: boolean
}

type ChildProps = { className?: string; children?: React.ReactNode }

function renderAsChild(
  children: React.ReactNode,
  buttonClassName: string,
  renderContent: (inner: React.ReactNode) => React.ReactNode,
  { disabled, testId }: Pick<ButtonProps, 'disabled' | 'testId'>
) {
  const child = React.Children.only(children) as React.ReactElement<ChildProps>
  const childProps: Record<string, unknown> = {
    className: cx(buttonClassName, child.props.className),
    ...(disabled && { 'aria-disabled': true }),
    ...(testId && { 'data-testid': testId }),
  }
  return React.cloneElement(
    child,
    childProps as Partial<ChildProps>,
    renderContent(child.props.children)
  )
}

export function Button(props: ButtonProps) {
  const {
    id,
    type = 'default',
    size = 'default',
    disabled = false,
    loading = false,
    icon,
    className,
    children,
    tooltip,
    tooltipPlacement = 'top',
    onClick,
    onMouseEnter,
    onMouseLeave,
    href,
    target,
    htmlType,
    testId,
    asChild = false,
  } = props
  const spinner = (
    <Spinner
      size={icon ? 'tiny' : 'small'}
      color={type === 'default' ? (disabled ? '#22447e' : 'white') : undefined}
    />
  )

  const renderContent = (inner: React.ReactNode) => (
    <React.Fragment>
      {loading ? spinner : icon}
      {inner}
    </React.Fragment>
  )
  const content = renderContent(children)
  const buttonClassName = cx(styles.button, styles[type], styles[`size-${size}`], className, {
    [styles.disabled]: disabled,
    [styles.loading]: loading,
  })
  return (
    <Tooltip content={tooltip as React.ReactNode} placement={tooltipPlacement}>
      {asChild ? (
        renderAsChild(children, buttonClassName, renderContent, {
          disabled,
          testId,
        })
      ) : href !== undefined && !disabled ? (
        <a href={href} target={target} onClick={onClick} className={buttonClassName}>
          {content}
        </a>
      ) : (
        <button
          id={id}
          className={buttonClassName}
          onClick={(e) => !loading && !disabled && onClick && onClick(e)}
          onMouseEnter={(e) => onMouseEnter && onMouseEnter(e)}
          onMouseLeave={(e) => onMouseLeave && onMouseLeave(e)}
          {...(testId && { 'data-testid': testId })}
          {...(htmlType ? { type: htmlType } : {})}
        >
          {content}
        </button>
      )}
    </Tooltip>
  )
}
