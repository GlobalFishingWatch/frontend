import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { getFiltersInDataview } from 'features/_map/dataviews/dataviews.filters'
import { dataviewWithPrivateDatasets } from 'features/_map/dataviews/dataviews.utils'
import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import {
  getSourcesSelectedInDataview,
  groupVmsSources,
} from 'features/_map/workspace/activity/activity.utils'
import { selectReportVesselsFiltered } from 'features/_reports/shared/vessels/report-vessels.selectors'
import { useVesselGroupsOptions } from 'features/_user/vessel-groups/vessel-groups.hooks'

import styles from './ReportGraphScreenshot.module.css'

function ReportGraphLegendItem({ dataview }: { dataview: UrlDataviewInstance }) {
  const { t } = useTranslation()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const sourcesSelected = getSourcesSelectedInDataview(dataview)
  const groupedSources = dataviewWithPrivateDatasets(dataview)
    ? []
    : groupVmsSources(sourcesSelected)
  const sources = (groupedSources.length ? groupedSources : sourcesSelected)
    .map(({ label }) => label)
    .join(', ')
  const { filtersAllowed } = getFiltersInDataview(dataview, { vesselGroups: vesselGroupsOptions })
  const filters = filtersAllowed
    .filter(({ optionsSelected }) => optionsSelected.length > 0)
    .map(({ label, optionsSelected }) => {
      // Range filters come as [[min], [max]] pairs
      const values = optionsSelected.map((option: any) =>
        Array.isArray(option) ? option.map(({ label }) => label).join('-') : option.label
      )
      return `${label}: ${values.join(', ')}`
    })

  return (
    <li className={styles.legendItem}>
      <span className={styles.dot} style={{ color: dataview.config?.color }} />
      {[sources && `${t((t) => t.layer.source)}: ${sources}`, ...filters]
        .filter(Boolean)
        .join('  -  ')}
    </li>
  )
}

function ReportGraphLegend() {
  const allDataviews = useSelector(selectActiveReportDataviews)
  const vessels = useSelector(selectReportVesselsFiltered)
  const dataviewIdsWithVessels = vessels && new Set(vessels.map((vessel) => vessel.dataviewId))
  const dataviews = dataviewIdsWithVessels
    ? allDataviews.filter((dataview) => dataviewIdsWithVessels.has(dataview.id))
    : allDataviews

  return (
    <ul className={styles.legend}>
      {dataviews.map((dataview) => (
        <ReportGraphLegendItem key={dataview.id} dataview={dataview} />
      ))}
    </ul>
  )
}

export default ReportGraphLegend
