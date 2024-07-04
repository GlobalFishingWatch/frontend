import { useState, useCallback, Fragment, useEffect } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import parse from 'html-react-parser'
import { DatasetTypes, DatasetStatus, Dataset, DataviewType } from '@globalfishingwatch/api-types'
import {
  Tooltip,
  ColorBarOption,
  Modal,
  IconButton,
  Collapsable,
} from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { ContextLayer, ContextPickingObject } from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { selectUserId } from 'features/user/selectors/user.permissions.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAddDataset } from 'features/datasets/datasets.hook'
import { selectIsGFWUser, selectIsGuestUser } from 'features/user/selectors/user.selectors'
import DatasetLoginRequired from 'features/workspace/shared/DatasetLoginRequired'
import { useLayerPanelDataviewSort } from 'features/workspace/shared/layer-panel-sort.hook'
import GFWOnly from 'features/user/GFWOnly'
import { ROOT_DOM_ELEMENT } from 'data/config'
import {
  BASEMAP_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  ONLY_GFW_STAFF_DATAVIEW_SLUGS,
  PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
  HIDDEN_DATAVIEW_FILTERS,
} from 'data/workspaces'
import { selectBasemapLabelsDataviewInstance } from 'features/dataviews/selectors/dataviews.selectors'
import {
  CONTEXT_FEATURES_LIMIT,
  filterFeaturesByDistance,
  parseContextFeatures,
} from 'features/workspace/context-areas/context.utils'
import { ReportPopupLink } from 'features/map/popups/categories/ContextLayersRow'
import { useContextInteractions } from 'features/map/popups/categories/ContextLayers.hooks'
import {
  getDatasetLabel,
  getSchemaFiltersInDataview,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID } from 'data/layer-library/layers-context'
import DatasetNotFound from '../shared/DatasetNotFound'
import Color from '../common/Color'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import Filters from '../common/LayerFilters'
import InfoModal from '../common/InfoModal'
import ExpandedContainer from '../shared/ExpandedContainer'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import { showSchemaFilter } from '../common/LayerSchemaFilter'
import OutOfTimerangeDisclaimer from '../common/OutOfBoundsDisclaimer'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

export const DATAVIEWS_WARNING = [
  EEZ_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  BASEMAP_DATAVIEW_INSTANCE_ID,
  PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
]
const LIST_ELEMENT_HEIGHT = 30
const LIST_ELLIPSIS_HEIGHT = 14
const LIST_MARGIN_HEIGHT = 10
const LIST_TITLE_HEIGHT = 22

