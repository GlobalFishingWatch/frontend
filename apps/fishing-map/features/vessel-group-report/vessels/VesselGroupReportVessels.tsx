import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import ReportVesselsFilter from 'features/area-report/vessels/ReportVesselsFilter'
import { selectVGRVessels } from 'features/vessel-group-report/vessel-group-report.slice'
import {
  selectVGRVesselsFlags,
  selectVGRVesselsGraphDataGrouped,
  selectVGRVesselsTimeRange,
} from 'features/vessel-group-report/vessels/vessel-group-report-vessels.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectVGRVesselFilter, selectVGRVesselsSubsection } from '../vessel-group.config.selectors'
import { selectVGRDataview } from '../vessel-group-report.selectors'
import VesselGroupReportVesselsGraphSelector from './VesselGroupReportVesselsGraphSelector'
import VesselGroupReportVesselsGraph, {
  VesselGroupReportVesselsGraphProperty,
} from './VesselGroupReportVesselsGraph'
import VesselGroupReportVesselsTable from './VesselGroupReportVesselsTable'
import styles from './VesselGroupReportVessels.module.css'

function VesselGroupReportVessels() {
  const { t } = useTranslation()
  const vessels = useSelector(selectVGRVessels)
  const subsection = useSelector(selectVGRVesselsSubsection)
  const reportDataview = useSelector(selectVGRDataview)
  const timeRange = useSelector(selectVGRVesselsTimeRange)
  const flags = useSelector(selectVGRVesselsFlags)
  const filter = useSelector(selectVGRVesselFilter)
  const data = useSelector(selectVGRVesselsGraphDataGrouped)
  return (
    <div className={styles.container}>
      {timeRange && vessels && flags && (
        <h2 className={styles.summary}>
          {parse(
            t('vesselGroup.summary', {
              defaultValue:
                'This group contains <strong>{{vessels}} vessels</strong> from <strong>{{flags}} flags</strong> active from <strong>{{start}}</strong> to <strong>{{end}}</strong>',
              vessels: vessels?.length,
              flags: flags?.size,
              start: formatI18nDate(timeRange.start, {
                format: DateTime.DATE_MED,
              }),
              end: formatI18nDate(timeRange.end, {
                format: DateTime.DATE_MED,
              }),
            })
          )}
        </h2>
      )}
      <VesselGroupReportVesselsGraphSelector />
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
    </div>
  )
}

export default VesselGroupReportVessels
