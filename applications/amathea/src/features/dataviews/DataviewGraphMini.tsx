import React from 'react'
import { LineChart, Line, YAxis } from 'recharts'
import { DateTime } from 'luxon'
import { TEST_DATAVIEW_MONTHLY_STATS, DataviewGraphConfig } from 'data/data'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

interface DataviewGraphMiniProps {
  dataview: DataviewGraphConfig
}

const DataviewGraphMini: React.FC<DataviewGraphMiniProps> = (props) => {
  const { dataview } = props
  const { start, end } = useTimerangeConnect()

  const data = TEST_DATAVIEW_MONTHLY_STATS[dataview.id].filter((current) => {
    const currentDate = DateTime.fromISO(current.date).startOf('day')
    const startDate = DateTime.fromISO(start).startOf('day')
    const endDate = DateTime.fromISO(end).startOf('day')
    return currentDate >= startDate && currentDate <= endDate
  })

  return (
    <LineChart width={40} height={20} data={data} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
      <YAxis type="number" domain={['dataMin', 'dataMax']} hide />
      <Line
        type="monotone"
        dataKey="value"
        stroke={dataview?.color}
        strokeWidth={2}
        isAnimationActive={false}
        dot={false}
      />
    </LineChart>
  )
}

export default DataviewGraphMini
