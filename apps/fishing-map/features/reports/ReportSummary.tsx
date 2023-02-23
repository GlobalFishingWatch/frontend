import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
// import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import ReportSummaryTags from 'features/reports/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/reports/reports.utils'
import { ReportActivityUnit } from 'features/reports/Report'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectReportVesselsHours, selectReportVesselsNumber } from './reports.selectors'
import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit: ReportActivityUnit
}

export default function ReportSummary({ activityUnit }: ReportSummaryProps) {
  const { t } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const reportVessels = useSelector(selectReportVesselsNumber)
  // TODO: get this value from tiles
  // TODO: Support not rendering vesssels count when no report available
  const reportHours = useSelector(selectReportVesselsHours)
  const dataviews = useSelector(selectActiveReportDataviews)
  const datasetTitle = getDatasetTitleByDataview(dataviews?.[0], { showPrivateIcon: false })
  const commonProperties = getCommonProperties(dataviews)
  // TODO remove "hours" if category is not activity
  const summary = t('analysis.summary', {
    defaultValue:
      '<strong>{{vessels}} $t(common.vessel, {"count": {{vessels}} })</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
    vessels: reportVessels || 0,
    activityQuantity: Math.floor(reportHours),
    activityUnit: t(`common.${activityUnit}`, {
      defaultValue: 'hours',
      count: Math.floor(reportHours),
    }),
    activityType: datasetTitle,
    start: formatI18nDate(timerange?.start),
    end: formatI18nDate(timerange?.end),
  })
  return (
    <div className={styles.container}>
      <p className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></p>
      <div className={styles.tagsContainer}>
        {dataviews?.map((dataview, index) => (
          <ReportSummaryTags
            key={dataview.id}
            dataview={dataview}
            index={index}
            hiddenProperties={commonProperties}
            availableFields={FIELDS}
          />
        ))}
      </div>
    </div>
  )
}
