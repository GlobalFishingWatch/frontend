import type { ReactNode } from 'react'
import cx from 'classnames'

import type { IconType} from '@globalfishingwatch/ui-components';
import { Icon, Spinner } from '@globalfishingwatch/ui-components'

import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'

import styles from './risk-section.module.css'

export interface RiskSectionProps {
  children?: ReactNode
  className?: string
  severity?: 'high' | 'medium' | 'low' | 'none'
  title?: string
  titleInfo?: ReactNode
  icon?: IconType
  loading: boolean
}

export function RiskSection({
  children,
  className = '',
  severity,
  title,
  titleInfo,
  loading = false,
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
      {loading ? <Spinner className={styles.spinnerFull} /> : children}
    </div>
  )
}

export default RiskSection
