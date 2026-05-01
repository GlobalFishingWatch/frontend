import { Fragment } from 'react'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import styles from './ReportSublayerValues.module.css'

type ReportSublayerValuesProps = {
  values: number[]
  tags: UrlDataviewInstance[]
}

function ReportSublayerValues({ values, tags }: ReportSublayerValuesProps) {
  if (values.length <= 1) return null
  return (
    <Fragment>
      {' '}
      (
      {values.map(
        (value, index) =>
          value !== 0 && (
            <Fragment key={index}>
              <span className={styles.dot} style={{ color: tags[index]?.config?.color }} />
              {value}
              {index < values.length - 1 ? ', ' : ''}
            </Fragment>
          )
      )}
      ){' '}
    </Fragment>
  )
}

export default ReportSublayerValues
