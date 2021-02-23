import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
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
  CreateReport,
  createReportThunk,
  DateRange,
  selectReportGeometry,
  selectReportStatus,
} from './report.slice'

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
      dispatchQueryParams({ report: undefined })
    })
  }
  const onGenerateClick = useCallback(async () => {
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
  }, [dataviews, staticTime, reportGeometry, dispatch])

  if (!staticTime) {
    return <Fragment />
  }

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
            tooltip={t('report.close', 'Close report')}
            tooltipPlacement="bottom"
          />
        </div>
      </div>
      <div className={styles.content}>
        {reportStatus === AsyncReducerStatus.Idle && (
          <Fragment>
            <div className={styles.description}>
              {reportDescription}: {userData?.email}
            </div>
            <div>
              {isAvailable &&
                dataviews?.map((dataview, index) => (
                  <ReportLayerPanel key={dataview.id} dataview={dataview} index={index} />
                ))}
              {!isAvailable && <Fragment>{reportNotAvailable}</Fragment>}
            </div>
          </Fragment>
        )}
        {reportStatus === AsyncReducerStatus.Finished && (
          <p className={styles.success}>
            {t(
              'report.successfullMessage',
              "The report was created successfully, you'll receive it by email soon."
            )}
          </p>
        )}
        {reportStatus === AsyncReducerStatus.Error && (
          <p className={styles.error}>{t('report.errorMessage', 'Something went wrong')} 🙈</p>
        )}
      </div>
      <div className={styles.footer}>
        {reportStatus === AsyncReducerStatus.Idle && (
          <Button
            className={styles.saveBtn}
            onClick={onGenerateClick}
            loading={loading}
            disabled={!isEnabled}
          >
            {t('report.send', 'Send Report')}
          </Button>
        )}
        {reportStatus === AsyncReducerStatus.Finished && (
          <Button className={styles.saveBtn} onClick={onCloseClick}>
            {t('report.backToMap', 'Go back to Map')}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Report
