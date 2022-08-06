import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Icon, IconProps } from '@globalfishingwatch/ui-components'
import { isGFWUser } from 'features/user/user.slice'
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
  const gfwUser = useSelector(isGFWUser)

  if (!gfwUser) return null

  if (type === 'only-icon') {
    return (
      <Icon
        {...defaultIconProps}
        style={{ ...defaultIconProps.style, ...style }}
        className={className}
        tooltip={t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
      />
    )
  }
  return (
    <span className={cx(styles.GFWOnly, className)}>
      <Icon {...defaultIconProps} />
      {t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
    </span>
  )
}

export default GFWOnly
