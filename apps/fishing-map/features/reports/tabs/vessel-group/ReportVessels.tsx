import ReportVessels from 'features/reports/shared/vessels/ReportVessels'

// TODO:CVP decide if we pass data as params or grab them from the selector
function ReportVesselsGroup({ loading }: { loading: boolean }) {
  return <ReportVessels loading={loading} />
}

export default ReportVesselsGroup
