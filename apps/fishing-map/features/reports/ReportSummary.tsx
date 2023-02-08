import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { selectReportVesselsHours, selectReportVesselsNumber } from './reports.selectors'
import styles from './ReportSummary.module.css'

type ReportSummaryProps = {}

export default function ReportSummary(props: ReportSummaryProps) {
  const { t } = useTranslation()
  const timerange = useSelector(selectUrlTimeRange)
  const reportVessels = useSelector(selectReportVesselsNumber)
  const reportHours = useSelector(selectReportVesselsHours)
  // const dataviews = useSelector(selectActiveHeatmapDataviews)
  const summary = t('analysis.summary', {
    defaultValue:
      '<strong>{{vessels}} $t(common.vessel, {"count": {{vessels}} })</strong> had <strong>{{hours}} $t(common.hour, {"count": {{hours}} })</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
    vessels: reportVessels || 0,
    hours: Math.floor(reportHours),
    activityType: 'Apparent fishing effort', // TODO get this from dataviews
    start: formatI18nDate(timerange.start),
    end: formatI18nDate(timerange.end),
  })
  return (
    <div className={styles.container}>
      <p className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></p>
    </div>
  )
}
