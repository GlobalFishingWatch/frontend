import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import ReportVesselsFilter from 'features/reports/shared/activity/vessels/ReportVesselsFilter'
import {
  selectVGRVesselsGraphAggregatedData,
  selectVGRVesselsGraphIndividualData,
} from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import {} from 'features/reports/vessel-groups/vessel-group-report.selectors'
import {
  selectVGRVesselFilter,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import type { VGREventsVesselsProperty } from 'features/vessel-groups/vessel-groups.types'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsTable from './VesselGroupReportVesselsTable'
import styles from './VesselGroupReportVessels.module.css'

function VesselGroupReportVessels({ loading }: { loading: boolean }) {
  const subsection = useSelector(selectVGRVesselsSubsection)
  const reportDataview = useSelector(selectVGRDataview)
  const filter = useSelector(selectVGRVesselFilter)
  const data = useSelector(selectVGRVesselsGraphAggregatedData)
  const individualData = useSelector(selectVGRVesselsGraphIndividualData)
  return (
    <div className={styles.container}>
      <VesselGroupReportVesselsGraphSelector />
      {loading ? (
        <ReportVesselsPlaceholder showGraphHeader={false} />
      ) : (
        <Fragment>
          <VesselGroupReportVesselsGraph
            data={data}
            individualData={individualData}
            color={reportDataview?.config?.color}
            property={subsection as VGREventsVesselsProperty}
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
