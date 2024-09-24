import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { ColorCyclingType, Workspace } from '@globalfishingwatch/api-types'
import {
  FillColorBarOptions,
  LineColorBarOptions,
  ColorBarOption,
} from '@globalfishingwatch/ui-components'
import {
  selectIsAnyReportLocation,
  selectUrlDataviewInstances,
  selectUrlTimeRange,
  selectUrlViewport,
} from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectWorkspaceDataviewInstances } from './workspace.selectors'

export const useFitWorkspaceBounds = () => {
  const urlViewport = useSelector(selectUrlViewport)
  const isReportLocation = useSelector(selectIsAnyReportLocation)
  const urlTimeRange = useSelector(selectUrlTimeRange)

  const { setTimerange } = useTimerangeConnect()
  const setMapCoordinates = useSetMapCoordinates()

  const fitWorkspaceBounds = useCallback(
    async (workspace: Workspace) => {
      const viewport = urlViewport || workspace?.viewport
      if (viewport && !isReportLocation) {
        setMapCoordinates(viewport)
      }
      if (!urlTimeRange && workspace?.startAt && workspace?.endAt) {
        setTimerange({
          start: workspace?.startAt,
          end: workspace?.endAt,
        })
      }
    },
    [isReportLocation, setMapCoordinates, setTimerange, urlTimeRange, urlViewport]
  )

  return fitWorkspaceBounds
}

const createDataviewsInstances = (
  newDataviewInstances: Partial<UrlDataviewInstance>[],
  currentDataviewInstances: UrlDataviewInstance[] = []
): UrlDataviewInstance[] => {
  const currentColors = currentDataviewInstances.flatMap((dv) => dv.config?.color || [])
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
        },
      } as UrlDataviewInstance
      if (dataview.config.colorCyclingType === 'fill') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

const getNextColor = (colorCyclingType: ColorCyclingType, currentColors: string[] | undefined) => {
  const palette = colorCyclingType === 'fill' ? FillColorBarOptions : LineColorBarOptions
  if (!currentColors) {
    return palette[0]
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
  return {
    upsertDataviewInstance,
    removeDataviewInstance,
    deleteDataviewInstance,
    addNewDataviewInstances,
  }
}
