import { Fragment } from 'react'
import { useSelector } from 'react-redux'

import { selectVGRDataview } from 'features/reports/report-vessel-group/vessel-group-report.selectors'
import {
  selectReportVesselFilter,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import type { ReportVesselsSubCategory } from 'features/reports/reports.types'
import ReportVesselsPlaceholder from 'features/reports/shared/placeholders/ReportVesselsPlaceholder'
import {
  selectVGRVesselsGraphAggregatedData,
  selectVGRVesselsGraphIndividualData,
} from 'features/reports/shared/vessels/report-vessels.selectors'
import ReportVesselsFilter from 'features/reports/tabs/activity/vessels/ReportVesselsFilter'

import VesselGroupReportVesselsGraph from './ReportVesselsGraph'
import VesselGroupReportVesselsGraphSelector from './ReportVesselsGraphSelector'
import VesselGroupReportVesselsTable from './ReportVesselsTable'

import styles from './ReportVessels.module.css'

function VesselGroupReportVessels({ loading }: { loading: boolean }) {
  const subsection = useSelector(selectReportVesselsSubCategory)
  const reportDataview = useSelector(selectVGRDataview)
  const filter = useSelector(selectReportVesselFilter)
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
            property={subsection as ReportVesselsSubCategory}
          />
          <ReportVesselsFilter filter={filter} />
          <VesselGroupReportVesselsTable />
        </Fragment>
      )}
    </div>
  )
}

export default VesselGroupReportVessels
