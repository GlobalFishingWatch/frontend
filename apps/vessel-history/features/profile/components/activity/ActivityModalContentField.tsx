import type { ReactNode } from 'react';
import React, { Fragment } from 'react'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import styles from './ActivityModalContentField.module.css'

interface ActivityModalContentFieldProps {
  className?: string
  label: string
  value: string | ReactNode
  onHelpClick?: () => void
  onValueClick?: () => void
}

const ActivityModalContentField: React.FC<ActivityModalContentFieldProps> = ({
  className,
  label,
  value,
  onHelpClick,
  onValueClick,
}: ActivityModalContentFieldProps): React.ReactElement<any> => {
  return (
    <Fragment>
      <div className={cx(className, styles.field)}>
        <label className={styles.label}>{label}</label>
        <span className={styles.value}>
          <Fragment>
            {onValueClick ? (
              <span className={styles.valueLink} onClick={onValueClick}>
                {value}
              </span>
            ) : (
              value
            )}
            {onHelpClick && <IconButton icon="info" size="tiny" onClick={onHelpClick} />}
          </Fragment>
        </span>
      </div>
    </Fragment>
  )
}

export default ActivityModalContentField
