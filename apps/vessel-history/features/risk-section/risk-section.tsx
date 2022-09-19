import cx from 'classnames'
import { ReactNode } from 'react'
import { Icon, IconType } from '@globalfishingwatch/ui-components'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import styles from './risk-section.module.css'

export interface RiskSectionProps {
  children?: ReactNode
  className?: string
  severity?: 'high' | 'medium' | 'low' | 'none'
  title?: string
  titleInfo?: ReactNode
  icon?: IconType
}

export function RiskSection({
  children,
  className = '',
  severity,
  title,
  titleInfo,
  icon,
}: RiskSectionProps) {
  return (
    <div className={cx(styles['container'], styles[severity], className)}>
      {title && (
        <label className={styles.sectionLabel}>
          {icon && (
            <span className={cx(styles.categoryIcon, styles[icon])}>
              <Icon icon={icon} />
            </span>
          )}
          {title}
          {titleInfo && (
            <DataAndTerminology size="tiny" type="default" title={title}>
              {titleInfo}
            </DataAndTerminology>
          )}
        </label>
      )}
      {children}
    </div>
  )
}

export default RiskSection
