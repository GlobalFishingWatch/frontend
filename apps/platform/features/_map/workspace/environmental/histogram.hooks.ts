import { useCallback, useEffect, useMemo, useState } from 'react'
import { bin } from 'd3'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import {
  isHeatmapVectorsDataview,
  type UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer, useGetDeckLayerLegend } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { useDebounce } from '@globalfishingwatch/react-hooks'

import { useMapBounds } from 'features/_map/map/map-bounds.hooks'
import { useActivityDataviewId } from 'features/_map/map/map-layers.hooks'

export type DataviewValuesRange = { min: number; max: number; steps?: number[] }
/** `data` is what the chart plots, log scaled; `count` is the real number of cells in the bin. */
export type HistogramBin = { data: number; count: number }

const BARS = 30
const BAR_SCALE_EXPONENT = 0.4

const getDataviewDataset = (dataview: UrlDataviewInstance) =>
  dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.UserContext
  ) as Dataset

const useDataviewLayerId = (dataview: UrlDataviewInstance) => {
  const mergedDataviewId = useActivityDataviewId(dataview)
  return dataview.category === DataviewCategory.Activity ||
    dataview.category === DataviewCategory.Detections
    ? mergedDataviewId
    : dataview.id
}

export const useDataviewValuesRange = (
  dataview: UrlDataviewInstance
): DataviewValuesRange | undefined => {
  const legend = useGetDeckLayerLegend(useDataviewLayerId(dataview))
  const dataset = getDataviewDataset(dataview)
  const domain = legend?.domain

  const range = useMemo((): DataviewValuesRange | undefined => {
    const datasetRange = getEnvironmentalDatasetRange(dataset)
    const fallback =
      Number.isFinite(datasetRange.min) &&
      Number.isFinite(datasetRange.max) &&
      (datasetRange.min !== 0 || datasetRange.max !== 0)
        ? datasetRange
        : undefined

    const domainSteps = ((domain ?? []) as number[])
      .filter((value) => typeof value === 'number' && Number.isFinite(value))
      .toSorted((a, b) => a - b)
    if (domainSteps.length < 2) {
      return fallback
    }
    const min = fallback ? fallback.min : Math.floor(domainSteps[0])
    const max = fallback ? fallback.max : Math.ceil(domainSteps[domainSteps.length - 1])
    if (max <= min) {
      return fallback
    }
    const steps = [min, ...domainSteps.filter((step) => step > min && step < max), max]
    return steps.length > 2 ? { min, max, steps } : { min, max }
  }, [dataset, domain])

  // the legend atom goes empty while the layer reloads its tiles: keep the last scale we resolved
  // so the control doesn't disappear, or drop back to an unstepped range, on every blip
  const [lastRange, setLastRange] = useState<DataviewValuesRange>()
  useEffect(() => {
    if (range?.steps?.length) {
      setLastRange(range)
    }
  }, [range])

  return range?.steps?.length ? range : (lastRange ?? range)
}

export const useDataviewHistogram = (
  dataview: UrlDataviewInstance,
  range: DataviewValuesRange | undefined
) => {
  const { bounds } = useMapBounds()
  const deboncedBounds = useDebounce(bounds, 1000)
  const layer = useGetDeckLayer<FourwingsLayer>(useDataviewLayerId(dataview))
  const sourcesLoaded = layer?.loaded
  const isHeatmapVector = isHeatmapVectorsDataview(dataview)
  const sublayerIndex = layer?.instance?.props?.sublayers?.findIndex((s) => s.id === dataview.id)
  const valueIndex = isHeatmapVector ? 0 : sublayerIndex
  const [histogram, setHistogram] = useState<HistogramBin[]>()

  const updateHistogram = useCallback(
    (features: FourwingsFeature[]) => {
      if (!range || !features?.length) {
        return
      }
      const data: number[] = []
      const inRange = (value: number | undefined): value is number =>
        value !== undefined && value >= range.min && value <= range.max
      for (const feature of features) {
        const values = feature.aggregatedValues
        if (!values) {
          continue
        }
        if (valueIndex !== undefined && valueIndex >= 0) {
          const value = values[valueIndex]
          if (inRange(value)) {
            data.push(value)
          }
        } else {
          for (const value of values) {
            if (inRange(value)) {
              data.push(value)
            }
          }
        }
      }
      if (!data.length) {
        return
      }
      const width = (range.max - range.min) / BARS
      const thresholds = Array.from({ length: BARS - 1 }, (_, i) => range.min + width * (i + 1))
      const histogram = bin().domain([range.min, range.max]).thresholds(thresholds)(data)
      setHistogram(
        histogram.map((bin) => ({ data: bin.length ** BAR_SCALE_EXPONENT, count: bin.length }))
      )
    },
    [range, valueIndex]
  )
  useEffect(() => {
    if (sourcesLoaded) {
      const features = layer.instance?.getViewportData?.() as FourwingsFeature[]
      updateHistogram(features)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourcesLoaded, deboncedBounds, updateHistogram])

  return { histogram, loading: !sourcesLoaded }
}
