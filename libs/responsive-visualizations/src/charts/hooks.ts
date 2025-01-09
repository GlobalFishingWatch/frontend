import { useState, useEffect, useCallback, useMemo } from 'react'
import type { ResponsiveVisualizationData, ResponsiveVisualizationItem } from '../types'
import type {
  getIsIndividualBarChartSupported,
  getIsIndividualTimeseriesSupported,
} from '../lib/density'
import type { BaseResponsiveChartProps, ResponsiveVisualizationContainerRef } from './types'
import {
  DEFAULT_AGGREGATED_VALUE_KEY,
  DEFAULT_INDIVIDUAL_VALUE_KEY,
  DEFAULT_LABEL_KEY,
} from './config'

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

type UseResponsiveLoadDataProps = {
  labelKey: string
  individualValueKey: BaseResponsiveChartProps['individualValueKey']
  aggregatedValueKey: BaseResponsiveChartProps['aggregatedValueKey']
  getAggregatedData?: BaseResponsiveChartProps['getAggregatedData']
  getIndividualData?: BaseResponsiveChartProps['getAggregatedData']
  getIsIndividualSupported:
    | typeof getIsIndividualBarChartSupported
    | typeof getIsIndividualTimeseriesSupported
}
export function useResponsiveVisualizationData({
  labelKey = DEFAULT_LABEL_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  getAggregatedData,
  getIndividualData,
  getIsIndividualSupported,
}: UseResponsiveLoadDataProps) {
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
              [labelKey]: item[labelKey],
              [individualValueKey]: value.length,
            }
          })
          setIsIndividualSupported(false)
          setData(aggregatedData)
        }
      }
    },
    [
      getAggregatedData,
      getIndividualData,
      getIsIndividualSupported,
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
