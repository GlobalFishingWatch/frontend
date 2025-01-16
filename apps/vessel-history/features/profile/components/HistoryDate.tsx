import React, { Fragment } from 'react'

import { I18nSpecialDate } from 'features/i18n/i18nDate'

import styles from './Info.module.css'

interface HistoryDateProps {
  date?: string
  originalDate?: number
  label?: string
  className?: string
  labelClassName?: string
}

const HistoryDate: React.FC<HistoryDateProps> = ({
  date,
  originalDate,
  label,
}): React.ReactElement<any> => {
  return (
    <Fragment>
      {(date || originalDate) && (
        <div>
          {label && <span className={styles.rangeLabel}>{label}: </span>}
          <span className={styles.rangeValue}>
            <I18nSpecialDate date={date ?? originalDate ?? ''} />
          </span>
        </div>
      )}
    </Fragment>
  )
}
export default HistoryDate
