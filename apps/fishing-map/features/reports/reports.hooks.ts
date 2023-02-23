import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import { getActiveDatasetsInActivityDataviews } from 'features/datasets/datasets.utils'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import {
  fetchReportVesselsThunk,
  selectReportVesselsData,
  selectReportVesselsError,
  selectReportVesselsStatus,
} from './reports.slice'

export function useReportAreaHighlight(areaId: string, sourceId: string) {
  const { updateFeatureState, cleanFeatureState } = useFeatureState(useMapInstance())

  const setHighlightedArea = useCallback(
    (areaId, sourceId) => {
      cleanFeatureState('highlight')
      const featureState = {
        source: sourceId,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id: areaId.toString(),
      }
      updateFeatureState([featureState], 'highlight')
    },
    [cleanFeatureState, updateFeatureState]
  )

  useEffect(() => {
    if (areaId && sourceId) {
      setHighlightedArea(areaId, sourceId)
    }
  }, [areaId, sourceId, setHighlightedArea])
}

export function useFetchReportArea() {
  const dispatch = useAppDispatch()
  const { datasetId, areaId } = useSelector(selectReportAreaIds)
  const status = useSelector(selectDatasetAreaStatus({ datasetId, areaId }))
  const data = useSelector(selectDatasetAreaDetail({ datasetId, areaId }))

  useEffect(() => {
    if (datasetId && areaId) {
      dispatch(
        fetchAreaDetailThunk({
          datasetId,
          areaId: areaId.toString(),
        })
      )
    }
  }, [areaId, datasetId, dispatch])

  return useMemo(() => ({ status, data }), [status, data])
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const timerange = useSelector(selectTimeRange)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveReportDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)

  useEffect(() => {
    const reportDataviews = dataviews
      .map((dataview) => ({
        datasets: getActiveDatasetsInActivityDataviews([dataview as UrlDataviewInstance]),
        filter: dataview.config?.filter || [],
        ...(dataview.config?.['vessel-groups']?.length && {
          vesselGroups: dataview.config?.['vessel-groups'],
        }),
      }))
      .filter((dataview) => dataview.datasets.length > 0)

    if (areaId && reportDataviews?.length) {
      dispatch(
        fetchReportVesselsThunk({
          datasets: reportDataviews.map(({ datasets }) => datasets.join(',')),
          filters: reportDataviews.map(({ filter }) => filter),
          vesselGroups: reportDataviews.map(({ vesselGroups }) => vesselGroups),
          region: {
            id: areaId,
            dataset: datasetId,
          },
          dateRange: timerange,
          spatialAggregation: true,
        })
      )
    }
  }, [dispatch, areaId, datasetId, timerange, dataviews])

  return useMemo(() => ({ status, data, error }), [status, data, error])
}
