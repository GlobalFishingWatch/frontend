import { Fragment } from 'react'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import styles from './ReportSublayerValues.module.css'

type ReportSublayerValuesProps = {
  values: number[]
  tags: UrlDataviewInstance[]
}

function ReportSublayerValues({ values, tags }: ReportSublayerValuesProps) {
  if (values.length <= 1) return null
  const nonZeroEntries = values
    .map((value, index) => ({ value, index }))
    .filter(({ value }) => value !== 0)

  if (nonZeroEntries.length === 0) return null
  return (
    <Fragment>
      {' '}
      (
      {nonZeroEntries.map(({ value, index }, i) => (
        <Fragment key={index}>
          <span className={styles.dot} style={{ color: tags[index]?.config?.color }} />
          {value}
          {i < nonZeroEntries.length - 1 ? ', ' : ''}
        </Fragment>
      ))}
      ){' '}
    </Fragment>
  )
}

export default ReportSublayerValues
