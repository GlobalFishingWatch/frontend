import cx from 'classnames'
import { ReactNode } from 'react'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import styles from './risk-section.module.css'

/* eslint-disable-next-line */
export interface RiskSectionProps {
  children?: ReactNode
  severity: 'high' | 'med' | 'low' | 'none'
  title: string
  titleInfo?: ReactNode
}

export function RiskSection({ children, severity, title, titleInfo }: RiskSectionProps) {
  return (
    <div className={cx(styles['container'], styles[severity])}>
      <label className={styles.sectionLabel}>
        {title}
        {titleInfo && (
          <DataAndTerminology size="tiny" type="default" title={title}>
            {titleInfo}
          </DataAndTerminology>
        )}
      </label>
      {children}
    </div>
  )
}

export default RiskSection
