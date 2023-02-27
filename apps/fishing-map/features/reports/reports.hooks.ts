import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { UserData } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import { getActiveDatasetsInActivityDataviews } from 'features/datasets/datasets.utils'
import {
  fetchAreaDetailThunk,
  selectDatasetAreaDetail,
  selectDatasetAreaStatus,
} from 'features/areas/areas.slice'
import { selectIsReportAllowed, selectReportAreaIds } from 'features/reports/reports.selectors'
import useMapInstance from 'features/map/map-context.hooks'
import { selectUserData } from 'features/user/user.slice'
import { selectDatasetById } from 'features/datasets/datasets.slice'
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
  const analysisDataset = useSelector(selectDatasetById(datasetId))

  useEffect(() => {
    if (analysisDataset && areaId) {
      dispatch(
        fetchAreaDetailThunk({
          dataset: analysisDataset,
          areaId: areaId.toString(),
        })
      )
    }
  }, [areaId, analysisDataset, dispatch])

  return useMemo(() => ({ status, data }), [status, data])
}

function getReportDataviews(dataviews: UrlDataviewInstance[], userData: UserData) {
  return dataviews
    .map((dataview) => {
      const datasets = getActiveDatasetsInActivityDataviews([dataview])
      return {
        datasets: datasets,
        filter: dataview.config?.filter || [],
        ...(dataview.config?.['vessel-groups']?.length && {
          vesselGroups: dataview.config?.['vessel-groups'],
        }),
      }
    })
    .filter((dataview) => dataview.datasets.length > 0)
}

export function useFetchReportVessel() {
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const timerange = useSelector(selectTimeRange)
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const dataviews = useSelector(selectActiveReportDataviews)
  const status = useSelector(selectReportVesselsStatus)
  const error = useSelector(selectReportVesselsError)
  const data = useSelector(selectReportVesselsData)
  const reportAllowed = useSelector(selectIsReportAllowed)

  useEffect(() => {
    const reportDataviews = getReportDataviews(dataviews, userData)
    if (reportAllowed && areaId && reportDataviews?.length) {
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
  }, [dispatch, areaId, datasetId, timerange, dataviews, userData, reportAllowed])

  return useMemo(
    () => ({ status, data, error, reportAllowed }),
    [status, data, error, reportAllowed]
  )
}
