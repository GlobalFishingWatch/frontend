import React, { useState } from 'react'
import cx from 'classnames'
import orderBy from 'lodash/orderBy'
import groupBy from 'lodash/groupBy'
import flatMap from 'lodash/flatMap'
import Tooltip from 'components/tooltip/tooltip'
import { VesselHistoricalChange } from 'types/api/models'
import { InfoField } from 'types/app.types'
import { ReactComponent as IconInfo } from 'assets/icons/info.svg'
import { formatUTCDate } from 'utils'
import styles from './info-field.module.css'

function orderFieldsByDate(values: VesselHistoricalChange[]) {
  if (!values || !values.length) return values
  const nonDatesValues = values.filter((v) => !v || !v.start)
  const datesValues = values.filter((v) => v && v.start)
  return [...orderBy(datesValues, 'start', 'desc'), ...nonDatesValues]
}

function groupField(fields: VesselHistoricalChange[]) {
  const fieldsGrouped = groupBy(orderFieldsByDate(fields), 'value')
  const groups = Object.keys(fieldsGrouped).reduce<{ [key: string]: any }>((acc, group) => {
    acc[group] = flatMap(fieldsGrouped[group], (authorization) => {
      return !authorization.start && !authorization.end ? [] : authorization
    })
    return acc
  }, {})
  return groups
}

interface InfoFieldProps {
  infoField: InfoField & { tooltip?: string }
  grouped: boolean
}

const InfoFieldComponent: React.FC<InfoFieldProps> = (props): React.ReactElement => {
  const { infoField, grouped } = props

  const [open, setOpen] = useState<boolean>(false)

  const switchOpen = () => {
    setOpen(!open)
  }

  const singleValue = typeof infoField.value === 'string' || typeof infoField.value === 'number'
  const value = singleValue ? infoField.value : orderFieldsByDate(infoField.value as any)
  if (singleValue) {
    return (
      <div className={styles.property}>
        <Tooltip content={infoField.tooltip}>
          <label>{infoField.label}</label>
        </Tooltip>
        <span>{infoField.value || '-'}</span>
      </div>
    )
  } else if (grouped) {
    const groups = groupField(infoField.value as VesselHistoricalChange[])
    const groupKeys = Object.keys(groups).sort()
    return (
      <ul className={styles.listContainer}>
        <label>{infoField.label}</label>
        {groupKeys.map((group, i) => {
          const groupValues = groups[group]
          const lines = groupValues
            .map((value: any) => {
              const start = value.start !== undefined ? `From ${formatUTCDate(value.start)}` : ''
              const end = value.end !== undefined ? ` to ${formatUTCDate(value.end)}` : ''
              return start ? start + end : ''
            })
            .filter((l: any) => !!l)
          return (
            <li key={`${infoField.key}-${i}`}>
              <Tooltip
                content={
                  <div className={styles.tooltipDatesContainer}>
                    {lines.map((line: string, i: number) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                }
              >
                <span>
                  {group}
                  {groupValues && groupValues.length > 0 && (
                    <IconInfo className={styles.iconInfo} />
                  )}
                </span>
              </Tooltip>
            </li>
          )
        })}
      </ul>
    )
  } else {
    return (
      <ul className={styles.listContainer}>
        <label>
          {infoField.label}
          {value && (value as []).length > 1 && (
            <button className={styles.showAll} onClick={switchOpen}>
              {!open ? `see ${(value as []).length - 1} more` : 'see less'}
            </button>
          )}
        </label>
        {value &&
          (value as []).map((innerField: VesselHistoricalChange, i: number) => {
            if (!innerField.value) return null

            const start =
              innerField.start !== undefined ? `From ${formatUTCDate(innerField.start)}` : ''
            const end = innerField.end !== undefined ? ` to ${formatUTCDate(innerField.end)}` : ''
            const label = innerField.value
            return (
              <li
                className={cx({ [styles.hidden]: i !== 0 && !open })}
                key={`${infoField.key}-${i}`}
              >
                <Tooltip content={start ? `${start}${end}` : ''}>
                  <span>
                    {label}
                    {start && <IconInfo className={styles.iconInfo} />}
                  </span>
                </Tooltip>
              </li>
            )
          })}
      </ul>
    )
  }
}

export default InfoFieldComponent
