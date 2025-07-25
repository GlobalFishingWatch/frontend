import { useMemo, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetStatus, DatasetTypes } from '@globalfishingwatch/api-types'
import { getEnvironmentalDatasetRange } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDeckLayerLoadedState, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectReadOnly } from 'features/app/selectors/app.selectors'
import type { SupportedEnvDatasetSchema } from 'features/datasets/datasets.utils'
import { getSchemaFiltersInDataview } from 'features/datasets/datasets.utils'
import { isBathymetryDataview } from 'features/dataviews/dataviews.utils'
import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import { useActivityDataviewId } from 'features/map/map-layers.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import ActivityFilters, {
  isHistogramDataviewSupported,
} from 'features/workspace/shared/LayerFilters'
import { showSchemaFilter } from 'features/workspace/shared/LayerSchemaFilter'
import MapLegend from 'features/workspace/shared/MapLegend'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import DatasetNotFound from '../shared/DatasetNotFound'
import InfoModal from '../shared/InfoModal'
import LayerProperties from '../shared/LayerProperties'
import LayerSwitch from '../shared/LayerSwitch'
import OutOfTimerangeDisclaimer from '../shared/OutOfBoundsDisclaimer'
import Remove from '../shared/Remove'
import Title from '../shared/Title'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function EnvironmentalLayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement<any> {
  const [isPending, startTransition] = useTransition()
  const [filterOpen, setFiltersOpen] = useState(false)
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const [colorOpen, setColorOpen] = useState(false)
  const isGFWUser = useSelector(selectIsGFWUser)
  const readOnly = useSelector(selectReadOnly)
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
  const dataviewId = useActivityDataviewId(dataview)
  const activityLayer = useGetDeckLayer<FourwingsLayer>(dataviewId)
  const layerError = activityLayer?.instance?.getError?.()

  const datasetFields: { field: SupportedEnvDatasetSchema; label: string }[] = useMemo(
    () => [
      { field: 'type', label: t('layer.type') },
      { field: 'flag', label: t('layer.flagState_other') },
      { field: 'vessel_type', label: t('vessel.vesselType_other') },
      { field: 'speed', label: t('layer.speed') },
      { field: 'Height', label: t('layer.height') },
      { field: 'REALM', label: t('layer.REALM') },
      { field: 'genus', label: t('layer.genus') },
      { field: 'specie', label: t('layer.specie') },
      { field: 'period', label: t('layer.period') },
      { field: 'scenario', label: t('layer.scenario') },
    ],
    [t]
  )

  const layerActive = dataview?.config?.visible ?? true
  const layerLoaded = useDeckLayerLoadedState()[dataview.id]?.loaded

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
  const showSortHandler = items.length > 1 && !readOnly

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
        <Title
          title={title}
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          onToggle={onToggle}
        />
        <div
          className={cx(
            'print-hidden',
            styles.actions,
            { [styles.active]: layerActive },
            styles.hideUntilHovered
          )}
        >
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
                  tooltip={filterOpen ? t('layer.filterClose') : t('layer.filterOpen')}
                  tooltipPlacement="top"
                />
              </div>
            </ExpandedContainer>
          )}
          {layerActive && !isBathymetryDataview(dataview) && (
            <LayerProperties
              dataview={dataview}
              open={colorOpen}
              colorType="fill"
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          <InfoModal dataview={dataview} />
          {!readOnly && (
            <Remove dataview={dataview} loading={!showSortHandler && layerActive && !layerLoaded} />
          )}
          {showSortHandler && (
            <IconButton
              size="small"
              ref={setActivatorNodeRef}
              {...listeners}
              icon="drag"
              loading={layerActive && !layerLoaded}
              className={styles.dragger}
            />
          )}
          {!readOnly && layerError && (
            <IconButton
              icon={'warning'}
              type={'warning'}
              tooltip={
                isGFWUser ? `${t('errors.layerLoading')} (${layerError})` : t('errors.layerLoading')
              }
              size="small"
            />
          )}
        </div>
        <IconButton
          icon={layerError ? 'warning' : layerActive ? 'more' : undefined}
          type={layerError ? 'warning' : 'default'}
          loading={layerActive && !layerLoaded}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
      </div>
      {layerActive && (
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
                  label={t('common.visibleValues')}
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
