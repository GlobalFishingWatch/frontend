import { useSelector } from 'react-redux'
import ReportVesselsFilter from 'features/reports/activity/vessels/ReportVesselsFilter'
import { selectVGRVesselsGraphDataGrouped } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import {} from 'features/reports/vessel-groups/vessel-group-report.selectors'
import {
  selectVGRVesselFilter,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import ReportVesselsPlaceholder from 'features/reports/placeholders/ReportVesselsPlaceholder'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph, {
  VesselGroupReportVesselsGraphProperty,
} from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsTable from './VesselGroupReportVesselsTable'
import styles from './VesselGroupReportVessels.module.css'
import { Fragment } from 'react'

function VesselGroupReportVessels({ loading }: { loading: boolean }) {
  const subsection = useSelector(selectVGRVesselsSubsection)
  const reportDataview = useSelector(selectVGRDataview)
  const filter = useSelector(selectVGRVesselFilter)
  const data = useSelector(selectVGRVesselsGraphDataGrouped)
  return (
    <div className={styles.container}>
      <VesselGroupReportVesselsGraphSelector />
      {loading ? (
        <ReportVesselsPlaceholder showGraphHeader={false} />
      ) : (
        <Fragment>
          <VesselGroupReportVesselsGraph
            data={data}
            color={reportDataview?.config?.color}
            property={subsection as VesselGroupReportVesselsGraphProperty}
            filterQueryParam="vGRVesselFilter"
            pageQueryParam="vGRVesselPage"
          />
          <ReportVesselsFilter
            filter={filter}
            filterQueryParam="vGRVesselFilter"
            pageQueryParam="vGRVesselPage"
          />
          <VesselGroupReportVesselsTable />
        </Fragment>
      )}
    </div>
  )
}

export default VesselGroupReportVessels
