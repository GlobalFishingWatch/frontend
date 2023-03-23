import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import { useFilteredTimeSeries } from 'features/reports/reports-timeseries.hooks'
import ReportActivityPlaceholder from 'features/reports/placeholders/ReportActivityPlaceholder'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import ReportActivityEvolution from '../activity/ReportActivityEvolution'
import styles from '../activity/ReportActivity.module.css'

function ReportEnvironment() {
  const timerange = useSelector(selectTimeRange)
  const { loading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  const environmentalDataviews = useSelector(selectActiveReportDataviews)

  if (!environmentalDataviews?.length) return null

  return (
    <Fragment>
      {environmentalDataviews.map((dataview, index) => {
        const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
        const title = getDatasetNameTranslated(dataset)
        return (
          <div key={dataview.id} className={styles.container}>
            <label className={styles.blockTitle}>{title}</label>
            {loading ? (
              <ReportActivityPlaceholder showHeader={false} />
            ) : (
              <ReportActivityEvolution
                start={timerange.start}
                end={timerange.end}
                data={layersTimeseriesFiltered?.[index]}
              />
            )}
          </div>
        )
      })}
    </Fragment>
  )
}

export default ReportEnvironment
