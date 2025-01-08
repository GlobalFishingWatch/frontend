import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import { getIsIndividualBarChartSupported } from '../../lib/density'
import { IndividualBarChart } from './BarChartIndividual'
import { AggregatedBarChart } from './BarChartAggregated'

export type BaseResponsiveBarChartProps = {
  color: string
  customTick?: ReactElement<SVGElement>
  customTooltip?: ReactElement
  valueFormatter?: (value: any) => string
}

export type ResponsiveBarChartInteractionCallback = (item: any) => void

export type ResponsiveBarChartProps = BaseResponsiveBarChartProps & {
  containerRef: React.RefObject<HTMLElement | null>
  onAggregatedItemClick?: ResponsiveBarChartInteractionCallback
  onIndividualItemClick?: ResponsiveBarChartInteractionCallback
  getIndividualData?: () => Promise<ResponsiveVisualizationData<'individual'>>
  getAggregatedData?: () => Promise<ResponsiveVisualizationData<'aggregated'>>
}

export function ResponsiveBarChart({
  containerRef,
  getIndividualData,
  getAggregatedData,
  color,
  customTick,
  customTooltip,
  valueFormatter,
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
        if (getIsIndividualBarChartSupported({ data: individualData, width, height })) {
          setIsIndividualSupported(true)
          setData(individualData)
        } else {
          const aggregatedData = individualData.map((item) => ({
            name: item.name,
            value: item.values.length,
          }))
          setIsIndividualSupported(false)
          setData(aggregatedData)
        }
      }
    },
    [getAggregatedData, getIndividualData]
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
      width={width}
      data={data as ResponsiveVisualizationData<'individual'>}
      color={color}
      onClick={onIndividualItemClick}
      customTick={customTick}
      customTooltip={customTooltip}
      valueFormatter={valueFormatter}
    />
  ) : (
    <AggregatedBarChart
      data={data as ResponsiveVisualizationData<'aggregated'>}
      color={color}
      onClick={onAggregatedItemClick}
      customTick={customTick}
      customTooltip={customTooltip}
      valueFormatter={valueFormatter}
    />
  )
}
