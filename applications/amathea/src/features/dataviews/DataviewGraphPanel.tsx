import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'
import { Dataview } from '@globalfishingwatch/dataviews-client'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { TEST_DATAVIEW_MONTHLY_STATS } from 'data/data'
import styles from './DataviewGraphPanel.module.css'

interface DataviewGraphPanelProps {
  dataview?: Dataview
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = (props) => {
  const { dataview } = props
  const data = dataview?.id && TEST_DATAVIEW_MONTHLY_STATS[dataview?.id]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>{dataview?.name}</p>
        <IconButton icon="info" />
        <IconButton icon="edit" />
        <IconButton icon="download" />
        <IconButton icon="delete" type="warning" />
        <IconButton icon="remove-from-map" />
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={data as { month: string; value: number }[]}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" />
          <YAxis
            type="number"
            dataKey="value"
            domain={[(dataMin) => Math.floor(dataMin) - 1, (dataMax) => Math.ceil(dataMax) + 1]}
            axisLine={false}
            tickLine={false}
            tickCount={5}
          />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DataviewGraphPanel
