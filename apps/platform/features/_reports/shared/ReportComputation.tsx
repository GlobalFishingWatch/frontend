import { ReportCategory } from 'features/_reports/reports.types'
import { useComputeReportHotspot } from 'features/_reports/reports-hotspot.hooks'
import { useComputeReportTimeSeries } from 'features/_reports/reports-timeseries.hooks'

const COMPUTED_CATEGORIES = [
  ReportCategory.Activity,
  ReportCategory.Detections,
  ReportCategory.Environment,
  ReportCategory.Others,
]

function ReportHotspotComputation() {
  useComputeReportHotspot()
  return null
}

function ReportTimeseriesComputation({ category }: { category: ReportCategory }) {
  useComputeReportTimeSeries()
  return category === ReportCategory.Activity || category === ReportCategory.Detections ? (
    <ReportHotspotComputation />
  ) : null
}

export default function ReportComputation({ category }: { category: ReportCategory }) {
  return COMPUTED_CATEGORIES.includes(category) ? (
    <ReportTimeseriesComputation category={category} />
  ) : null
}
