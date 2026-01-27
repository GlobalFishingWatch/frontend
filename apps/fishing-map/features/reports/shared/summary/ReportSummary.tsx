import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Sticky from 'react-sticky-el'
import cx from 'classnames'

import { trackEvent } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { categoryToDataviewMap, ReportCategory } from 'features/reports/reports.types'
import ReportSummaryActivity from 'features/reports/shared/summary/ReportSummaryActivity'
import ReportSummaryEvents from 'features/reports/shared/summary/ReportSummaryEvents'
import ReportSummaryTags from 'features/reports/shared/summary/ReportSummaryTags'
import type { ReportActivityUnit } from 'features/reports/tabs/activity/reports-activity.types'
import {
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit?: ReportActivityUnit
  reportStatus?: AsyncReducerStatus
}

export const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummary({
  activityUnit,
  reportStatus = AsyncReducerStatus.Finished,
}: ReportSummaryProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportCategory = useSelector(selectReportCategory)
  const dataviews = useSelector(selectActiveReportDataviews)
  const isPortReportLocation = useSelector(selectIsPortReportLocation)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)

  const onAddLayerClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Open panel to add a report layer`,
    })

    const open = categoryToDataviewMap[reportCategory]
    if (open) {
      dispatch(setModalOpen({ id: 'layerLibrary', open, singleCategory: true }))
    }
  }, [dispatch, reportCategory])

  return (
    <div className={styles.summaryWrapper}>
      {(reportCategory === ReportCategory.Activity ||
        reportCategory === ReportCategory.Detections) && (
        <div className={styles.summaryContainer}>
          <ReportSummaryActivity
            activityUnit={activityUnit || 'hour'}
            reportStatus={reportStatus}
          />
        </div>
      )}
      {reportCategory === ReportCategory.Events && (
        <div className={styles.summaryContainer}>
          <ReportSummaryEvents />
        </div>
      )}
      {dataviews?.length > 0 && (
        <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
          <div className={cx(styles.tagsContainer, styles.tagsContainerBorder)}>
            {dataviews?.map((dataview) => (
              <ReportSummaryTags
                key={dataview.id}
                dataview={dataview}
                allowDelete={dataviews.length > 1}
              />
            ))}
            {!isPortReportLocation && !isVesselGroupReportLocation && (
              <IconButton
                icon="plus"
                type="border"
                size="small"
                tooltip={t((t) => t.layer.add)}
                tooltipPlacement="top"
                onClick={onAddLayerClick}
                className={'print-hidden'}
              />
            )}
          </div>
        </Sticky>
      )}
    </div>
  )
}
