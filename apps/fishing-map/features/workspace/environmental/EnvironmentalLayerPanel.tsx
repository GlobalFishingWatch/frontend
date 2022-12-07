import { useState, useMemo, useTransition } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetStatus, DatasetTypes } from '@globalfishingwatch/api-types'
import { Tooltip, ColorBarOption, IconButton } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectUserId } from 'features/user/user.selectors'
import { useAutoRefreshImportingDataset } from 'features/datasets/datasets.hook'
import { isGFWUser, isGuestUser } from 'features/user/user.slice'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import ActivityFilters, {
  isHistogramDataviewSupported,
} from 'features/workspace/activity/ActivityFilters'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import { SupportedEnvDatasetSchema } from 'features/datasets/datasets.utils'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import InfoModal from '../common/InfoModal'
import Remove from '../common/Remove'
import Title from '../common/Title'
import { getDatasetNameTranslated } from '../../i18n/utils'
import { getLayerDatasetRange } from './HistogramRangeFilter'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function EnvironmentalLayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const [isPending, startTransition] = useTransition()
  const [filterOpen, setFiltersOpen] = useState(false)
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const userId = useSelector(selectUserId)
  const guestUser = useSelector(isGuestUser)
  const gfwUser = useSelector(isGFWUser)
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
    () => [{ field: 'type', label: t('layer.type', 'Type') }],
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
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.Context
  )
  useAutoRefreshImportingDataset(dataset)
  const isCustomUserLayer = !guestUser && dataset?.ownerId === userId

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = getDatasetNameTranslated(dataset)
  const showFilters = dataset.fieldsAllowed?.length > 0 || isHistogramDataviewSupported(dataview)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const layerRange = getLayerDatasetRange(dataset)
  const showMinVisibleFilter =
    dataview.config?.minVisibleValue !== undefined
      ? dataview.config?.minVisibleValue !== layerRange.min
      : false
  const showMaxVisibleFilter =
    dataview.config?.maxVisibleValue !== undefined
      ? dataview.config?.maxVisibleValue !== layerRange.max
      : false
  const showVisibleFilterValues = showMinVisibleFilter || showMaxVisibleFilter

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
              component={<ActivityFilters dataview={dataview} />}
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
          {layerActive && isCustomUserLayer && (
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
          {(isCustomUserLayer || gfwUser) && <Remove dataview={dataview} />}
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
      {layerActive && (
        <div className={styles.properties}>
          <div className={styles.filters}>
            <div className={styles.filters}>
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
        </div>
      )}
      {layerActive && gfwUser && (
        <div
          className={cx(styles.properties, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
    </div>
  )
}

export default EnvironmentalLayerPanel
