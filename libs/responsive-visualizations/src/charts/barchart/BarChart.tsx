import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type {
  ResponsiveVisualizationData,
  ResponsiveVisualizationItem,
  ResponsiveVisualizationMode,
} from '../../types'
import { getIsIndividualBarChartSupported } from '../../lib/density'
import { IndividualBarChart } from './BarChartIndividual'
import { AggregatedBarChart } from './BarChartAggregated'

export const DEFAULT_LABEL_KEY = 'label'
export const DEFAULT_AGGREGATED_VALUE_KEY = 'value'
export const DEFAULT_INDIVIDUAL_VALUE_KEY = 'values'

export type BaseResponsiveBarChartProps = {
  color: string
  barLabel?: ReactElement<SVGElement>
  barValueFormatter?: (value: any) => string
}

export type ResponsiveBarChartInteractionCallback<Item = ResponsiveVisualizationItem> = (
  item: Item
) => void

export type BarChartByTypeProps<M extends ResponsiveVisualizationMode> =
  BaseResponsiveBarChartProps & {
    labelKey: string
    valueKey: string
    data: ResponsiveVisualizationData<M>
    onClick?: ResponsiveBarChartInteractionCallback
    customTooltip?: ReactElement
  }

export type ResponsiveBarChartProps = BaseResponsiveBarChartProps & {
  containerRef: React.RefObject<HTMLElement | null>
  labelKey?: string
  // Aggregated props
  aggregatedTooltip?: ReactElement
  onAggregatedItemClick?: ResponsiveBarChartInteractionCallback
  getAggregatedData?: () => Promise<ResponsiveVisualizationData<'aggregated'> | undefined>
  aggregatedValueKey?: string
  // Individual props
  individualTooltip?: ReactElement
  onIndividualItemClick?: ResponsiveBarChartInteractionCallback
  getIndividualData?: () => Promise<ResponsiveVisualizationData<'individual'> | undefined>
  individualValueKey?: string
}

export function ResponsiveBarChart({
  containerRef,
  getIndividualData,
  getAggregatedData,
  color,
  aggregatedValueKey = DEFAULT_AGGREGATED_VALUE_KEY,
  individualValueKey = DEFAULT_INDIVIDUAL_VALUE_KEY,
  labelKey = DEFAULT_LABEL_KEY,
  barLabel,
  aggregatedTooltip,
  individualTooltip,
  barValueFormatter,
  onIndividualItemClick,
  onAggregatedItemClick,
}: ResponsiveBarChartProps) {
  const [data, setData] = useState<ResponsiveVisualizationData | null>(null)
  const [isIndividualSupported, setIsIndividualSupported] = useState(false)
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })

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

  const loadData = useCallback(
    async ({ width, height }: { width: number; height: number }) => {
      if (getAggregatedData) {
        const aggregatedData = await getAggregatedData()
        if (!aggregatedData) {
          return
        }
        if (
          getIndividualData &&
          getIsIndividualBarChartSupported({ data: aggregatedData, width, height })
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
        if (getIsIndividualBarChartSupported({ data: individualData, width, height })) {
          setIsIndividualSupported(true)
          setData(individualData)
        } else {
          const aggregatedData = individualData.map((item) => {
            const value = item[aggregatedValueKey] as ResponsiveVisualizationItem[]
            return {
              [labelKey]: item[labelKey],
              [aggregatedValueKey]: value.length,
            }
          })
          setIsIndividualSupported(false)
          setData(aggregatedData)
        }
      }
    },
    [getAggregatedData, getIndividualData, aggregatedValueKey, labelKey]
  )

  useEffect(() => {
    if (width && height) {
      loadData({ width, height })
    }
  }, [height, width, loadData])

  if (!getAggregatedData && !getIndividualData) {
    console.warn('No data getters functions provided')
    return null
  }

  if (!data) {
    return 'Spinner'
  }
  if (isIndividualSupported && !data) {
    return 'Spinner for individual'
  }

  return isIndividualSupported ? (
    <IndividualBarChart
      data={data as ResponsiveVisualizationData<'individual'>}
      color={color}
      valueKey={individualValueKey}
      labelKey={labelKey}
      onClick={onIndividualItemClick}
      barLabel={barLabel}
      customTooltip={individualTooltip}
      barValueFormatter={barValueFormatter}
    />
  ) : (
    <AggregatedBarChart
      data={data as ResponsiveVisualizationData<'aggregated'>}
      color={color}
      valueKey={aggregatedValueKey}
      labelKey={labelKey}
      onClick={onAggregatedItemClick}
      barLabel={barLabel}
      customTooltip={aggregatedTooltip}
      barValueFormatter={barValueFormatter}
    />
  )
}
