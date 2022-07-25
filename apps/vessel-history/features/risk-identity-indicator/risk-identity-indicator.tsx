import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './risk-identity-indicator.module.css'

export interface RiskIdentityIndicatorProps {
  onInfoClick?: (event) => void
  title: string
  subtitle?: string
}

export function RiskIdentityIndicator({
  title,
  subtitle,
  onInfoClick = () => {},
}: RiskIdentityIndicatorProps) {
  return (
    <div className={styles['container']}>
      <div className={styles.title}>
        <div>
          {title}
          {!!subtitle && <span className={styles.subtitle}> {subtitle}</span>}
        </div>
        <IconButton
          icon={'info'}
          size="small"
          className={styles.info}
          onClick={onInfoClick}
        ></IconButton>
      </div>
    </div>
  )
}

export default RiskIdentityIndicator
