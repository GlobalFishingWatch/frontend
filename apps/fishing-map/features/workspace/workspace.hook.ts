import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { ColorCyclingType, Workspace } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { FillColorBarOptions, LineColorBarOptions } from '@globalfishingwatch/ui-components'

import { LAYERS_LIBRARY_ACTIVITY } from 'data/layer-library/layers-activity'
import { LAYERS_LIBRARY_DETECTIONS } from 'data/layer-library/layers-detections'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsAnyAreaReportLocation,
  selectUrlDataviewInstances,
  selectUrlTimeRange,
  selectUrlViewport,
} from 'routes/routes.selectors'

import { selectWorkspaceDataviewInstances } from './workspace.selectors'

export const useFitWorkspaceBounds = () => {
  const urlViewport = useSelector(selectUrlViewport)
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const urlTimeRange = useSelector(selectUrlTimeRange)

  const { setTimerange } = useTimerangeConnect()
  const setMapCoordinates = useSetMapCoordinates()

  const fitWorkspaceBounds = useCallback(
    async (workspace: Workspace) => {
      const viewport = urlViewport || workspace?.viewport
      if (viewport && !isAreaReportLocation) {
        setMapCoordinates(viewport)
      }
      if (!urlTimeRange && workspace?.startAt && workspace?.endAt) {
        setTimerange({
          start: workspace?.startAt,
          end: workspace?.endAt,
        })
      }
    },
    [isAreaReportLocation, setMapCoordinates, setTimerange, urlTimeRange, urlViewport]
  )

  return fitWorkspaceBounds
}

export const getNextColor = (
  colorCyclingType: ColorCyclingType,
  currentColors: string[] | undefined
) => {
  const palette = colorCyclingType === 'fill' ? FillColorBarOptions : LineColorBarOptions
  if (!currentColors) {
    return palette[Math.floor(Math.random() * palette.length)]
  }
  let minRepeat = Number.POSITIVE_INFINITY
  const availableColors: (ColorBarOption & { num: number })[] = palette.map((color) => {
    const num = currentColors.filter((c) => c === color.value).length
    if (num < minRepeat) minRepeat = num
    return {
      ...color,
      num,
    }
  })
  const nextColor = availableColors.find((c) => c.num === minRepeat) || availableColors[0]
  return nextColor
}

const createDataviewsInstances = (
  newDataviewInstances: Partial<UrlDataviewInstance>[],
  currentDataviewInstances: UrlDataviewInstance[] = []
): UrlDataviewInstance[] => {
  const defaultDataviewInstances = [...LAYERS_LIBRARY_ACTIVITY, ...LAYERS_LIBRARY_DETECTIONS]
  const currentColors = (currentDataviewInstances || defaultDataviewInstances).flatMap(
    (dv) => dv.config?.color || []
  )
  return newDataviewInstances.map((dataview) => {
    if (dataview.config?.colorCyclingType) {
      const nextColor = getNextColor(dataview.config.colorCyclingType, currentColors)
      currentColors.push(nextColor.value)
      const { colorCyclingType, ...config } = dataview.config
      const dataviewWithColor = {
        ...dataview,
        config: {
          ...config,
          color: nextColor.value,
          colorCyclingType: undefined,
        },
      } as UrlDataviewInstance
      if (colorCyclingType === 'fill') {
        dataviewWithColor.config!.colorRamp = nextColor.id
      }
      return dataviewWithColor
    }
    return dataview as UrlDataviewInstance
  })
}

export const mergeDataviewIntancesToUpsert = (
  newDataviewInstance: Partial<UrlDataviewInstance>[] | Partial<UrlDataviewInstance>,
  urlDataviewInstances: UrlDataviewInstance[],
  allDataviewInstances?: UrlDataviewInstance[]
) => {
  const newDataviewInstances = Array.isArray(newDataviewInstance)
    ? newDataviewInstance
    : [newDataviewInstance]
  let dataviewInstances = urlDataviewInstances || []
  newDataviewInstances.forEach((dataviewInstance) => {
    const currentDataviewInstance = urlDataviewInstances?.find(
      (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
    )
    if (currentDataviewInstance) {
      dataviewInstances = dataviewInstances.map((urlDataviewInstance) => {
        if (urlDataviewInstance.id !== dataviewInstance.id) return urlDataviewInstance
        return {
          ...urlDataviewInstance,
          ...dataviewInstance,
          config: {
            ...urlDataviewInstance.config,
            ...dataviewInstance.config,
          },
        }
      })
    } else {
      dataviewInstances = [
        ...createDataviewsInstances([dataviewInstance], allDataviewInstances),
        ...dataviewInstances,
      ]
    }
  })
  return dataviewInstances
}

export const useDataviewInstancesConnect = () => {
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const allDataviews = useSelector(selectDataviewInstancesResolved)
  const { dispatchQueryParams } = useLocationConnect()

  const removeDataviewInstance = useCallback(
    (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id]
      const dataviewInstances = urlDataviewInstances?.filter(
        (urlDataviewInstance) => !ids.includes(urlDataviewInstance.id)
      )
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances]
  )

  const upsertDataviewInstance = useCallback(
    (newDataviewInstance: Partial<UrlDataviewInstance>[] | Partial<UrlDataviewInstance>) => {
      const dataviewInstances = mergeDataviewIntancesToUpsert(
        newDataviewInstance,
        urlDataviewInstances,
        allDataviews
      )
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances, allDataviews]
  )

  const addNewDataviewInstances = useCallback(
    (dataviewInstances: Partial<UrlDataviewInstance>[]) => {
      dispatchQueryParams({
        dataviewInstances: [
          ...createDataviewsInstances(dataviewInstances, allDataviews),
          ...(urlDataviewInstances || []),
        ],
      })
    },
    [dispatchQueryParams, urlDataviewInstances, allDataviews]
  )

  const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  const deleteDataviewInstance = useCallback(
    (id: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id]
      const dataviewInstances = (urlDataviewInstances || []).filter(
        (urlDataviewInstance) => !ids.includes(urlDataviewInstance.id)
      )
      const workspaceDataviewInstance = workspaceDataviewInstances?.filter((dataviewInstance) =>
        ids.includes(dataviewInstance.id)
      )
      if (workspaceDataviewInstance?.length) {
        workspaceDataviewInstance.forEach(({ id }) => {
          dataviewInstances.push({ id, deleted: true })
        })
      }
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances, workspaceDataviewInstances]
  )
  return useMemo(
    () => ({
      upsertDataviewInstance,
      removeDataviewInstance,
      deleteDataviewInstance,
      addNewDataviewInstances,
    }),
    [
      addNewDataviewInstances,
      deleteDataviewInstance,
      removeDataviewInstance,
      upsertDataviewInstance,
    ]
  )
}
