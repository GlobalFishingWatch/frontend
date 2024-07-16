import { useState, useMemo, useTransition } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetStatus, DatasetTypes } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import ActivityFilters, {
  isHistogramDataviewSupported,
} from 'features/workspace/common/LayerFilters'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import {
  SupportedEnvDatasetSchema,
  getSchemaFiltersInDataview,
} from 'features/datasets/datasets.utils'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { isBathymetryDataview } from 'features/dataviews/dataviews.utils'
import { showSchemaFilter } from 'features/workspace/common/LayerSchemaFilter'
import MapLegend from 'features/workspace/common/MapLegend'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoModal from '../common/InfoModal'
import Remove from '../common/Remove'
import Title from '../common/Title'
import OutOfTimerangeDisclaimer from '../common/OutOfBoundsDisclaimer'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function EnvironmentalLayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const [isPending, startTransition] = useTransition()
  const [filterOpen, setFiltersOpen] = useState(false)
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)
  const {
    items,
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    style,
    isSorting,
    activeIndex,
  } = useLayerPanelDataviewSort(dataview.id)

  const datasetFields: { field: SupportedEnvDatasetSchema; label: string }[] = useMemo(
    () => [
      { field: 'type', label: t('layer.type', 'Type') },
      { field: 'flag', label: t('layer.flagState_other', 'Flags') },
      { field: 'vessel_type', label: t('vessel.vesselType_other', 'Vessel types') },
      { field: 'speed', label: t('layer.speed', 'Speed') },
      { field: 'Height', label: t('layer.height', 'Height') },
      { field: 'REALM', label: t('layer.REALM', 'REALM') },
      { field: 'genus', label: t('layer.genus', 'Genus') },
      { field: 'specie', label: t('layer.specie', 'specie') },
      { field: 'period', label: t('layer.period', 'Period') },
      { field: 'scenario', label: t('layer.scenario', 'Scenario') },
    ],
    [t]
  )

  const layerActive = dataview?.config?.visible ?? true

  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setFiltersOpen(false)
  }

  const onToggleFilterOpen = () => {
    if (!filterOpen) {
      startTransition(() => {
        setFiltersOpen(true)
      })
    } else {
      setFiltersOpen(false)
    }
  }

  const dataset = dataview.datasets?.find(
    (d) =>
      d.type === DatasetTypes.Fourwings ||
      d.type === DatasetTypes.Context ||
      d.type === DatasetTypes.UserContext ||
      d.type === DatasetTypes.UserTracks
  )
  const hasLegend = dataset?.type === DatasetTypes.Fourwings

  if (!dataset || dataset.status === 'deleted') {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = getDatasetNameTranslated(dataset)
  const showFilters =
    isHistogramDataviewSupported(dataview) ||
    getSchemaFiltersInDataview(dataview)?.filtersAllowed?.some(showSchemaFilter)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const layerRange = getEnvironmentalDatasetRange(dataset)
  const showMinVisibleFilter =
    dataview.config?.minVisibleValue !== undefined
      ? dataview.config?.minVisibleValue !== layerRange.min
      : false
  const showMaxVisibleFilter =
    dataview.config?.maxVisibleValue !== undefined
      ? dataview.config?.maxVisibleValue !== layerRange.max
      : false
  const hasFilters = dataview.config?.filters && Object.keys(dataview.config?.filters).length > 0
  const showVisibleFilterValues = showMinVisibleFilter || showMaxVisibleFilter || hasFilters

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen || filterOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          active={layerActive}
          disabled={dataset?.status === DatasetStatus.Error}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && showFilters && (
            <ExpandedContainer
              visible={filterOpen}
              onClickOutside={closeExpandedContainer}
              component={
                <ActivityFilters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />
              }
            >
              <div className={styles.filterButtonWrapper}>
                <IconButton
                  icon={filterOpen ? 'filter-on' : 'filter-off'}
                  loading={isPending}
                  size="small"
                  onClick={onToggleFilterOpen}
                  tooltip={
                    filterOpen
                      ? t('layer.filterClose', 'Close filters')
                      : t('layer.filterOpen', 'Open filters')
                  }
                  tooltipPlacement="top"
                />
              </div>
            </ExpandedContainer>
          )}
          {layerActive && !isBathymetryDataview(dataview) && (
            <Color
              dataview={dataview}
              open={colorOpen}
              colorType="fill"
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <InfoModal dataview={dataview} />
          <Remove dataview={dataview} />
          {items.length > 1 && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              className={styles.dragger}
            />
          )}
        </div>
      </div>
      {layerActive && showVisibleFilterValues && (
        <div className={styles.properties}>
          <div className={styles.filters}>
            <div className={styles.filters}>
              <OutOfTimerangeDisclaimer dataview={dataview} />
              {datasetFields.map(({ field, label }) => (
                <DatasetSchemaField key={field} dataview={dataview} field={field} label={label} />
              ))}
              {showVisibleFilterValues && (
                <DatasetSchemaField
                  key={'visibleValues'}
                  dataview={dataview}
                  field={'visibleValues'}
                  label={t('common.visibleValues', 'Visible values')}
                />
              )}
            </div>
          </div>
          {layerActive && hasLegend && (
            <div
              className={cx(styles.drag, {
                [styles.dragging]: isSorting && activeIndex > -1,
              })}
            >
              <MapLegend dataview={dataview} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EnvironmentalLayerPanel
