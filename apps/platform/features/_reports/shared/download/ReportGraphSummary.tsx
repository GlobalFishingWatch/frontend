import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { selectReportComparisonDataviews } from 'features/_map/dataviews/selectors/dataviews.categories.selectors'
import { groupVmsSources } from 'features/_map/workspace/activity/activity.utils'
import { selectReportAreaName } from 'features/_reports/report-area/area-reports.selectors'
import { selectVGRData } from 'features/_reports/report-vessel-group/vessel-group-report.slice'
import { REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON } from 'features/_reports/reports.config'
import {
  selectReportActivityGraph,
  selectReportComparisonDataviewIds,
} from 'features/_reports/reports.config.selectors'
import { selectReportCategory, selectReportSubCategory } from 'features/_reports/reports.selectors'
import { ReportCategory } from 'features/_reports/reports.types'
import { useReportActivitySummaryData } from 'features/_reports/shared/summary/report-summary-activity.hooks'
import ReportSummaryEvents from 'features/_reports/shared/summary/ReportSummaryEvents'
import {
  selectReportVesselGroupFlags,
  selectReportVesselGroupTimeRange,
} from 'features/_reports/shared/vessels/report-vessels.selectors'
import { getReportSubCategoryLabel } from 'features/_reports/tabs/activity/reports-activity.utils'
import { getVesselGroupVesselsCount } from 'features/_user/vessel-groups/vessel-groups.utils'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import { htmlSafeParse } from 'utils/html-parser'
import { listAsSentence } from 'utils/shared'

import styles from './ReportGraphScreenshot.module.css'

type ReportGraphSummaryProps = {
  vesselsFiltered?: boolean
  hideSources?: boolean
}

function ReportGraphSummaryActivity({ vesselsFiltered, hideSources }: ReportGraphSummaryProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const areaName = useSelector(selectReportAreaName)
  const summary = useReportActivitySummaryData({ vesselsFiltered })

  if (!summary) return null
  if (summary.type === 'timeCompare') return htmlSafeParse(summary.description)

  const area = summary.isGlobalReport
    ? t((t) => t.analysis.globally)
    : areaName
      ? t((t) => t.analysis.inNamedArea, { area: areaName })
      : t((t) => t.analysis.inTheArea)
  const activityType =
    summary.datasetTitle ??
    (reportSubCategory
      ? `<strong>${getReportSubCategoryLabel(reportSubCategory).toLowerCase()}</strong>`
      : summary.isActivity
        ? `<strong>${t((t) => t.common.activity).toLowerCase()}</strong>`
        : '')
  const unit = t(
    (t) => t.common[reportCategory === ReportCategory.Activity ? 'hour' : 'detection'],
    {
      count: summary.count,
    }
  )

  if (summary.type === 'vessels') {
    const groupedSources = groupVmsSources(
      summary.sources.map((label) => ({ id: label, label })),
      { inline: true }
    ).map(({ label }) => label)
    // Filtered vessels don't keep their activity dataset, so their sources are unknown
    const sources =
      hideSources || vesselsFiltered ? [] : groupedSources.length ? groupedSources : summary.sources
    return htmlSafeParse(
      t((t) => t.analysis.summary, {
        vessels: summary.vessels,
        activityQuantity: summary.quantity,
        activityUnit: unit,
        activityType,
        area,
        start: summary.start,
        end: summary.end,
        sources: sources.length ? ` (${listAsSentence(sources)})` : '',
      })
    )
  }

  return htmlSafeParse(
    t((t) => t.analysis.summaryNoVessels, {
      activityQuantity: summary.quantity,
      activityUnit: summary.isActivity
        ? `<strong>${unit}</strong> ${summary.imprecision ? `± ${summary.imprecision}% ` : ''}${t((t) => t.common.of)}`
        : '',
      activityType,
      area,
      start: summary.start,
      end: summary.end,
    })
  )
}

/** Same sentence as the vessel group report title, with the group name instead of "This group" */
function ReportGraphSummaryVesselGroup() {
  const { t } = useTranslation()
  const vesselGroup = useSelector(selectVGRData)
  const timeRange = useSelector(selectReportVesselGroupTimeRange)
  const flags = useSelector(selectReportVesselGroupFlags)

  if (!vesselGroup || !timeRange) return null
  return htmlSafeParse(
    t((t) => t.vesselGroup.summaryNamed, {
      name: vesselGroup.name,
      vessels: formatI18nNumber(getVesselGroupVesselsCount(vesselGroup)) as string,
      flags: String(flags?.size ?? 0),
      start: formatI18nDate(timeRange.start, { format: DateTime.DATE_MED }),
      end: formatI18nDate(timeRange.end, { format: DateTime.DATE_MED }),
    })
  )
}

/** " in <area name>", to append to the summary of graphs not built from the report layers */
export function ReportGraphSummaryArea() {
  const { t } = useTranslation()
  const areaName = useSelector(selectReportAreaName)
  if (!areaName) return null
  return <Fragment> {htmlSafeParse(t((t) => t.analysis.inNamedArea, { area: areaName }))}</Fragment>
}

/** " compared with <dataset>", when the graph compares the report layer with another dataset */
export function ReportGraphSummaryComparison() {
  const { t } = useTranslation()
  const reportActivityGraph = useSelector(selectReportActivityGraph)
  const comparisonDataviewIds = useSelector(selectReportComparisonDataviewIds)
  const comparisonDataviews = useSelector(selectReportComparisonDataviews)
  const comparedDataview =
    reportActivityGraph === REPORT_ACTIVITY_GRAPH_DATASET_COMPARISON
      ? comparisonDataviews.find(({ id }) => id === comparisonDataviewIds?.compare)
      : undefined
  if (!comparedDataview) return null
  return (
    <Fragment>
      {' '}
      {htmlSafeParse(
        t((t) => t.analysis.comparedWith, {
          dataset: getDatasetTitleByDataview(comparedDataview, { showPrivateIcon: false }),
        })
      )}
    </Fragment>
  )
}

/** What, where and when the report shows, as one sentence for graph screenshots */
function ReportGraphSummary(props: ReportGraphSummaryProps) {
  const reportCategory = useSelector(selectReportCategory)
  const areaName = useSelector(selectReportAreaName)

  return (
    <p className={styles.summary}>
      {reportCategory === ReportCategory.VesselGroup ? (
        <ReportGraphSummaryVesselGroup />
      ) : reportCategory === ReportCategory.Events ? (
        <ReportSummaryEvents areaName={areaName} />
      ) : (
        <Fragment>
          <ReportGraphSummaryActivity {...props} />
          <ReportGraphSummaryComparison />
        </Fragment>
      )}
    </p>
  )
}

export default ReportGraphSummary
