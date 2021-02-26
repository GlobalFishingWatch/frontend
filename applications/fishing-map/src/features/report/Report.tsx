import React, { Fragment, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { resetWorkspaceReportQuery } from 'features/workspace/workspace.slice'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectStaticTime } from 'features/timebar/timebar.slice'
import {
  getRelatedDatasetByType,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import { selectUserData } from 'features/user/user.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './Report.module.css'
import ReportLayerPanel from './ReportLayerPanel'
import {
  clearReportGeometry,
  CreateReport,
  createReportThunk,
  DateRange,
  selectReportAreaName,
  selectReportGeometry,
  selectReportStatus,
} from './report.slice'
import ReportFilter from './ReportFilter'

type ReportPanelProps = {
  type: string
}

function Report({ type }: ReportPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { dispatchQueryParams } = useLocationConnect()
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectTemporalgridDataviews) || []
  const reportGeometry = useSelector(selectReportGeometry)
  const reportAreaName = useSelector(selectReportAreaName)
  const reportStatus = useSelector(selectReportStatus)
  const userData = useSelector(selectUserData)
  const isAvailable = dataviews.length > 0
  const isEnabled = !loading && isAvailable

  const reportDescription = t(
    'report.fishingActivityByEEZDescription',
    'A fishing activity report for the selected date ranges and filters will be generated and sent to your email account'
  )

  const reportNotAvailable = t(
    'report.notAvailable',
    'Report is not available for the current ' +
      'layers, you need to enable fishing effort layer ' +
      'or event layers to generate the report.'
  )

  const onCloseClick = () => {
    batch(() => {
      dispatch(resetWorkspaceReportQuery())
      dispatch(clearReportGeometry(undefined))
      dispatchQueryParams({ report: undefined })
    })
  }
  const onGenerateClick = async () => {
    setLoading(true)
    const createReports: CreateReport[] = dataviews.map((dataview) => {
      const trackDatasets: Dataset[] = (dataview?.config?.datasets || [])
        .map((id: string) => dataview.datasets?.find((dataset) => dataset.id === id))
        .map((dataset: Dataset) => getRelatedDatasetByType(dataset, DatasetTypes.Tracks))

      return {
        name: `${dataview.name} - ${t('common.report', 'Report')}`,
        dateRange: staticTime as DateRange,
        filters: dataview.config?.filters || [],
        datasets: trackDatasets.map((dataset: Dataset) => dataset.id),
        geometry: reportGeometry as GeoJSON.FeatureCollection,
      }
    })
    dispatch(createReportThunk(createReports))
    setLoading(false)
  }

  // TODO Remove this when report geometry is obtained from
  // the selected point in the location query
  if (!reportAreaName) {
    onCloseClick()
  }
  if (!staticTime) {
    return <Fragment />
  }
  const dateRangeItems: TagItem[] = [
    {
      id: 'start',
      label: DateTime.fromISO(staticTime?.start).toUTC().toISODate(),
      tooltip: DateTime.fromISO(staticTime?.start).toUTC().toISODate(),
    },
    {
      id: 'end',
      label: DateTime.fromISO(staticTime?.end).toUTC().toISODate(),
      tooltip: DateTime.fromISO(staticTime?.end).toUTC().toISODate(),
    },
  ]
  const areaItems: TagItem[] = [
    {
      id: 'area',
      label: reportAreaName.length > 35 ? `${reportAreaName.slice(0, 35)}...` : reportAreaName,
      tooltip: reportAreaName,
    },
  ]
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          {t('report.fishingActivityReport', 'Fishing Activity Report')}
        </h2>
        <div className={cx('print-hidden', sectionStyles.sectionButtons)}>
          <IconButton
            icon="close"
            onClick={onCloseClick}
            type="border"
            tooltip={t('report.close', 'Close')}
            tooltipPlacement="bottom"
          />
        </div>
      </div>
      <div className={styles.content}>
        {isAvailable && reportStatus === AsyncReducerStatus.Idle && (
          <Fragment>
            <div className={styles.description}>
              {reportDescription}: {userData?.email}
            </div>
            <ReportFilter label={t('report.dateRange', 'Date Range')} taglist={dateRangeItems} />
            <ReportFilter label={t('report.area', 'Area')} taglist={areaItems} />
            {dataviews?.map((dataview, index) => (
              <ReportLayerPanel key={dataview.id} dataview={dataview} index={index} />
            ))}
          </Fragment>
        )}
        {!isAvailable && <Fragment>{reportNotAvailable}</Fragment>}
        {reportStatus === AsyncReducerStatus.LoadingCreate && (
          <Fragment>
            <div className={styles.loading}>
              <div>
                {t(
                  'report.generating',
                  "We are generating the report for you, it'll be ready soon."
                )}
              </div>
              <Spinner />
            </div>
          </Fragment>
        )}
        {reportStatus === AsyncReducerStatus.Finished && (
          <p className={styles.success}>
            {t(
              'report.successfullMessage',
              "The report was sent successfully, you'll receive it by email soon."
            )}
          </p>
        )}
        {reportStatus === AsyncReducerStatus.Error && (
          <p className={styles.error}>{t('report.errorMessage', 'Something went wrong')} 🙈</p>
        )}
      </div>
      <div className={styles.footer}>
        {(!isAvailable ||
          [AsyncReducerStatus.Finished, AsyncReducerStatus.Error].includes(reportStatus)) && (
          <Button className={styles.saveBtn} onClick={onCloseClick} type="secondary">
            {t('report.close', 'Close')}
          </Button>
        )}
        {isAvailable && reportStatus === AsyncReducerStatus.Idle && (
          <Button
            className={styles.saveBtn}
            onClick={onGenerateClick}
            loading={loading}
            disabled={!isEnabled}
          >
            {t('common.confirm', 'Confirm')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Report
