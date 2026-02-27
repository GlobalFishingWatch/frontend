import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import {
  ColorBar,
  FillColorBarOptions,
  IconButton,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'

import { getSchemaFiltersInDataview } from 'features/datasets/datasets.utils'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectReportActivityGraph } from 'features/reports/reports.config.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import Filters from 'features/workspace/shared/LayerFilters'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectIsWorkspaceOwner } from 'features/workspace/workspace.selectors'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'

import { isTimeComparisonGraph } from '../utils/reports.utils'

import styles from './ReportSummaryTags.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  allowDelete?: boolean
}

export default function ReportSummaryTags({ dataview, allowDelete = false }: LayerPanelProps) {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const selectedReportActivityGraph = useSelector(selectReportActivityGraph)
  const fitAreaInViewport = useFitAreaInViewport()
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwner)
  const showDeprecatedWarning = isWorkspaceOwner && dataview.deprecated

  const [filtersUIOpen, setFiltersUIOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)

  const onToggleFiltersUIOpen = () => {
    setFiltersUIOpen(!filtersUIOpen)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }
  const onColorClick = (color: ColorBarOption) => {
    setColorOpen(false)
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
  }

  const onTagRemoveClick = () => {
    fitAreaInViewport()
  }

  const { filtersAllowed: schemaFiltersAllowed } = getSchemaFiltersInDataview(dataview, {
    vesselGroups: vesselGroupsOptions,
  })
  const filtersAllowed = isVesselGroupReportLocation
    ? schemaFiltersAllowed.filter((filter) => filter.id !== 'vessel-groups')
    : schemaFiltersAllowed

  const hasFilterSelected = filtersAllowed.some((filter) => filter.optionsSelected.length > 0)
  const hasSourceSelected = getSourcesSelectedInDataview(dataview)?.length > 0
  const colorType =
    dataview.config?.type === DataviewType.HeatmapStatic ||
    dataview.config?.type === DataviewType.HeatmapAnimated
      ? 'fill'
      : 'line'

  const showSchemaFilters = filtersAllowed.some(showSchemaFilter)
  const disabledFilters = isTimeComparisonGraph(selectedReportActivityGraph)

  if (
    reportCategory === ReportCategory.Environment &&
    !dataview.config?.minVisibleValue &&
    !dataview.config?.maxVisibleValue
  ) {
    return null
  }

  return (
    <div className={styles.row}>
      <div className={styles.actionsContainer}>
        <ExpandedContainer
          visible={colorOpen}
          onClickOutside={onToggleColorOpen}
          className={styles.expandedContainer}
          referenceClassName={styles.dotReference}
          component={
            <div>
              {<label>{t((t) => t.layer.properties.color)}</label>}
              <ColorBar
                colorBarOptions={colorType === 'line' ? LineColorBarOptions : FillColorBarOptions}
                selectedColor={dataview.config?.color}
                onColorClick={onColorClick}
                swatchesTooltip={t((t) => t.layer.colorSelectPredefined)}
                hueBarTooltip={t((t) => t.layer.colorSelectCustom)}
              />
            </div>
          }
        >
          <button
            onClick={onToggleColorOpen}
            className={cx(styles.dot, styles.pointer)}
            style={{ color: dataview.config?.color }}
          />
        </ExpandedContainer>
        {showSchemaFilters && (
          <ExpandedContainer
            onClickOutside={onToggleFiltersUIOpen}
            visible={filtersUIOpen}
            className={styles.expandedContainer}
            component={<Filters dataview={dataview} onConfirmCallback={onToggleFiltersUIOpen} />}
            disabled={disabledFilters}
          >
            <IconButton
              icon={filtersUIOpen ? 'filter-on' : 'filter-off'}
              size="small"
              onClick={!disabledFilters ? onToggleFiltersUIOpen : undefined}
              className={cx(styles.printHidden, styles.filterButton)}
              tooltip={
                disabledFilters
                  ? t((t) => t.layer.timeGraphFiltersDisabled)
                  : filtersUIOpen
                    ? t((t) => t.layer.filterClose)
                    : t((t) => t.layer.filterOpen)
              }
              tooltipPlacement="top"
              disabled={disabledFilters}
            />
          </ExpandedContainer>
        )}
      </div>
      <Fragment>
        {(reportCategory === ReportCategory.Activity ||
          reportCategory === ReportCategory.Detections ||
          reportCategory === ReportCategory.Events ||
          reportCategory === ReportCategory.Others) && (
          <Fragment>
            <DatasetFilterSource
              dataview={dataview}
              className={styles.tag}
              allowDelete={allowDelete}
              showDeprecatedWarning={showDeprecatedWarning}
            />
            {hasFilterSelected ? (
              filtersAllowed.map(({ id, label }) => (
                <DatasetSchemaField
                  key={id}
                  dataview={dataview}
                  field={id}
                  label={label}
                  className={styles.tag}
                  onRemove={onTagRemoveClick}
                />
              ))
            ) : hasSourceSelected ? null : (
              <label>{t((t) => t.selects.allSelected)}</label>
            )}
          </Fragment>
        )}
        {reportCategory === ReportCategory.Environment ? (
          dataview.config?.minVisibleValue || dataview.config?.maxVisibleValue ? (
            <DatasetSchemaField
              key={'visibleValues'}
              dataview={dataview}
              field={'visibleValues'}
              label={t((t) => t.common.visibleValues)}
              removeType="visibleValues"
            />
          ) : null
        ) : null}
      </Fragment>
    </div>
  )
}
