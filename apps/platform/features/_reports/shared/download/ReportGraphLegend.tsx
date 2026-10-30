import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { DATASETS_USER_SOURCE_ID } from 'features/_map/datasets/datasets.slice'
import { getDatasetTitleByDataview } from 'features/_map/datasets/datasets.utils'
import { getFiltersInDataview } from 'features/_map/dataviews/dataviews.filters'
import { dataviewWithPrivateDatasets } from 'features/_map/dataviews/dataviews.utils'
import { selectActiveReportDataviews } from 'features/_map/dataviews/selectors/dataviews.selectors'
import {
  getSourcesSelectedInDataview,
  groupVmsSources,
} from 'features/_map/workspace/activity/activity.utils'
import { selectVGRData } from 'features/_reports/report-vessel-group/vessel-group-report.slice'
import { selectReportVesselsFiltered } from 'features/_reports/shared/vessels/report-vessels.selectors'
import { useVesselGroupsOptions } from 'features/_user/vessel-groups/vessel-groups.hooks'
import { selectIsVesselGroupReportLocation } from 'router/routes.selectors'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ReportGraphScreenshot.module.css'

function ReportGraphLegendItem({
  dataview,
  vesselGroupName,
  withTitle,
}: {
  dataview: UrlDataviewInstance
  vesselGroupName?: string
  withTitle?: boolean
}) {
  const { t } = useTranslation()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const sourcesSelected = getSourcesSelectedInDataview(dataview)
  const groupedSources = dataviewWithPrivateDatasets(dataview)
    ? []
    : groupVmsSources(sourcesSelected)
  // Layers outside the activity ones list their datasets as sources, so the provider says more
  const datasetSource = dataview.datasets?.find(
    ({ source }) => source && source !== DATASETS_USER_SOURCE_ID
  )?.source
  const sources = withTitle
    ? datasetSource && htmlSafeParse(datasetSource)
    : (groupedSources.length ? groupedSources : sourcesSelected)
        .map(({ label }) => label)
        .join(', ')
  const { filtersAllowed } = getFiltersInDataview(dataview, { vesselGroups: vesselGroupsOptions })
  const filters = filtersAllowed
    .filter(({ optionsSelected }) => optionsSelected.length > 0)
    .filter(({ id }) => !(vesselGroupName && id === 'vessel-groups'))
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
      <span>
        {[
          withTitle && getDatasetTitleByDataview(dataview, { showPrivateIcon: false }),
          sources && (
            <Fragment>
              {t((t) => t.layer.source)}: {sources}
            </Fragment>
          ),
          vesselGroupName && `${t((t) => t.vesselGroup.vesselGroup)}: ${vesselGroupName}`,
          ...filters,
        ]
          .filter(Boolean)
          .map((item, index) => (
            <Fragment key={index}>
              {index > 0 && '  -  '}
              {item}
            </Fragment>
          ))}
      </span>
    </li>
  )
}

function ReportGraphLegend({ dataviews: dataviewsProp }: { dataviews?: UrlDataviewInstance[] }) {
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const vesselGroup = useSelector(selectVGRData)
  const allDataviews = useSelector(selectActiveReportDataviews)
  const vessels = useSelector(selectReportVesselsFiltered)
  const dataviewIdsWithVessels = vessels && new Set(vessels.map((vessel) => vessel.dataviewId))
  const dataviews = dataviewsProp
    ? dataviewsProp
    : dataviewIdsWithVessels
      ? allDataviews.filter((dataview) => dataviewIdsWithVessels.has(dataview.id))
      : allDataviews

  return (
    <ul className={styles.legendItems}>
      {dataviews.map((dataview) => (
        <ReportGraphLegendItem
          key={dataview.id}
          dataview={dataview}
          vesselGroupName={isVesselGroupReportLocation ? vesselGroup?.name : undefined}
          // Graphs passing their own layers have no sources, the name tells them apart
          withTitle={dataviewsProp !== undefined}
        />
      ))}
    </ul>
  )
}

export default ReportGraphLegend
