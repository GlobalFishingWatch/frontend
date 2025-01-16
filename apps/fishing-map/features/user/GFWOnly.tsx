import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { IconProps } from '@globalfishingwatch/ui-components'
import { Icon } from '@globalfishingwatch/ui-components'

import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'

import styles from './GFWOnly.module.css'

type GFWOnlyProps = {
  type?: 'default' | 'only-icon'
  style?: IconProps['style']
  className?: string
}

const defaultIconProps: IconProps = {
  style: { transform: 'translateY(25%)' },
  icon: 'gfw-logo',
  type: 'original-colors',
}

function GFWOnly(props: GFWOnlyProps) {
  const { type = 'default', style = {}, className = '' } = props
  const { t } = useTranslation()
  const gfwUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)

  if (!gfwUser && !jacUser) return null

  const disclaimerText = jacUser
    ? t('common.onlyVisibleForJAC', 'Only visible for JAC users')
    : t('common.onlyVisibleForGFW', 'Only visible for GFW users')

  if (type === 'only-icon') {
    return jacUser ? (
      <span title={disclaimerText}>🔓</span>
    ) : (
      <Icon
        {...defaultIconProps}
        style={{ ...defaultIconProps.style, ...style }}
        className={className}
        tooltip={disclaimerText}
      />
    )
  }
  return (
    <span className={cx(styles.GFWOnly, className)}>
      {jacUser ? `🔓` : <Icon {...defaultIconProps} />}
      {disclaimerText}
    </span>
  )
}

export default GFWOnly
