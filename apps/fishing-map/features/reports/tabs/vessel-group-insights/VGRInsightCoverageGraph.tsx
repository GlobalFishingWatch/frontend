import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import { type VesselGroupInsightResponse } from '@globalfishingwatch/api-types'
import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectVGRFootprintDataview } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { selectVGRData } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import { selectReportVesselsFiltered } from 'features/reports/shared/vessels/report-vessels.selectors'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import VesselGroupReportVesselsIndividualTooltip from 'features/reports/shared/vessels/ReportVesselsIndividualTooltip'
import VesselGraphLink from 'features/reports/shared/vessels/VesselGraphLink'
import { getSearchIdentityResolved } from 'features/vessel/vessel.utils'
import type { VesselGroupVesselIdentity } from 'features/vessel-groups/vessel-groups-modal.slice'
import { formatInfoField } from 'utils/info'
import { weightedMean } from 'utils/statistics'

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

const COVERAGE_GRAPH_BUCKETS: Record<string, number> = {
  unknown: -1,
  '≤20%': 20,
  '21-40%': 40,
  '41-60%': 60,
  '61-80%': 80,
  '≥81%': 100,
}
const CoverageGraphBuckets = Object.keys(COVERAGE_GRAPH_BUCKETS)
function parseCoverageGraphValueBucket(value: number) {
  if (value === -1) {
    return 'unknown'
  }
  return (
    CoverageGraphBuckets.find((key) => value < COVERAGE_GRAPH_BUCKETS[key]) ||
    CoverageGraphBuckets[CoverageGraphBuckets.length - 1]
  )
}

type CoverageData = {
  name: string
  vessel: ReportTableVessel
  values: number[]
  counts: number[]
}
function getDataByCoverage(
  data: VesselGroupInsightResponse['coverage'],
  vessels: ReportTableVessel[]
): Record<string, any[]> {
  if (!data) return {}
  const groupedData: Record<string, CoverageData> = {}
  vessels.forEach((vessel) => {
    const coverage = data.find((d) => d.vesselId === vessel.id)
    if (!groupedData[vessel.id]) {
      groupedData[vessel.id] = {
        name: vessel.id,
        vessel,
        values: [coverage ? coverage.percentage : -1],
        counts: [coverage ? parseInt(coverage.blocks) : -1],
      }
    } else {
      groupedData[vessel.id].values.push(coverage ? coverage.percentage : -1)
      groupedData[vessel.id].counts.push(coverage ? parseInt(coverage.blocks) : -1)
    }
  })
  const dataByCoverage = Object.values(groupedData).map((d) => ({
    name: d.name,
    vessel: d.vessel,
    value: parseCoverageGraphValueBucket(weightedMean(d.values, d.counts)),
    originalValue: weightedMean(d.values, d.counts),
  }))

  return groupBy(dataByCoverage, (entry) => entry.value!)
}

function parseCoverageGraphAggregatedData(
  data: VesselGroupInsightResponse['coverage'],
  vessels: ReportTableVessel[]
): ResponsiveVisualizationData<'aggregated'> {
  const groupedDataByCoverage = getDataByCoverage(data, vessels)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    value: groupedDataByCoverage[key]?.length || 0,
  }))
}

function parseCoverageGraphIndividualData(
  data: VesselGroupInsightResponse['coverage'],
  vessels: ReportTableVessel[]
): ResponsiveVisualizationData<'individual'> {
  const groupedDataByCoverage = getDataByCoverage(data, vessels)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    values: (groupedDataByCoverage[key] || []).map(({ originalValue, vessel }) => {
      return {
        ...vessel,
        value: originalValue,
      }
    }),
  }))
}

export default function VesselGroupReportInsightCoverageGraph({
  data,
}: {
  data: VesselGroupInsightResponse['coverage']
}) {
  const vessels = useSelector(selectReportVesselsFiltered)

  const getIndividualData = useCallback(async () => {
    if (vessels && vessels.length) {
      return parseCoverageGraphIndividualData(data, vessels)
    } else return []
  }, [data, vessels])

  const getAggregatedData = useCallback(async () => {
    if (vessels && vessels.length) {
      return parseCoverageGraphAggregatedData(data, vessels)
    } else return []
  }, [data, vessels])

  const reportDataview = useSelector(selectVGRFootprintDataview)
  return (
    <div className={styles.graph} data-test="insights-report-vessels-graph">
      <ResponsiveBarChart
        color={reportDataview?.config?.color || COLOR_PRIMARY_BLUE}
        getIndividualData={getIndividualData}
        getAggregatedData={getAggregatedData}
        barValueFormatter={(value: any) => {
          return formatI18nNumber(value).toString()
        }}
        barLabel={<CustomTick />}
        labelKey="label"
        individualTooltip={<VesselGroupReportVesselsIndividualTooltip />}
        individualItem={<VesselGraphLink />}
      />
    </div>
  )
}
