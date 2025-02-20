import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Sticky from 'react-sticky-el'

import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportTimeComparison } from 'features/reports/reports.config.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import ReportSummaryTagsPlaceholder from 'features/reports/shared/placeholders/ReportSummaryTagsPlaceholder'
import { FIELDS, getCommonProperties } from 'features/reports/shared/summary/report-summary.utils'
import ReportSummaryActivity from 'features/reports/shared/summary/ReportSummaryActivity'
import ReportSummaryEvents from 'features/reports/shared/summary/ReportSummaryEvents'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit?: ReportActivityUnit
  reportStatus?: AsyncReducerStatus
  showTags?: boolean
}

export const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummary({
  activityUnit,
  reportStatus = AsyncReducerStatus.Finished,
  showTags = true,
}: ReportSummaryProps) {
  const reportCategory = useSelector(selectReportCategory)
  const reportTimeComparison = useSelector(selectReportTimeComparison)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const dataviews = useSelector(selectActiveReportDataviews)

  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config?.filters?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])

  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        {reportCategory === ReportCategory.Activity ? (
          <ReportSummaryActivity
            activityUnit={activityUnit || 'hour'}
            reportStatus={reportStatus}
          />
        ) : (
          <ReportSummaryEvents />
        )}
      </div>
      {!isVesselGroupReportLocation ? (
        showTags ? (
          <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
            {dataviews?.length > 0 && (
              <div className={styles.tagsContainer}>
                {dataviews?.map((dataview, index) => (
                  <ReportSummaryTags
                    key={dataview.id}
                    dataview={dataview}
                    index={index}
                    hiddenProperties={commonProperties}
                    availableFields={FIELDS}
                  />
                ))}
              </div>
            )}
          </Sticky>
        ) : reportTimeComparison || !showTags ? null : (
          <div className={styles.tagsContainer}>
            <ReportSummaryTagsPlaceholder />
          </div>
        )
      ) : null}
    </Fragment>
  )
}
