import { useSelector } from 'react-redux'

import {
  selectReportVesselsGraphAggregatedData,
  selectReportVesselsGraphIndividualData,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVessels from 'features/reports/shared/vessels/ReportVessels'

// TODO:CVP decide if we pass data as params or grab them from the selector
function ReportVesselsGroup({ loading }: { loading: boolean }) {
  const data = useSelector(selectReportVesselsGraphAggregatedData)
  const individualData = useSelector(selectReportVesselsGraphIndividualData)
  return <ReportVessels data={data} individualData={individualData} loading={loading} />
}

export default ReportVesselsGroup
