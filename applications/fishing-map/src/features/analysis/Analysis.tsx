import { useEffect, useRef, useState, Fragment } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { batch, useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { useFeatureState } from '@globalfishingwatch/react-hooks/src/use-map-interaction'
import { useLocationConnect, useLoginRedirect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectUserData } from 'features/user/user.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useMapInstance from 'features/map/map-context.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveActivityDataviews,
  selectHasAnalysisLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { isGuestUser } from 'features/user/user.selectors'
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
import AnalysisItem from './AnalysisItem'
import { useAnalysisGeometry, useFilteredTimeSeries } from './analysis.hooks'

const DATASETS_REPORT_SUPPORTED = ['global', 'private-ecuador']

function Analysis() {
  const { t } = useTranslation()
  const { onLoginClick } = useLoginRedirect()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { start, end, timerange } = useTimerangeConnect()
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const dataviews = useSelector(selectActiveActivityDataviews) || []
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const userData = useSelector(selectUserData)
  const guestUser = useSelector(isGuestUser)

  const analysisAreaName = useSelector(selectAnalysisAreaName)
  const reportStatus = useSelector(selectReportStatus)
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)

  const datasetsReportAllowed = dataviews.flatMap((dataview) => {
    const datasets: Dataset[] = (dataview?.config?.datasets || [])
      .map((id: string) => dataview.datasets?.find((dataset) => dataset.id === id))
      .map((dataset: Dataset) => getRelatedDatasetByType(dataset, DatasetTypes.Tracks))
      .filter((dataset: Dataset) => {
        if (!dataset) return false
        const permission = { type: 'dataset', value: dataset?.id, action: 'report' }
        return checkExistPermissionInList(userData?.permissions, permission)
      })
    return datasets
  })

  const datasetsReportSupported = datasetsReportAllowed.some((dataset) =>
    DATASETS_REPORT_SUPPORTED.some((datasetSupported) => dataset.id.includes(datasetSupported))
  )

  const [timeRangeTooLong, setTimeRangeTooLong] = useState<boolean>(true)

  useEffect(() => {
    if (start && end) {
      const startDateTime = DateTime.fromISO(start)
      const endDateTime = DateTime.fromISO(end)
      const duration = endDateTime.diff(startDateTime, 'years')
      setTimeRangeTooLong(duration.years > 1)
    }
  }, [start, end])

  const onCloseClick = () => {
    cleanFeatureState('highlight')
    cleanFeatureState('click')
    batch(() => {
      dispatch(clearAnalysisGeometry(undefined))
      dispatchQueryParams({ analysis: undefined })
    })
  }

  const onDownloadClick = async () => {
    const reportDataviews = dataviews
      .map((dataview) => {
        const trackDatasets: Dataset[] = (dataview?.config?.datasets || [])
          .map((id: string) => dataview.datasets?.find((dataset) => dataset.id === id))
          .map((dataset: Dataset) => getRelatedDatasetByType(dataset, DatasetTypes.Tracks))
          .filter((dataset: Dataset) => {
            if (!dataset) return false
            const permission = { type: 'dataset', value: dataset?.id, action: 'report' }
            return checkExistPermissionInList(userData?.permissions, permission)
          })

        return {
          filters: dataview.config?.filters || {},
          datasets: trackDatasets.map((dataset: Dataset) => dataset.id),
        }
      })
      .filter((dataview) => dataview.datasets.length > 0)

    const reportName = Array.from(new Set(dataviews.map((dataview) => dataview.name))).join(',')
    const createReport: CreateReport = {
      name: `${reportName} - ${t('common.report', 'Report')}`,
      dateRange: timerange as DateRange,
      dataviews: reportDataviews,
      geometry: analysisGeometry as ReportGeometry,
    }
    await dispatch(createReportThunk(createReport))
    uaEvent({
      category: 'Analysis',
      action: `Download report`,
      label: getEventLabel([
        analysisAreaName,
        ...reportDataviews
          .map(({ datasets, filters }) => [datasets.join(','), ...getActivityFilters(filters)])
          .flat(),
      ]),
    })
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

  const layersTimeseriesFiltered = useFilteredTimeSeries()
  const analysisGeometryLoaded = useAnalysisGeometry()

  let downloadTooltip = ''
  if (timeRangeTooLong) {
    downloadTooltip = t(
      'analysis.timeRangeTooLong',
      'Reports are only allowed for time ranges up to a year'
    )
  } else if (!datasetsReportSupported) {
    downloadTooltip = t('analysis.onlyAISAllowed', 'Only AIS datasets are allowed to download')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          {t('analysis.title', 'Analysis')}
          <span className={styles.experimental}>{t('analysis.experimental', 'Experimental')}</span>
        </h2>
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
      {workspaceStatus !== AsyncReducerStatus.Finished ||
      !analysisGeometryLoaded ||
      !layersTimeseriesFiltered ? (
        <Spinner className={styles.spinnerFull} />
      ) : (
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            {layersTimeseriesFiltered && layersTimeseriesFiltered?.length ? (
              <Fragment>
                {layersTimeseriesFiltered.map((layerTimeseriesFiltered, index) => {
                  return (
                    <AnalysisItem
                      hasAnalysisLayers={hasAnalysisLayers}
                      analysisAreaName={analysisAreaName}
                      key={index}
                      graphData={layerTimeseriesFiltered}
                    />
                  )
                })}
              </Fragment>
            ) : (
              <p className={styles.emptyDataPlaceholder}>
                {t('analysis.noData', 'No data available')}
              </p>
            )}
            {analysisGeometry && (
              <p className={styles.placeholder}>
                {t(
                  'analysis.disclaimer',
                  'The data shown above should be taken as an estimate. Click the button below if you need a more precise anlysis, including the list of vessels involved, and we’ll send it to your email.'
                )}
              </p>
            )}
          </div>
          <div className={styles.footer}>
            <p
              className={cx(styles.footerMsg, {
                [styles.error]: reportStatus === AsyncReducerStatus.Error,
              })}
            >
              {reportStatus === AsyncReducerStatus.Error
                ? `${t('analysis.errorMessage', 'Something went wrong')} 🙈`
                : ''}
              {reportStatus === AsyncReducerStatus.Finished
                ? `${t('analysis.completed', 'The report will be in your email soon')} (${
                    userData?.email
                  })`
                : ''}
            </p>
            {hasAnalysisLayers &&
              (guestUser && !timeRangeTooLong ? (
                <Button
                  type="secondary"
                  className={styles.saveBtn}
                  tooltip={t('analysis.downloadLogin', 'Please login to download report')}
                  onClick={onLoginClick}
                >
                  {t('analysis.download', 'Download report')}
                </Button>
              ) : (
                <Button
                  className={styles.saveBtn}
                  onClick={onDownloadClick}
                  loading={reportStatus === AsyncReducerStatus.LoadingCreate}
                  tooltip={downloadTooltip}
                  tooltipPlacement="top"
                  disabled={
                    timeRangeTooLong ||
                    !hasAnalysisLayers ||
                    !datasetsReportSupported ||
                    reportStatus === AsyncReducerStatus.Finished
                  }
                >
                  {reportStatus === AsyncReducerStatus.Finished ? (
                    <Icon icon="tick" />
                  ) : (
                    t('analysis.download', 'Download report')
                  )}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis
