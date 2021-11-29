import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import cx from 'classnames'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { batch, useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, Icon, IconButton, Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { useFeatureState, useLoginRedirect } from '@globalfishingwatch/react-hooks'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectUserData, isGFWUser } from 'features/user/user.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import useMapInstance from 'features/map/map-context.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveActivityDataviews,
  selectHasAnalysisLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { isGuestUser } from 'features/selectors/user.selectors'
import { selectAnalysisQuery, selectAnalysisTypeQuery } from 'features/app/app.selectors'
import { WorkspaceAnalysisType } from 'types'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
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
import AnalysisEvolution from './AnalysisEvolution'
import { useAnalysisGeometry, useFilteredTimeSeries } from './analysis.hooks'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { ComparisonGraphProps } from './AnalysisPeriodComparisonGraph'
import AnalysisPeriodComparison from './AnalysisPeriodComparison'
import AnalysisBeforeAfter from './AnalysisBeforeAfter'

const DATASETS_REPORT_SUPPORTED = ['global', 'private-ecuador']

export type AnalysisTypeProps = {
  layersTimeseriesFiltered?: AnalysisGraphProps[] | ComparisonGraphProps[]
  hasAnalysisLayers: boolean
  analysisAreaName: string
  analysisGeometryLoaded?: boolean
}

const ANALYSIS_COMPONENTS_BY_TYPE: Record<
  WorkspaceAnalysisType,
  React.FC<AnalysisTypeProps> | null
> = {
  evolution: AnalysisEvolution,
  correlation: null,
  periodComparison: AnalysisPeriodComparison,
  beforeAfter: AnalysisBeforeAfter,
}

function Analysis() {
  const { t } = useTranslation()
  const { onLoginClick } = useLoginRedirect()
  const { start, end, timerange } = useTimerangeConnect()
  const fitMapBounds = useMapFitBounds()
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const dataviews = useSelector(selectActiveActivityDataviews) || []
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const userData = useSelector(selectUserData)
  const guestUser = useSelector(isGuestUser)
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const { bounds } = useSelector(selectAnalysisQuery)
  const gfwUser = useSelector(isGFWUser)

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
      dispatchQueryParams({
        analysis: undefined,
        analysisType: undefined,
        analysisTimeComparison: undefined,
      })
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
  const timeComparisonEnabled = dataviews.length === 1

  const ANALYSIS_TYPE_OPTIONS: (ChoiceOption & { hidden?: boolean })[] = useMemo(
    () =>
      [
        {
          id: 'evolution',
          title: t('analysis.evolution', 'Evolution'),
        },
        {
          id: 'correlation',
          title: t('analysis.correlation', 'correlation'),
          hidden: true,
          tooltip: t('common.comingSoon', 'Coming Soon'),
          tooltipPlacement: 'top' as any,
        },
        {
          id: 'periodComparison',
          title: t('analysis.periodComparison', 'period comparison'),
          tooltip: timeComparisonEnabled
            ? ''
            : t('analysis.errorTimeComparisonFilters', 'Only one activity layer supported'),
          disabled: !timeComparisonEnabled,
        },
        {
          id: 'beforeAfter',
          title: t('analysis.beforeAfter', 'before/after'),
          tooltip: timeComparisonEnabled
            ? ''
            : t('analysis.errorTimeComparisonFilters', 'Only one activity layer supported'),
          disabled: !timeComparisonEnabled,
        },
      ].filter((option) => !option.hidden),
    [timeComparisonEnabled, t]
  )

  const onAnalysisTypeClick = useCallback(
    (option: ChoiceOption) => {
      fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
      dispatchQueryParams({ analysisType: option.id as WorkspaceAnalysisType })
    },
    [bounds, dispatchQueryParams, fitMapBounds]
  )

  const AnalysisComponent = useMemo(() => ANALYSIS_COMPONENTS_BY_TYPE[analysisType], [analysisType])

  const disableReportDownload =
    !analysisGeometryLoaded ||
    !layersTimeseriesFiltered ||
    timeRangeTooLong ||
    !hasAnalysisLayers ||
    !datasetsReportSupported ||
    reportStatus === AsyncReducerStatus.Finished

  const showReportDownload = analysisType === 'evolution' && hasAnalysisLayers

  let downloadTooltip = ''
  if (analysisType !== 'evolution') {
    downloadTooltip = t('common.comingSoon', 'Coming Soon')
  } else if (timeRangeTooLong) {
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

      <div className={styles.content}>
        {AnalysisComponent && (
          <AnalysisComponent
            layersTimeseriesFiltered={layersTimeseriesFiltered}
            hasAnalysisLayers={hasAnalysisLayers}
            analysisAreaName={analysisAreaName}
            analysisGeometryLoaded={analysisGeometryLoaded}
          />
        )}
        {gfwUser && (
          <div>
            <Choice
              options={ANALYSIS_TYPE_OPTIONS}
              className={cx('print-hidden', styles.typeChoice)}
              activeOption={analysisType}
              onOptionClick={onAnalysisTypeClick}
            />
          </div>
        )}
        <div>
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
          {showReportDownload &&
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
                disabled={disableReportDownload}
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
    </div>
  )
}

export default Analysis
