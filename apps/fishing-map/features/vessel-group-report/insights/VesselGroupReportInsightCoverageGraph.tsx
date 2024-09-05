import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts'
import { groupBy } from 'es-toolkit'
import { VesselGroupInsightResponse } from '@globalfishingwatch/api-types'
import { selectVesselGroupReportDataview } from '../vessel-group-report.selectors'
import styles from './VesselGroupReportInsightCoverageGraph.module.css'

const CustomTick = (props: any) => {
  const { x, y, payload } = props

  return (
    <text transform={`translate(${x},${y - 3})`}>
      <Fragment>
        <tspan textAnchor="middle" x="0" dy={12}>
          {payload.value}
        </tspan>
      </Fragment>
    </text>
  )
}

type VesselGroupReportCoverageGraphData = {
  name: string
  value: number
}

const COVERAGE_GRAPH_BUCKETS: Record<string, number> = {
  '<20%': 20,
  '20-40%': 40,
  '40-60%': 60,
  '60-80%': 80,
  '>80%': 100,
}
const CoverageGraphBuckets = Object.keys(COVERAGE_GRAPH_BUCKETS)
function parseCoverageGraphValueBucket(value: number) {
  return (
    CoverageGraphBuckets.find((key) => value < COVERAGE_GRAPH_BUCKETS[key]) ||
    CoverageGraphBuckets[CoverageGraphBuckets.length - 1]
  )
}

function parseCoverageGraphData(
  data: VesselGroupInsightResponse['coverage']
): VesselGroupReportCoverageGraphData[] {
  if (!data) return []
  const dataByCoverage = data.map((d) => ({
    name: d.vesselId,
    value: parseCoverageGraphValueBucket(d.percentage),
  }))
  const groupedDataByCoverage = groupBy(dataByCoverage, (entry) => entry.value!)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    name: key,
    value: groupedDataByCoverage[key]?.length || 0,
  }))
}

export default function VesselGroupReportInsightCoverageGraph({
  data,
}: {
  data: VesselGroupInsightResponse['coverage']
}) {
  const dataGrouped = useMemo(() => parseCoverageGraphData(data), [data])
  const reportDataview = useSelector(selectVesselGroupReportDataview)
  return (
    <Fragment>
      <div className={styles.graph} data-test="report-vessels-graph">
        {dataGrouped && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={dataGrouped}
              margin={{
                top: 15,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <Bar
                className={styles.bar}
                dataKey="value"
                fill={reportDataview?.config?.color || 'rgb(22, 63, 137)'}
              >
                <LabelList position="top" valueAccessor={(entry: any) => entry.value} />
              </Bar>
              <XAxis
                dataKey="name"
                interval="equidistantPreserveStart"
                tickLine={false}
                minTickGap={-1000}
                tick={<CustomTick />}
                tickMargin={0}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Fragment>
  )
}
