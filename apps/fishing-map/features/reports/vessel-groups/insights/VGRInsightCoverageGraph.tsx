import React, { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts'
import { groupBy } from 'es-toolkit'
import type { VesselGroupInsightResponse } from '@globalfishingwatch/api-types'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectVGRData } from 'features/reports/vessel-groups/vessel-group-report.slice'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import { weightedMean } from 'utils/statistics'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import styles from './VGRInsightCoverageGraph.module.css'

const CustomTick = (props: any) => {
  const { x, y, payload } = props

  return (
    <text transform={`translate(${x},${y - 3})`}>
      <tspan textAnchor="middle" x="0" dy={12}>
        {payload.value}
      </tspan>
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
  data: VesselGroupInsightResponse['coverage'],
  vessels: VesselGroupVesselIdentity[]
): VesselGroupReportCoverageGraphData[] {
  if (!data) return []
  const groupedData: Record<string, any> = {}
  data.forEach((d) => {
    const relationId = vessels.find((v) => v.vesselId === d.vesselId)?.relationId
    if (!relationId) return
    if (!groupedData[relationId]) {
      groupedData[relationId] = {
        name: relationId,
        values: [d.percentage],
        counts: [parseInt(d.blocks)],
      }
    } else {
      groupedData[relationId].values.push(d.percentage)
      groupedData[relationId].counts.push(parseInt(d.blocks))
    }
  })

  const dataByCoverage = Object.values(groupedData).map((d) => ({
    name: d.name,
    value: parseCoverageGraphValueBucket(weightedMean(d.values, d.counts)),
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
  const vesselGroup = useSelector(selectVGRData)
  const dataGrouped = useMemo(() => {
    if (vesselGroup?.vessels.length) {
      return parseCoverageGraphData(data, vesselGroup.vessels)
    } else return []
  }, [data, vesselGroup?.vessels])

  const reportDataview = useSelector(selectVGRDataview)
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
                fill={reportDataview?.config?.color || COLOR_PRIMARY_BLUE}
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
