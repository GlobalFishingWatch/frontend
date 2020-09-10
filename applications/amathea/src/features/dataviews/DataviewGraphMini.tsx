import React from 'react'
import { LineChart, Line, YAxis } from 'recharts'
import { DateTime } from 'luxon'
import { Dataview } from '@globalfishingwatch/dataviews-client/dist/types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useDataviewResource } from './dataviews.hook'

interface DataviewGraphMiniProps {
  dataview: Dataview
  graphColor: string
  className?: string
}

const DataviewGraphMini: React.FC<DataviewGraphMiniProps> = (props) => {
  const { dataview, graphColor, className } = props
  const { start, end } = useTimerangeConnect()
  const { dataviewResource } = useDataviewResource(dataview)

  if (!dataviewResource || !dataviewResource.data) return null

  const data = dataviewResource.data.filter((current) => {
    const currentDate = DateTime.fromISO(current.date).startOf('day')
    const startDate = DateTime.fromISO(start).startOf('day')
    const endDate = DateTime.fromISO(end).startOf('day')
    return currentDate >= startDate && currentDate <= endDate
  })

  return (
    <LineChart
      className={className}
      width={40}
      height={20}
      data={data}
      margin={{ top: 1, right: 1, left: 1, bottom: 1 }}
    >
      <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
      <Line
        type="monotone"
        dataKey="value"
        stroke={graphColor}
        strokeWidth={2}
        isAnimationActive={false}
        dot={false}
      />
    </LineChart>
  )
}

export default DataviewGraphMini
