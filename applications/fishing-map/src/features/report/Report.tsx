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
import styles from './Report.module.css'
import FishingActivity from './FishingActivity'
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

  const isAvailable = dataviews.length > 0
  const isEnabled = !loading && isAvailable

  const onCloseClick = () => {
    batch(() => {
      dispatch(resetWorkspaceReportQuery())
      dispatchQueryParams({ report: undefined })
    })
  }
  console.log(reportStatus)
  console.log(reportGeometry)
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
        <h2 className={styles.sectionTitle}>{t('common.report', 'Report')}</h2>
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
        <FishingActivity dataviews={dataviews} staticTime={staticTime} />
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.saveBtn}
          onClick={onGenerateClick}
          loading={loading}
          disabled={!isEnabled}
        >
          {t('report.generate', 'Generate Report')}
        </Button>
      </div>
    </div>
  )
}

export default Report
