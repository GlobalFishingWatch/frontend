import React, { Fragment, useEffect, useRef } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
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
import AnalysisLayerPanel from './AnalysisLayerPanel'
import styles from './Analysis.module.css'
import {
  clearAnalysisGeometry,
  CreateReport,
  createReportThunk,
  DateRange,
  ReportGeometry,
  resetReportStatus,
  selectAnalysisAreaName,
  selectAnalysisGeometry,
  selectReportStatus,
} from './analysis.slice'
import AnalysisGraphWrapper from './AnalysisGraphWrapper'

type ReportPanelProps = {
  type: string
}

function Report({ type }: ReportPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectTemporalgridDataviews) || []
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const analysisAreaName = useSelector(selectAnalysisAreaName)
  const reportStatus = useSelector(selectReportStatus)
  const userData = useSelector(selectUserData)
  const hasAnalysisLayers = dataviews?.filter(({ config }) => config?.visible === true)?.length > 0

  const onCloseClick = () => {
    batch(() => {
      dispatch(resetWorkspaceReportQuery())
      dispatch(clearAnalysisGeometry(undefined))
      dispatchQueryParams({ report: undefined })
    })
  }
  const onDownloadClick = async () => {
    const createReports: CreateReport[] = dataviews.map((dataview) => {
      const trackDatasets: Dataset[] = (dataview?.config?.datasets || [])
        .map((id: string) => dataview.datasets?.find((dataset) => dataset.id === id))
        .map((dataset: Dataset) => getRelatedDatasetByType(dataset, DatasetTypes.Tracks))

      return {
        name: `${dataview.name} - ${t('common.report', 'Report')}`,
        dateRange: staticTime as DateRange,
        filters: dataview.config?.filters || [],
        datasets: trackDatasets.map((dataset: Dataset) => dataset.id),
        geometry: analysisGeometry as ReportGeometry,
      }
    })
    await dispatch(createReportThunk(createReports))
    timeoutRef.current = setTimeout(() => {
      dispatch(resetReportStatus(undefined))
    }, 5000)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // TODO Remove this when report geometry is obtained from
  // the analysised point in the location query
  if (!analysisAreaName) {
    onCloseClick()
  }

  if (!staticTime) {
    return <Fragment />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>{t('analysis.title', 'Analysis')}</h2>
        <div className={cx('print-hidden', sectionStyles.sectionButtons)}>
          <IconButton
            icon="close"
            onClick={onCloseClick}
            type="border"
            tooltip={t('analysis.close', 'Close')}
            tooltipPlacement="bottom"
          />
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          {hasAnalysisLayers ? (
            <Fragment>
              {dataviews?.map((dataview, index) => (
                <AnalysisLayerPanel key={dataview.id} dataview={dataview} index={index} />
              ))}
            </Fragment>
          ) : (
            <p className={styles.placeholder}>
              {t('analysis.empty', 'Your selected datasets will appear here')}
            </p>
          )}
          <div className={styles.graph}>
            <AnalysisGraphWrapper />
          </div>
          <p className={styles.placeholder}>
            {t(
              'analysis.disclaimer',
              'The data shown above should be taken as an estimate. Click the button below if you need a more precise anlysis, including the list of vessels involved, and we’ll send it to your email'
            )}{' '}
            {userData?.email && `(${userData.email})`}
          </p>
        </div>
        <div className={styles.footer}>
          <p className={styles.error}>
            {reportStatus === AsyncReducerStatus.Error
              ? `${t('analysis.errorMessage', 'Something went wrong')} 🙈`
              : ''}
          </p>
          <Button
            className={styles.saveBtn}
            onClick={onDownloadClick}
            loading={reportStatus === AsyncReducerStatus.LoadingCreate}
            disabled={!hasAnalysisLayers || reportStatus === AsyncReducerStatus.Finished}
          >
            {reportStatus === AsyncReducerStatus.Finished ? (
              <Icon icon="tick" />
            ) : (
              t('analysis.download', 'Download report')
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Report
