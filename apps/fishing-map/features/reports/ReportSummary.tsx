import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sum } from 'lodash'
import { useMemo } from 'react'
import { Locale } from '@globalfishingwatch/api-types'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectActiveReportDataviews, selectTimeRange } from 'features/app/app.selectors'
import ReportSummaryTags from 'features/reports/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/reports/reports.utils'
import { ReportActivityUnit } from 'features/reports/Report'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { useFilteredTimeSeries } from 'features/reports/reports-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/reports-timeseries.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import ReportSummaryPlaceholder from 'features/reports/placeholders/ReportSummaryPlaceholder'
import ReportSummaryTagsPlaceholder from 'features/reports/placeholders/ReportSummaryTagsPlaceholder'
import { selectReportVesselsHours, selectReportVesselsNumber } from './reports.selectors'
import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit: ReportActivityUnit
  reportStatus: AsyncReducerStatus
}

export default function ReportSummary({ activityUnit, reportStatus }: ReportSummaryProps) {
  const { t, i18n } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const reportVessels = useSelector(selectReportVesselsNumber)
  const { loading: timeseriesLoading, layersTimeseriesFiltered } = useFilteredTimeSeries()
  const reportHours = useSelector(selectReportVesselsHours)
  const dataviews = useSelector(selectActiveReportDataviews)
  const summary = useMemo(() => {
    if (!dataviews.length) return
    const datasetTitle = getDatasetTitleByDataview(dataviews?.[0], { showPrivateIcon: false })
    if (reportStatus === AsyncReducerStatus.Finished) {
      // TODO: Support not rendering vesssels count when no report available
      if (reportHours) {
        return t('analysis.summary', {
          defaultValue:
            '<strong>{{vessels}} $t(common.vessel_other)</strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
          vessels: formatI18nNumber(reportVessels || 0, {
            locale: i18n.language as Locale,
          }),
          activityQuantity: formatI18nNumber(Math.floor(reportHours), {
            locale: i18n.language as Locale,
          }),
          activityUnit: t(`common.${activityUnit}`, {
            defaultValue: 'hours',
            count: Math.floor(reportHours),
          }),
          activityType: datasetTitle,
          start: formatI18nDate(timerange?.start),
          end: formatI18nDate(timerange?.end),
        })
      }
    }
    if (!timeseriesLoading && layersTimeseriesFiltered?.[0]) {
      const formattedTimeseries = formatEvolutionData(layersTimeseriesFiltered?.[0])
      const timeseriesHours = sum(formattedTimeseries?.map((t) => sum(t.avg)))
      const timeseriesMaxHours = sum(formattedTimeseries?.map((t) => sum(t.range.map((r) => r[1]))))
      const timeseriesImprecision = ((timeseriesMaxHours - timeseriesHours) / timeseriesHours) * 100
      return t('analysis.summaryNoVessels', {
        defaultValue:
          '<strong>{{activityQuantity}} {{activityUnit}}</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        activityQuantity: `<span title="± ${timeseriesImprecision.toFixed(2)}%">~${formatI18nNumber(
          timeseriesHours.toFixed(),
          {
            locale: i18n.language as Locale,
          }
        )}</span>`,
        activityUnit: t(`common.${activityUnit}`, {
          defaultValue: 'hours',
          count: Math.floor(reportHours),
        }),
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
      })
    }
  }, [
    activityUnit,
    dataviews,
    i18n.language,
    layersTimeseriesFiltered,
    reportHours,
    reportStatus,
    reportVessels,
    t,
    timerange?.end,
    timerange?.start,
    timeseriesLoading,
  ])

  return (
    <div className={styles.container}>
      {summary ? (
        <p className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></p>
      ) : (
        <ReportSummaryPlaceholder />
      )}
      <div className={styles.tagsContainer}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview, index) => (
            <ReportSummaryTags
              key={dataview.id}
              dataview={dataview}
              index={index}
              hiddenProperties={getCommonProperties(dataviews)}
              availableFields={FIELDS}
            />
          ))
        ) : (
          <ReportSummaryTagsPlaceholder />
        )}
      </div>
    </div>
  )
}
