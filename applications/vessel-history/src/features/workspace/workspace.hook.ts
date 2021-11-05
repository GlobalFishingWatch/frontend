import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { ColorCyclingType } from '@globalfishingwatch/api-types'
import {
  FillColorBarOptions,
  LineColorBarOptions,
  ColorBarOption,
} from '@globalfishingwatch/ui-components'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.selectors'
import { selectWorkspaceDataviewInstances } from './workspace.selectors'

const getNextColor = (
  colorCyclingType: ColorCyclingType,
  currentDataviews: UrlDataviewInstance[] | undefined
) => {
  const palette = colorCyclingType === 'fill' ? FillColorBarOptions : LineColorBarOptions
  if (!currentDataviews) {
    return palette[0]
  }
  const currentColors = currentDataviews.map((dv) => dv.config?.color).filter(Boolean)
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
  currentDataviewInstances: UrlDataviewInstance[] | undefined
): UrlDataviewInstance[] => {
  return newDataviewInstances.map((dataview) => {
    if (dataview.config?.colorCyclingType) {
      const nextColor = getNextColor(dataview.config.colorCyclingType, currentDataviewInstances)
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

export const useDataviewInstancesConnect = () => {
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const allDataviews = useSelector(selectDataviewInstancesResolved)
  const { dispatchQueryParams } = useLocationConnect()

  const removeDataviewInstance = useCallback(
    (id: string) => {
      const dataviewInstances = urlDataviewInstances?.filter(
        (urlDataviewInstance) => urlDataviewInstance.id !== id
      )
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances]
  )

  // TODO review if this is still needed or we switch to add / update
  const upsertDataviewInstance = useCallback(
    (dataviewInstance: Partial<UrlDataviewInstance>) => {
      const currentDataviewInstance = urlDataviewInstances?.find(
        (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
      )
      if (currentDataviewInstance) {
        const dataviewInstances = urlDataviewInstances.map((urlDataviewInstance) => {
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
        dispatchQueryParams({ dataviewInstances })
      } else {
        dispatchQueryParams({
          dataviewInstances: [
            ...createDataviewsInstances([dataviewInstance], allDataviews),
            ...(urlDataviewInstances || []),
          ],
        })
      }
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
    (id: string) => {
      const dataviewInstances = (urlDataviewInstances || []).filter(
        (urlDataviewInstance) => urlDataviewInstance.id !== id
      )
      const workspaceDataviewInstance = workspaceDataviewInstances?.find(
        (dataviewInstance) => dataviewInstance.id === id
      )
      if (workspaceDataviewInstance) {
        dataviewInstances.push({ id, deleted: true })
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
