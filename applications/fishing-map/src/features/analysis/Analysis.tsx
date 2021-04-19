import React, { useEffect, useRef, useMemo, useState, Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import union from '@turf/union'
import { Feature, Polygon } from 'geojson'
import { batch, useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import bbox from '@turf/bbox'
import { Button, Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer/dist/generators'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectStaticTime } from 'features/timebar/timebar.slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectUserData } from 'features/user/user.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectAnalysisQuery } from 'features/app/app.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { useFeatures } from 'features/map/map-features.hooks'
import { Bbox } from 'types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveActivityDataviews,
  selectHasAnalysisLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import styles from './Analysis.module.css'
import {
  clearAnalysisGeometry,
  CreateReport,
  createReportThunk,
  DateRange,
  ReportGeometry,
  resetReportStatus,
  selectAnalysisBounds,
  selectAnalysisAreaName,
  selectAnalysisGeometry,
  selectReportStatus,
  setAnalysisGeometry,
} from './analysis.slice'
import AnalysisItem from './AnalysisItem'
import { useFilteredTimeSeries } from './analysis.hooks'

// const { filterByPolygon } = createAnalysisWorker<typeof AnalysisWorker>()

function Analysis() {
  const { t } = useTranslation()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { start, end } = useTimerangeConnect()
  const dispatch = useDispatch()
  const fitMapBounds = useMapFitBounds()
  const analysisQuery = useSelector(selectAnalysisQuery)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectActiveActivityDataviews) || []
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const analysisBounds = useSelector(selectAnalysisBounds)

  const analysisAreaName = useSelector(selectAnalysisAreaName)
  const reportStatus = useSelector(selectReportStatus)
  const userData = useSelector(selectUserData)
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)
  const { areaId, sourceId: contextSourceId } = analysisQuery
  const contextSourcesIds = useMemo(() => [contextSourceId], [contextSourceId])
  const filter = useMemo(() => ['==', 'gfw_id', parseInt(areaId)], [areaId])

  const {
    sourcesFeatures: contextAreaFeaturesArr,
    haveSourcesLoaded: contextAreaSourceLoaded,
  } = useFeatures({
    sourcesIds: contextSourcesIds,
    sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
    filter,
  })

  const [timeRangeTooLong, setTimeRangeTooLong] = useState<boolean>(true)

  useEffect(() => {
    const startDateTime = DateTime.fromISO(start)
    const endDateTime = DateTime.fromISO(end)
    const duration = endDateTime.diff(startDateTime, 'years')
    setTimeRangeTooLong(duration.years > 1)
  }, [start, end])

  useEffect(() => {
    if (contextAreaSourceLoaded) {
      cleanFeatureState('highlight')
      const featureState = {
        source: contextSourceId,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id: areaId,
      }
      updateFeatureState([featureState], 'highlight')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId, contextSourceId, contextAreaSourceLoaded])

  useEffect(() => {
    if (contextAreaSourceLoaded) {
      const contextAreaFeatures = contextAreaFeaturesArr?.[0]
      if (contextAreaFeatures && contextAreaFeatures.length > 0) {
        const contextAreaFeatureMerged = contextAreaFeatures.reduce(
          (acc, { geometry, properties }) => {
            const featureGeometry: Feature<Polygon> = {
              type: 'Feature',
              geometry: geometry as Polygon,
              properties,
            }
            if (!acc?.type) return featureGeometry
            return union(acc, featureGeometry, { properties }) as Feature<Polygon>
          },
          {} as Feature<Polygon>
        )
        const { name, value, id } = contextAreaFeatureMerged.properties || {}
        const areaName = name || id || value
        if (areaName !== analysisAreaName) {
          const bounds = bbox(contextAreaFeatureMerged) as Bbox
          dispatch(
            setAnalysisGeometry({
              geometry: contextAreaFeatureMerged,
              name: name || id || value,
              bounds,
            })
          )
        }
      } else {
        console.warn('No feature for analysis found')
        dispatch(
          setAnalysisGeometry({
            geometry: undefined,
            name: 'Not found 🙈',
          })
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextAreaFeaturesArr, dispatch, contextAreaSourceLoaded])

  useEffect(() => {
    if (analysisBounds) {
      fitMapBounds(analysisBounds, { padding: 10 })
      dispatchQueryParams({
        analysis: {
          ...analysisQuery,
          bounds: analysisBounds,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisBounds])

  const onCloseClick = () => {
    cleanFeatureState('highlight')
    batch(() => {
      dispatch(clearAnalysisGeometry(undefined))
      dispatchQueryParams({ analysis: undefined })
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

  const {
    generatingTimeseries,
    haveSourcesLoaded,
    sourcesTimeseriesFiltered,
  } = useFilteredTimeSeries()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          {t('analysis.title', 'Analysis')}
          <span className={styles.error}> Experimental</span>
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
      !contextAreaSourceLoaded ||
      !analysisGeometry ||
      !haveSourcesLoaded ||
      generatingTimeseries ? (
        <Spinner className={styles.spinnerFull} />
      ) : (
        <div className={styles.contentContainer}>
          <div className={styles.content}>
            {sourcesTimeseriesFiltered && sourcesTimeseriesFiltered?.length ? (
              <Fragment>
                {sourcesTimeseriesFiltered.map((sourceTimeseriesFiltered, index) => {
                  return (
                    <AnalysisItem
                      hasAnalysisLayers={hasAnalysisLayers}
                      analysisAreaName={analysisAreaName}
                      key={index}
                      graphData={sourceTimeseriesFiltered}
                    />
                  )
                })}
              </Fragment>
            ) : (
              <p className={styles.emptyDataPlaceholder}>No data available</p>
            )}

            {contextAreaSourceLoaded && analysisGeometry && (
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
            <Button
              className={styles.saveBtn}
              onClick={onDownloadClick}
              loading={reportStatus === AsyncReducerStatus.LoadingCreate}
              tooltip={
                timeRangeTooLong
                  ? t(
                      'analysis.timeRangeTooLong',
                      'Reports are only allowed for time ranges up to a year'
                    )
                  : ''
              }
              tooltipPlacement="top"
              disabled={
                timeRangeTooLong ||
                !hasAnalysisLayers ||
                reportStatus === AsyncReducerStatus.Finished
              }
            >
              {reportStatus === AsyncReducerStatus.Finished ? (
                <Icon icon="tick" />
              ) : (
                t('analysis.download', 'Download report')
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Analysis
