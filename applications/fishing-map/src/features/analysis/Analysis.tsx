import React, { Fragment, useEffect, useRef, useState, useLayoutEffect } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import union from '@turf/union'
import bbox from '@turf/bbox'
import { Feature, Polygon } from 'geojson'
import { batch, useDispatch, useSelector } from 'react-redux'
import type { Map } from '@globalfishingwatch/mapbox-gl'
import { Button, Icon, IconButton, Spinner } from '@globalfishingwatch/ui-components'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import useTilesState from '@globalfishingwatch/react-hooks/dist/use-tiles-state'
import useDebounce from '@globalfishingwatch/react-hooks/dist/use-debounce'
import { useFeatureState } from '@globalfishingwatch/react-hooks/dist/use-map-interaction'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectStaticTime } from 'features/timebar/timebar.slice'
import {
  getRelatedDatasetByType,
  selectTemporalgridDataviews,
  selectWorkspaceStatus,
} from 'features/workspace/workspace.selectors'
import { selectUserData } from 'features/user/user.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectAnalysisQuery } from 'features/app/app.selectors'
import { useMapboxInstance } from 'features/map/map.context'
import useViewport, { useMapFitBounds } from 'features/map/map-viewport.hooks'
import AnalysisLayerPanel from './AnalysisLayerPanel'
import styles from './Analysis.module.css'
import {
  clearAnalysisGeometry,
  CreateReport,
  createReportThunk,
  DateRange,
  ReportGeometry,
  resetReportStatus,
  selectAnalysisGeometry,
  selectReportStatus,
  setAnalysisGeometry,
} from './analysis.slice'
import AnalysisGraphWrapper from './AnalysisGraphWrapper'

function Analysis() {
  const { t } = useTranslation()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const dispatch = useDispatch()
  const mapInstance = useMapboxInstance()
  const fitMapBounds = useMapFitBounds()
  const { setMapCoordinates } = useViewport()
  const tilesLoading = useTilesState(mapInstance as Map).loading
  const debouncedTilesLoading = useDebounce(tilesLoading, 600)
  const analysisQuery = useSelector(selectAnalysisQuery)
  const [sourceLoaded, setSourceLoaded] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { dispatchQueryParams } = useLocationConnect()
  const { updateFeatureState, cleanFeatureState } = useFeatureState(mapInstance)
  const staticTime = useSelector(selectStaticTime)
  const dataviews = useSelector(selectTemporalgridDataviews) || []
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const reportStatus = useSelector(selectReportStatus)
  const userData = useSelector(selectUserData)
  const hasAnalysisLayers = dataviews?.filter(({ config }) => config?.visible === true)?.length > 0
  const { areaId, sourceId } = analysisQuery

  useLayoutEffect(() => {
    // We have to go to zoom 0 to load every geometry to be able to fitBounds later
    const viewport = { latitude: 0, longitude: 0, zoom: 0 }
    setMapCoordinates(viewport)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const sourceCallback = () => {
      if (mapInstance?.getSource(sourceId) && mapInstance?.isSourceLoaded(sourceId)) {
        setSourceLoaded(true)
        mapInstance.off('idle', sourceCallback)
      }
    }

    if (mapInstance && sourceId && areaId) {
      setSourceLoaded(false)
      mapInstance.on('idle', sourceCallback)
    }

    return () => {
      if (mapInstance) {
        mapInstance.off('idle', sourceCallback)
      }
    }
  }, [mapInstance, sourceId, areaId])

  useEffect(() => {
    if (sourceLoaded && mapInstance) {
      const contextAreaFeatures = mapInstance?.querySourceFeatures(sourceId, {
        sourceLayer: 'main', // Our layers always uses 'main' as the source layer
        filter: ['==', 'gfw_id', parseInt(areaId)],
      })
      if (contextAreaFeatures.length > 0) {
        cleanFeatureState('highlight')
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
        const { name, value } = contextAreaFeatureMerged.properties || {}
        dispatch(
          setAnalysisGeometry({
            geometry: contextAreaFeatureMerged,
            name: name || value,
          })
        )
        const bounds = bbox(contextAreaFeatureMerged) as [number, number, number, number]
        fitMapBounds(bounds, 10)
        const featureState = { source: sourceId, sourceLayer: 'main', id: areaId }
        updateFeatureState([featureState], 'highlight')
      } else {
        console.warn('No feature for analysis found')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, mapInstance, areaId, sourceId, sourceLoaded])

  const onCloseClick = () => {
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
      {workspaceStatus !== AsyncReducerStatus.Finished ? (
        <Spinner className={styles.spinnerFull} />
      ) : (
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
              {!sourceLoaded || (debouncedTilesLoading && !analysisGeometry) ? (
                <Spinner className={styles.spinner} />
              ) : (
                <AnalysisGraphWrapper />
              )}
            </div>
            <p className={styles.placeholder}>
              {t(
                'analysis.disclaimer',
                'The data shown above should be taken as an estimate. Click the button below if you need a more precise anlysis, including the list of vessels involved, and we’ll send it to your email.'
              )}
            </p>
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
      )}
    </div>
  )
}

export default Analysis
