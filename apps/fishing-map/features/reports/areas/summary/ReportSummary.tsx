import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { sum } from 'es-toolkit'
import { Fragment, useMemo } from 'react'
import parse from 'html-react-parser'
import Sticky from 'react-sticky-el'
import { Locale } from '@globalfishingwatch/api-types'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import ReportSummaryTags from 'features/reports/areas/summary/ReportSummaryTags'
import { FIELDS, getCommonProperties } from 'features/reports/areas/reports.utils'
import { ReportActivityUnit } from 'features/reports/areas/Report'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import {
  useReportFilteredTimeSeries,
  useReportFeaturesLoading,
} from 'features/reports/activity/reports-activity-timeseries.hooks'
import { formatEvolutionData } from 'features/reports/activity/reports-activity-timeseries.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import ReportSummaryPlaceholder from 'features/reports/areas/placeholders/ReportSummaryPlaceholder'
import ReportSummaryTagsPlaceholder from 'features/reports/areas/placeholders/ReportSummaryTagsPlaceholder'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { listAsSentence } from 'utils/shared'
import {
  getDateRangeHash,
  selectReportVesselsDateRangeHash,
} from 'features/reports/areas/report.slice'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { useTimeCompareTimeDescription } from 'features/reports/activity/reports-activity-timecomparison.hooks'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import {
  selectReportVesselsHours,
  selectReportVesselsNumber,
} from 'features/reports/activity/vessels/report-activity-vessels.selectors'
import { selectReportTimeComparison } from '../reports.config.selectors'
import { ReportCategory } from '../reports.types'
import styles from './ReportSummary.module.css'

type ReportSummaryProps = {
  activityUnit: ReportActivityUnit
  reportStatus: AsyncReducerStatus
}

export const PROPERTIES_EXCLUDED = ['flag', 'geartype']

export default function ReportSummary({ activityUnit, reportStatus }: ReportSummaryProps) {
  const { t, i18n } = useTranslation()
  const timerange = useSelector(selectTimeRange)
  const category = useSelector(selectReportCategory)
  const reportVessels = useSelector(selectReportVesselsNumber)
  const reportTimeComparison = useSelector(selectReportTimeComparison)
  const timeseriesLoading = useReportFeaturesLoading()
  const layersTimeseriesFiltered = useReportFilteredTimeSeries()
  const reportHours = useSelector(selectReportVesselsHours) as number
  const dataviews = useSelector(selectActiveReportDataviews)
  const reportDateRangeHash = useSelector(selectReportVesselsDateRangeHash)
  const reportOutdated = reportDateRangeHash !== getDateRangeHash(timerange)
  const timeCompareTimeDescription = useTimeCompareTimeDescription()

  const commonProperties = useMemo(() => {
    return getCommonProperties(dataviews).filter(
      (property) =>
        !dataviews[0].config?.filters!?.[property] || !PROPERTIES_EXCLUDED.includes(property)
    )
  }, [dataviews])

  const summary = useMemo(() => {
    if (!dataviews.length) return
    if (timeCompareTimeDescription) {
      return timeCompareTimeDescription
    }
    const datasetTitles = dataviews?.map((dataview) =>
      getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
    )
    const sameTitleDataviews = datasetTitles.every((d) => d === datasetTitles?.[0])
    const datasetTitle = sameTitleDataviews
      ? datasetTitles?.[0]
      : category === ReportCategory.Fishing || category === ReportCategory.Presence
      ? `${t('common.of', 'of')} <strong>${t(`common.activity`, 'Activity').toLowerCase()}</strong>`
      : undefined

    if (
      reportHours &&
      reportStatus === AsyncReducerStatus.Finished &&
      category !== ReportCategory.Detections &&
      !reportOutdated
    ) {
      return t('analysis.summary', {
        defaultValue:
          '<strong>{{vessels}} vessels{{sources}} </strong> had <strong>{{activityQuantity}} {{activityUnit}}</strong> of <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
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
        sources: commonProperties.includes('source')
          ? ` (${listAsSentence(
              getSourcesSelectedInDataview(dataviews[0]).map((source) => source.label)
            )})`
          : '',
      })
    }
    if (
      (!timeseriesLoading && layersTimeseriesFiltered?.[0]) ||
      (category === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours)
    ) {
      const formattedTimeseries = formatEvolutionData(layersTimeseriesFiltered!?.[0])
      const timeseriesHours = sum(formattedTimeseries?.map((t) => sum(t.avg)) || [])
      const timeseriesMaxHours = sum(
        formattedTimeseries?.map((t) => sum(t.range.map((r) => r[1]))) || []
      )
      const timeseriesImprecision = ((timeseriesMaxHours - timeseriesHours) / timeseriesHours) * 100
      let activityQuantity =
        !timeseriesLoading && layersTimeseriesFiltered?.[0]
          ? `<span>${formatI18nNumber(timeseriesHours.toFixed(), {
              locale: i18n.language as Locale,
            })}</span>`
          : ''
      if (
        category === ReportCategory.Detections &&
        reportStatus === AsyncReducerStatus.Finished &&
        reportHours
      ) {
        activityQuantity = formatI18nNumber(Math.floor(reportHours), {
          locale: i18n.language as Locale,
        }) as string
      }
      const activityUnitLabel =
        category === ReportCategory.Detections
          ? t('common.detection', { defaultValue: 'detections', count: Math.floor(reportHours) })
          : `<strong>${t(`common.${activityUnit}`, {
              defaultValue: 'hours',
              count: Math.floor(reportHours),
            })}</strong> ${
              Math.round(timeseriesImprecision) ? `± ${Math.round(timeseriesImprecision)}% ` : ''
            }${t('common.of', 'of')}`

      return t('analysis.summaryNoVessels', {
        defaultValue:
          '<strong>{{sources}} {{activityQuantity}}</strong> {{activityUnit}} <strong>{{activityType}}</strong> in the area between <strong>{{start}}</strong> and <strong>{{end}}</strong>',
        activityQuantity,
        activityUnit: activityUnitLabel,
        activityType: datasetTitle,
        start: formatI18nDate(timerange?.start),
        end: formatI18nDate(timerange?.end),
        sources: commonProperties.includes('source')
          ? `(${listAsSentence(
              getSourcesSelectedInDataview(dataviews[0]).map((source) => source.label)
            )}) `
          : '',
      })
    }
  }, [
    dataviews,
    category,
    t,
    reportHours,
    reportStatus,
    reportOutdated,
    timeseriesLoading,
    layersTimeseriesFiltered,
    reportVessels,
    i18n.language,
    activityUnit,
    timerange?.start,
    timerange?.end,
    commonProperties,
    timeCompareTimeDescription,
  ])

  return (
    <Fragment>
      <div className={styles.summaryContainer}>
        {summary ? (
          <p className={styles.summary}>{parse(summary)}</p>
        ) : (
          <ReportSummaryPlaceholder />
        )}
      </div>
      {summary ? (
        <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
          {dataviews?.length > 1 && (
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
          )}
        </Sticky>
      ) : reportTimeComparison ? null : (
        <div className={styles.tagsContainer}>
          <ReportSummaryTagsPlaceholder />
        </div>
      )}
    </Fragment>
  )
}
