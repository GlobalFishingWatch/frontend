import { useState, useEffect, useCallback, useMemo } from 'react'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { ResponsiveVisualizationData, ResponsiveVisualizationItem } from '../types'
import type {
  getIsIndividualBarChartSupported,
  getIsIndividualTimeseriesSupported,
} from '../lib/density'
import type { BaseResponsiveChartProps, ResponsiveVisualizationAnyItemKey } from './types'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_LABEL_KEY,
} from './config'

type ResponsiveVisualizationContainerRef = React.RefObject<HTMLElement | null>
export function useResponsiveDimensions(containerRef: ResponsiveVisualizationContainerRef) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current)
      }
    }
  }, [containerRef])

  return dimensions
}

type UseResponsiveVisualizationDataProps = {
  start?: string
  end?: string
  timeseriesInterval?: FourwingsInterval
  labelKey: ResponsiveVisualizationAnyItemKey
  individualValueKey: BaseResponsiveChartProps['individualValueKey']
  aggregatedValueKey: BaseResponsiveChartProps['aggregatedValueKey']
  getAggregatedData?: BaseResponsiveChartProps['getAggregatedData']
  getIndividualData?: BaseResponsiveChartProps['getIndividualData']
  getIsIndividualSupported:
    | typeof getIsIndividualBarChartSupported
    | typeof getIsIndividualTimeseriesSupported
}
export function useResponsiveVisualizationData({
  labelKey = DEFAULT_LABEL_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  start,
  end,
  timeseriesInterval,
  getAggregatedData,
  getIndividualData,
  getIsIndividualSupported,
}: UseResponsiveVisualizationDataProps) {
  const [data, setData] = useState<ResponsiveVisualizationData | null>(null)
  const [isIndividualSupported, setIsIndividualSupported] = useState(false)

  const loadData = useCallback(
    async ({ width, height }: { width: number; height: number }) => {
      if (getAggregatedData) {
        const aggregatedData = await getAggregatedData()
        if (!aggregatedData) {
          return
        }
        if (
          getIndividualData &&
          getIsIndividualSupported({
            data: aggregatedData,
            width,
            height,
            start,
            end,
            timeseriesInterval,
            individualValueKey,
            aggregatedValueKey,
          })
        ) {
          const individualData = await getIndividualData()
          if (individualData) {
            setIsIndividualSupported(true)
            setData(individualData)
          } else {
            setIsIndividualSupported(false)
            setData(aggregatedData)
          }
        } else {
          setIsIndividualSupported(false)
          setData(aggregatedData)
        }
      } else if (getIndividualData) {
        const individualData = await getIndividualData()
        if (!individualData) {
          return
        }
        if (
          getIsIndividualSupported({
            data: individualData,
            width,
            height,
            start,
            end,
            timeseriesInterval,
            individualValueKey,
            aggregatedValueKey,
          })
        ) {
          setIsIndividualSupported(true)
          setData(individualData)
        } else {
          const aggregatedData = individualData.map((item) => {
            const value = item[individualValueKey] as ResponsiveVisualizationItem[]
            return {
              [labelKey]: item[labelKey as keyof typeof item],
              [individualValueKey]: value.length,
            }
          }) as ResponsiveVisualizationData
          setIsIndividualSupported(false)
          setData(aggregatedData)
        }
      }
    },
    [
      getAggregatedData,
      getIndividualData,
      getIsIndividualSupported,
      start,
      end,
      timeseriesInterval,
      individualValueKey,
      aggregatedValueKey,
      labelKey,
    ]
  )

  return useMemo(
    () => ({ data, isIndividualSupported, loadData }),
    [data, isIndividualSupported, loadData]
  )
}

export function useResponsiveVisualization(
  containerRef: ResponsiveVisualizationContainerRef,
  params: UseResponsiveVisualizationDataProps
) {
  const dimensions = useResponsiveDimensions(containerRef)
  const { data, isIndividualSupported, loadData } = useResponsiveVisualizationData(params)

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      loadData(dimensions)
    }
  }, [dimensions, loadData])

  return useMemo(
    () => ({ ...dimensions, data, isIndividualSupported }),
    [data, isIndividualSupported, dimensions]
  )
}
