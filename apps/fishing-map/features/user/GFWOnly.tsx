import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon, IconProps } from '@globalfishingwatch/ui-components'
import { isGFWUser } from 'features/user/user.slice'
import styles from './GFWOnly.module.css'

interface GFWOnlyProps {
  type?: 'default' | 'only-icon'
}

const defaultIconProps: IconProps = {
  style: { transform: 'translateY(25%)' },
  icon: 'gfw-logo',
  type: 'original-colors',
}

function GFWOnly(props: GFWOnlyProps) {
  const { type = 'default' } = props
  const { t } = useTranslation()
  const gfwUser = useSelector(isGFWUser)

  if (!gfwUser) return null

  if (type === 'only-icon') {
    return (
      <Icon
        {...defaultIconProps}
        tooltip={t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
      />
    )
  }
  return (
    <span className={styles.GFWOnly}>
      <Icon {...defaultIconProps} />
      {t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
    </span>
  )
}

export default GFWOnly
