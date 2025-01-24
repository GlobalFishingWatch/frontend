import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import ReportVesselsFilter from 'features/reports/shared/activity/vessels/ReportVesselsFilter'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectVGRVesselFilter,
  selectVGRVesselsSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectVGRDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'
import {
  selectVGRVesselsGraphAggregatedData,
  selectVGRVesselsGraphIndividualData,
} from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import type { VGREventsVesselsProperty } from 'features/vessel-groups/vessel-groups.types'

import VesselGroupReportVesselsGraph from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
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
