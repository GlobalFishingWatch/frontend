import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import styles from './ReportVesselsGraph.module.css'
import ReportVesselsGraphSelector from './ReportVesselsGraphSelector'
import { selectReportVesselsGraphData } from './reports.selectors'

type ReportVesselsGraphProps = {}

export default function ReportVesselsGraph(props: ReportVesselsGraphProps) {
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const data = useSelector(selectReportVesselsGraphData)
  return (
    <Fragment>
      <ReportVesselsGraphSelector />
      <div className={styles.graph}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <Tooltip />
            {dataviews.map((dataview) => {
              return (
                <Bar
                  key={dataview.id}
                  dataKey={dataview.id}
                  stackId="a"
                  fill={dataview.config?.color}
                />
              )
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  )
}
