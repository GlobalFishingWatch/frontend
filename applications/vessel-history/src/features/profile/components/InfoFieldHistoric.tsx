import React from 'react'
import { DateTime } from 'luxon'
import { HistoricValue } from 'classes/vessel.class'
import styles from './Info.module.css'

interface ListItemProps {
  historic: HistoricValue[]
}

const InfoFieldHistoric: React.FC<ListItemProps> = (props): React.ReactElement => {
  const formatedDate = (historyDate: Date) => {
    if (historyDate) {
      const date = DateTime.fromJSDate(historyDate)
      return [date.toLocaleString(DateTime.DATETIME_MED), 'UTC'].join(' ')
    }

    return ''
  }

  return (
    <div>
      {props.historic.map((historicValue: HistoricValue, index) => {
        return (
          <div key={index}>
            {historicValue.data}:{' '}
            {historicValue.start && (
              <small className={styles.historyRange}>
                From {formatedDate(historicValue.start)}
              </small>
            )}
            {historicValue.end && (
              <small className={styles.historyRange}> to {formatedDate(historicValue.end)}</small>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default InfoFieldHistoric