type FeaturesOnScreen = { total: number; closest: ContextPickingObject[] }
function LayerPanel({ dataview, onToggle }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { onReportClick } = useContextInteractions()
  const [filterOpen, setFiltersOpen] = useState(false)
  const [areasOnScreenOpen, setAreasOnScreenOpen] = useState(false)
  const [featuresOnScreen, setFeaturesOnScreen] = useState<FeaturesOnScreen>({
    total: 0,
    closest: [],
  })

  const contextLayer = useGetDeckLayer<ContextLayer>(dataview.id)
  const [colorOpen, setColorOpen] = useState(false)
  const gfwUser = useSelector(selectIsGFWUser)
  const userId = useSelector(selectUserId)
  const [modalDataWarningOpen, setModalDataWarningOpen] = useState(false)
  const onDataWarningModalClose = useCallback(() => {
    setModalDataWarningOpen(false)
  }, [setModalDataWarningOpen])
  const guestUser = useSelector(selectIsGuestUser)
  const viewport = useSelector(selectViewport)
  const onAddNewClick = useAddDataset({})
  const layerActive = dataview?.config?.visible ?? true
  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Context || d.type === DatasetTypes.UserContext
  )

  const layerLoaded = contextLayer?.loaded
  useEffect(() => {
    const updateFeaturesOnScreen = async () => {
      const features = contextLayer?.instance?.getRenderedFeatures()
      if (features?.length) {
        const filteredFeatures = await filterFeaturesByDistance(features, {
          viewport,
        })
        setFeaturesOnScreen({
          total: features.length,
          // TODO:deck double check this is not needed anymore as the features are already parsed in the deck getPickingInfo
          closest: parseContextFeatures(filteredFeatures, dataset as Dataset),
        })
      }
    }
    if (
      areasOnScreenOpen &&
      layerActive &&
      layerLoaded &&
      DataviewType.Context === dataview.config?.type
    ) {
      updateFeaturesOnScreen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, layerActive, layerLoaded, viewport, areasOnScreenOpen])

  const listHeight = Math.min(featuresOnScreen?.total, CONTEXT_FEATURES_LIMIT) * LIST_ELEMENT_HEIGHT
  const ellispsisHeight =
    featuresOnScreen?.total > CONTEXT_FEATURES_LIMIT ? LIST_ELLIPSIS_HEIGHT : 0
  const closestAreasHeight = featuresOnScreen?.total
    ? listHeight + ellispsisHeight + LIST_TITLE_HEIGHT + LIST_MARGIN_HEIGHT
    : 40

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

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
  }

  const onToggleAreasOnScreenOpen = useCallback(() => {
    setAreasOnScreenOpen(!areasOnScreenOpen)
  }, [areasOnScreenOpen])

  const closeExpandedContainer = () => {
    setFiltersOpen(false)
    setColorOpen(false)
  }

  const isUserLayer = !guestUser && dataset?.ownerId === userId

  const basemapLabelsDataviewInstance = useSelector(selectBasemapLabelsDataviewInstance)
  if (!dataset && dataview.id !== basemapLabelsDataviewInstance.id) {
    const dataviewHasPrivateDataset = dataview.datasetsConfig?.some((d) =>
      isPrivateDataset({ id: d.datasetId })
    )
    return guestUser && dataviewHasPrivateDataset ? (
      <DatasetLoginRequired dataview={dataview} />
    ) : (
      <DatasetNotFound dataview={dataview} />
    )
  }

  const title = dataset
    ? getDatasetLabel(dataset)
    : t(`dataview.${dataview?.id}.title` as any, dataview?.name || dataview?.id)

  const TitleComponent = (
    <Title
      title={title}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onToggle}
    />
  )

  const isBasemapLabelsDataview = dataview.config?.type === DataviewType.BasemapLabels
  const isContextAreaDataview =
    dataview.config?.type === DataviewType.Context ||
    dataview.config?.type === DataviewType.UserContext
  const { filtersAllowed } = getSchemaFiltersInDataview(dataview)
  const hasSchemaFilters = filtersAllowed.some(showSchemaFilter)
  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )

  const highlightArea = (feature?: ContextPickingObject) => {
    contextLayer?.instance?.setHighlightedFeatures(feature ? [feature] : [])
  }

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: filterOpen || colorOpen,
        'print-hidden': !layerActive,
      })}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          disabled={dataset?.status === DatasetStatus.Error}
          active={layerActive}
          className={styles.switch}
          dataview={dataview}
          onToggle={onToggle}
          testId={`context-layer-${dataview.id}`}
        />
        {ONLY_GFW_STAFF_DATAVIEW_SLUGS.includes(dataview.dataviewId as string) && (
          <GFWOnly type="only-icon" style={{ transform: 'none' }} className={styles.gfwIcon} />
        )}
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          {layerActive && !isBasemapLabelsDataview && (
            <Color
              dataview={dataview}
              open={colorOpen}
              onColorClick={changeColor}
              onToggleClick={onToggleColorOpen}
              onClickOutside={closeExpandedContainer}
            />
          )}
          {layerActive &&
            hasSchemaFilters &&
            !HIDDEN_DATAVIEW_FILTERS.includes(dataview.dataviewId as string) && (
              <ExpandedContainer
                visible={filterOpen}
                onClickOutside={closeExpandedContainer}
                component={<Filters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />}
              >
                <div className={styles.filterButtonWrapper}>
                  <IconButton
                    icon={filterOpen ? 'filter-on' : 'filter-off'}
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
          {!isBasemapLabelsDataview && <InfoModal dataview={dataview} />}
          {(isUserLayer || gfwUser) && <Remove dataview={dataview} />}
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
      {layerActive && dataview.id.includes(OFFSHORE_FIXED_INFRASTRUCTURE_DATAVIEW_ID) && (
        <OutOfTimerangeDisclaimer
          className={cx(styles.properties, styles.filters)}
          dataview={dataview}
          validate="start"
        />
      )}
      {layerActive && (DATAVIEWS_WARNING.includes(dataview?.id) || hasSchemaFilterSelection) && (
        <div
          className={cx(styles.properties, styles.dataWarning, styles.drag, {
            [styles.dragging]: isSorting && activeIndex > -1,
          })}
        >
          {DATAVIEWS_WARNING.includes(dataview?.id) && (
            <Fragment>
              <div>
                {t(
                  `dataview.${dataview?.id}.dataWarning` as any,
                  'This platform uses a reference layer from an external source.'
                )}
              </div>
              <div className={cx('print-hidden', styles.dataWarningLinks)}>
                <button onClick={onAddNewClick}>
                  {t('dataset.uploadYourOwn', 'Upload your own')}
                </button>{' '}
                |{' '}
                <button onClick={() => setModalDataWarningOpen(!modalDataWarningOpen)}>
                  {t('common.learnMore', 'Learn more')}
                </button>
                <Modal
                  appSelector={ROOT_DOM_ELEMENT}
                  title={title}
                  isOpen={modalDataWarningOpen}
                  onClose={onDataWarningModalClose}
                  contentClassName={styles.modalContent}
                >
                  {parse(
                    t(
                      `dataview.${dataview?.id}.dataWarningDetail` as any,
                      'This platform uses reference layers (shapefiles) from an external source. The designations employed and the presentation of the material on this platform do not imply the expression of any opinion whatsoever on the part of Global Fishing Watch concerning the legal status of any country, territory, city or area or of its authorities, or concerning the delimitation of its frontiers or boundaries. Should you consider these reference layers not applicable for your purposes, this platform allows custom reference layers to be uploaded. Draw or upload your own reference layer using the "+" icon in the left sidebar. Learn more on our <a href="https://globalfishingwatch.org/tutorials/">tutorials</a> and <a href="https://globalfishingwatch.org/help-faqs/">FAQs</a>.'
                    )
                  )}
                </Modal>
              </div>
            </Fragment>
          )}
          {hasSchemaFilterSelection && (
            <div className={styles.filters}>
              <div className={styles.filters}>
                {filtersAllowed.map(({ id, label }) => (
                  <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {layerActive && isContextAreaDataview && layerLoaded && (
        <div
          className={cx(styles.closestAreas, styles.properties, 'print-hidden')}
          style={{ maxHeight: closestAreasHeight }}
        >
          <Collapsable
            label={`${t('layer.areasOnScreen', 'Areas on screen')} ${
              areasOnScreenOpen ? `(${featuresOnScreen?.total})` : ''
            }`}
            open={areasOnScreenOpen}
            onToggle={onToggleAreasOnScreenOpen}
            className={styles.areasOnScreen}
          >
            <ul>
              {featuresOnScreen?.total > 0 &&
                featuresOnScreen.closest.map((feature) => {
                  const id = feature?.id || feature?.properties!.id
                  let title = feature.value || feature.properties.name || feature.properties.id
                  if (dataset?.configuration?.valueProperties?.length) {
                    title = dataset.configuration.valueProperties
                      .flatMap((prop) => feature.properties[prop] || [])
                      .join(', ')
                  }
                  return (
                    <li
                      key={`${id}-${title}`}
                      className={styles.area}
                      onMouseEnter={() => highlightArea(feature)}
                      onMouseLeave={() => highlightArea(undefined)}
                    >
                      <span
                        title={title.length > 40 ? title : undefined}
                        className={styles.areaTitle}
                      >
                        {title}
                      </span>
                      <ReportPopupLink feature={feature} onClick={onReportClick}></ReportPopupLink>
                    </li>
                  )
                })}
              {featuresOnScreen?.total > CONTEXT_FEATURES_LIMIT && (
                <li className={cx(styles.area, styles.ellipsis)}>...</li>
              )}
            </ul>
          </Collapsable>
        </div>
      )}
    </div>
  )
}

export default LayerPanel
