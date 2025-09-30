import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { groupBy } from 'es-toolkit'

import type { ResponsiveVisualizationData } from '@globalfishingwatch/responsive-visualizations'
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'

import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { selectVGRFootprintDataview } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import VesselGroupReportVesselsIndividualTooltip from 'features/reports/shared/vessels/ReportVesselsIndividualTooltip'
import VesselGraphLink from 'features/reports/shared/vessels/VesselGraphLink'
import { COVERAGE_GRAPH_BUCKETS } from 'features/reports/tabs/vessel-group-insights/vessel-group-report-insights.utils'

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

function getDataByCoverage(vessels: ReportTableVessel[]): Record<string, any[]> {
  if (!vessels?.length) return {}
  return groupBy(vessels, (entry) => entry.coverageBucket!)
}

function parseCoverageGraphAggregatedData(
  vessels: ReportTableVessel[]
): ResponsiveVisualizationData<'aggregated'> {
  const groupedDataByCoverage = getDataByCoverage(vessels)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    value: groupedDataByCoverage[key]?.length || 0,
  }))
}

function parseCoverageGraphIndividualData(
  vessels: ReportTableVessel[]
): ResponsiveVisualizationData<'individual'> {
  const groupedDataByCoverage = getDataByCoverage(vessels)
  return Object.keys(COVERAGE_GRAPH_BUCKETS).map((key) => ({
    label: key,
    values: (groupedDataByCoverage[key] || []).sort((a, b) => {
      return a.value - b.value
    }),
  }))
}

export default function VesselGroupReportInsightCoverageGraph({
  data,
}: {
  data: ReportTableVessel[]
}) {
  const getIndividualData = useCallback(async () => {
    if (data && data.length) {
      return parseCoverageGraphIndividualData(data)
    }
    return []
  }, [data])

  const getAggregatedData = useCallback(async () => {
    if (data && data.length) {
      return parseCoverageGraphAggregatedData(data)
    }
    return []
  }, [data])

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
