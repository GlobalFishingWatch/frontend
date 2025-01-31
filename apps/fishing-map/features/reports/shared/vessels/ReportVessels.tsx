import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import {
  selectVGRVesselFilter,
  selectVGRVesselsSubsection,
} from 'features/reports/report-vessel-group/vessel-group.config.selectors'
import { selectVGRDataview } from 'features/reports/report-vessel-group/vessel-group-report.selectors'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectVGRVesselsGraphAggregatedData,
  selectVGRVesselsGraphIndividualData,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVesselsFilter from 'features/reports/tabs/activity/vessels/ReportVesselsFilter'
import type { VGREventsVesselsProperty } from 'features/vessel-groups/vessel-groups.types'

import VesselGroupReportVesselsGraph from './ReportVesselsGraph'
import VesselGroupReportVesselsGraphSelector from './ReportVesselsGraphSelector'
import VesselGroupReportVesselsTable from './ReportVesselsTable'

import styles from './ReportVessels.module.css'

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
