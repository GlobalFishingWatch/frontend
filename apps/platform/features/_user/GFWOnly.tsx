import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { IconLogoProps } from '@globalfishingwatch/ui-components/icon-logo'
import { IconLogo } from '@globalfishingwatch/ui-components/icon-logo'

import { selectIsGFWUser, selectIsJACUser } from 'features/_user/selectors/user.selectors'

import styles from './GFWOnly.module.css'

type GFWOnlyProps = {
  type?: 'default' | 'only-icon'
  style?: IconLogoProps['style']
  className?: string
  userGroup?: 'gfw' | 'jac' | 'both' | 'any'
  children?: React.ReactNode
}

const defaultIconProps: IconLogoProps = {
  style: { transform: 'translateY(25%)' },
  icon: 'gfw',
}

function GFWOnly(props: GFWOnlyProps) {
  const { type = 'default', style = {}, className = '', userGroup, children } = props
  const { t } = useTranslation()
  const gfwUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)

  if (!gfwUser && !jacUser) return null

  let content: React.ReactNode = ''
  if (children) {
    content = children
  } else {
    if (userGroup === 'jac') {
      content = t((t) => t.common.onlyVisibleForJAC)
    } else if (userGroup === 'gfw') {
      content = t((t) => t.common.onlyVisibleForGFW)
    } else if (userGroup === 'both') {
      content = t((t) => t.common.onlyVisibleForGFWAndJAC)
    } else if (userGroup === 'any') {
      if (gfwUser) {
        content = t((t) => t.common.onlyVisibleForGFW)
      } else if (jacUser) {
        content = t((t) => t.common.onlyVisibleForJAC)
      }
    }
  }

  if (type === 'only-icon') {
    return userGroup === 'jac' ? (
      <span title={content as string}>🔓</span>
    ) : (
      <IconLogo
        {...defaultIconProps}
        style={{ ...defaultIconProps.style, ...style }}
        className={className}
        tooltip={content}
      />
    )
  }
  return (
    <span className={cx(styles.GFWOnly, className)}>
      {userGroup === 'jac' ? `🔓` : <IconLogo {...defaultIconProps} />}
      {content}
    </span>
  )
}

export default GFWOnly
