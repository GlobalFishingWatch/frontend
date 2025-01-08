import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useHover,
  useTransitionStyles,
} from '@floating-ui/react'
import type { ReactElement } from 'react'
import cx from 'classnames'
import { useState } from 'react'
import type { ResponsiveVisualizationData } from '../../types'
import type { BaseResponsiveBarChartProps, ResponsiveBarChartInteractionCallback } from './BarChart'
import styles from './BarChartIndividual.module.css'

type IndividualBarChartProps = BaseResponsiveBarChartProps & {
  width: number
  data: ResponsiveVisualizationData<'individual'>
  onClick?: ResponsiveBarChartInteractionCallback
}

type IndividualBarChartPointProps = {
  color?: string
  point: IndividualBarChartProps['data'][0]['values'][0]
  valueFormatter?: (value: any) => string
  tooltip?: ReactElement
  className?: string
}
export function IndividualBarChartPoint({
  point,
  color,
  tooltip,
  valueFormatter,
  className,
}: IndividualBarChartPointProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: setIsOpen,
    middleware: [offset(1), flip(), shift()],
    whileElementsMounted: autoUpdate,
  })
  const hover = useHover(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])
  return (
    <li
      ref={refs.setReference}
      {...getReferenceProps()}
      className={styles.point}
      style={color ? { backgroundColor: color } : {}}
    >
      {isOpen && (
        <div
          ref={refs.setFloating}
          className={cx(styles.tooltip, className)}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {tooltip ? tooltip : valueFormatter?.(point) || point.name}
        </div>
      )}
    </li>
  )
}
export function IndividualBarChart({
  data,
  color,
  customTick,
  customTooltip,
  valueFormatter,
}: IndividualBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 15,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        // onClick={onBarClick}
      >
        {data && <Tooltip content={customTooltip} />}
        <foreignObject width="100%" height="100%">
          <div className={styles.container}>
            {data.map((item, index) => (
              <div className={styles.barContainer}>
                <label className={styles.label}>{item.values.length}</label>
                <ul key={index} className={styles.bar}>
                  {item.values?.map((point, pointIndex) => (
                    <IndividualBarChartPoint
                      key={pointIndex}
                      point={point}
                      color={color}
                      valueFormatter={valueFormatter}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </foreignObject>
        <XAxis
          dataKey="name"
          interval="equidistantPreserveStart"
          tickLine={false}
          minTickGap={-1000}
          tick={customTick}
          tickMargin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
