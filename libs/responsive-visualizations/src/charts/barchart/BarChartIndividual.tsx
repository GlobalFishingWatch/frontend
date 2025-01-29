import React from 'react'
import { BarChart, ResponsiveContainer, XAxis } from 'recharts'

import type { ResponsiveVisualizationValue } from '../../types'
import { AXIS_LABEL_PADDING, POINT_GAP } from '../config'
import { IndividualPoint } from '../points/IndividualPoint'
import type { BarChartByTypeProps } from '../types'

import styles from './BarChartIndividual.module.css'

type IndividualBarChartProps = BarChartByTypeProps<'individual'> & { pointSize?: number }

export function IndividualBarChart({
  data,
  color,
  barLabel,
  valueKeys,
  labelKey,
  barValueFormatter,
  customTooltip,
  customItem,
  pointSize,
  onClick,
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
      >
        <foreignObject width="100%" height="100%">
          <div className={styles.container} style={{ paddingBottom: AXIS_LABEL_PADDING }}>
            {data.map((item, index) => {
              const totalPoints = (
                item?.[valueKeys as string] as ResponsiveVisualizationValue<'individual'>[]
              ).length
              return (
                <div key={index} className={styles.barContainer}>
                  <label className={styles.label}>
                    {barValueFormatter?.(totalPoints) || totalPoints}
                  </label>
                  <ul className={styles.bar} style={{ gap: POINT_GAP }}>
                    {(
                      item?.[valueKeys as string] as ResponsiveVisualizationValue<'individual'>[]
                    )?.map((point, pointIndex) => (
                      <IndividualPoint
                        key={pointIndex}
                        pointSize={pointSize}
                        point={point}
                        color={point.color || color}
                        tooltip={customTooltip}
                        item={customItem}
                        onClick={onClick}
                      />
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </foreignObject>
        <XAxis
          dataKey={labelKey}
          interval="equidistantPreserveStart"
          tickLine={false}
          minTickGap={-1000}
          tick={barLabel}
          tickMargin={0}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
