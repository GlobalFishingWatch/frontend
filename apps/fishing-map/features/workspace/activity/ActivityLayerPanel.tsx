import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton } from '@globalfishingwatch/ui-components'

import { SAR_DATAVIEW_SLUG } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/selectors/app.selectors'
import { TURNING_TIDES_DESCRIPTION_PREFIX } from 'features/bigquery/turning-tides.config'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { getFiltersInDataview } from 'features/dataviews/dataviews.filters'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import Hint from 'features/help/Hint'
import { selectHintsDismissed, setHintDismissed } from 'features/help/hints.slice'
import { useActivityDataviewId } from 'features/map/map-layers.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import ActivityAuxiliaryLayerPanel from 'features/workspace/activity/ActivityAuxiliaryLayer'
import TurningTidesTags from 'features/workspace/activity/TurningTidesTags'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import LayerProperties from 'features/workspace/shared/LayerProperties'
import MapLegend from 'features/workspace/shared/MapLegend'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectIsTurningTidesWorkspace } from 'features/workspace/workspace.selectors'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'

import DatasetSchemaField from '../shared/DatasetSchemaField'
import DatasetFilterSource from '../shared/DatasetSourceField'
import InfoModal from '../shared/InfoModal'
import LayerFilters from '../shared/LayerFilters'
import LayerSwitch from '../shared/LayerSwitch'
import OutOfTimerangeDisclaimer from '../shared/OutOfBoundsDisclaimer'
import Remove from '../shared/Remove'
import Title from '../shared/Title'

import { isDefaultActivityDataview, isDefaultDetectionsDataview } from './activity.utils'
import TurningTidesFilters from './TurningTidesFilters'

import activityStyles from './ActivitySection.module.css'
import { replaceQueryParams } from 'routes/routes.actions'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type LayerPanelProps = {
  isOpen: boolean
  showBorder: boolean
  dataview: UrlDataviewInstance
  onToggle?: () => void
}

function ActivityLayerPanel({
  dataview,
  showBorder,
  isOpen,
  onToggle,
}: LayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [filterOpen, setFiltersOpen] = useState(isOpen === undefined ? false : isOpen)
  const [colorOpen, setColorOpen] = useState(false)

  const { deleteDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const isGFWUser = useSelector(selectIsGFWUser)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const hintsDismissed = useSelector(selectHintsDismissed)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
  const isTurningTidesWorkspace = useSelector(selectIsTurningTidesWorkspace)
  const readOnly = useSelector(selectReadOnly)
  const layerActive = dataview?.config?.visible ?? true
  const dataviewId = useActivityDataviewId(dataview)
  const activityLayer = useGetDeckLayer<FourwingsLayer>(dataviewId)
  const layerLoaded = activityLayer?.loaded
  const layerError = activityLayer?.instance?.getError?.()

  // TODO remove when final decission on stats display is taken
  // const urlTimeRange = useSelector(selectUrlTimeRange)
  // const guestUser = useSelector(selectIsGuestUser)
  // const datasetStatsFields = dataview.datasets!?.flatMap((d) =>
  //   Object.entries(d.schema || {}).flatMap(([id, schema]) =>
  //     (schema as DatasetSchemaItem).stats ? id.toUpperCase() : []
  //   )
  // )
  // const fields = datasetStatsFields?.length > 0 ? datasetStatsFields : DEFAULT_STATS_FIELDS
  // const { data: stats, isFetching } = useGetStatsByDataviewQuery(
  //   {
  //     dataview,
  //     timerange: urlTimeRange as any,
  //     fields: fields as any,
  //   },
  //   {
  //     skip: guestUser || !urlTimeRange || !layerActive,
  //   }
  // )
  // const statsValue = stats && (stats.vesselIds || stats.id)
  const disableBivariate = () => {
    replaceQueryParams({ bivariateDataviews: null })
  }

  const onSplitLayers = () => {
    if (bivariateDataviews) {
      trackEvent({
        category: TrackCategory.ActivityData,
        action: 'Click on bivariate option',
        label: getEventLabel([
          'split',
          dataview.name ?? dataview.id ?? bivariateDataviews[0],
          getActivitySources(dataview),
          ...getActivityFilters(dataview.config?.filters),
          bivariateDataviews[1],
        ]),
      })
    }
    disableBivariate()
  }

  const onLayerSwitchToggle = () => {
    if (onToggle) {
      onToggle()
    }
    disableBivariate()
  }

  const onRemoveLayerClick = () => {
    if (bivariateDataviews && bivariateDataviews.includes(dataview.id)) {
      disableBivariate()
    }
    deleteDataviewInstance(dataview.id)
  }

  const onToggleFilterOpen = () => {
    setFiltersOpen(!filterOpen)
    if (!hintsDismissed?.filterActivityLayers) {
      dispatch(setHintDismissed('filterActivityLayers'))
    }
  }

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
    setFiltersOpen(false)
    setColorOpen(false)
  }

  const datasetTitle = getDatasetTitleByDataview(dataview, { showPrivateIcon: false })
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
  const isTurningTidesDataset =
    dataset?.subcategory === 'user-interactive' &&
    dataset.description?.startsWith(TURNING_TIDES_DESCRIPTION_PREFIX)
  const showTurningTidesFilters = isTurningTidesDataset && isTurningTidesWorkspace

  const showFilters = isDefaultActivityDataview(dataview) || isDefaultDetectionsDataview(dataview)
  const { filtersAllowed } = getFiltersInDataview(dataview)

  return (
    <div
      data-test={`activity-layer-panel-${dataview.id}`}
      className={cx(styles.LayerPanel, activityStyles.layerPanel, {
        [styles.expandedContainerOpen]: filterOpen || colorOpen,
        [styles.noBorder]: !showBorder || bivariateDataviews?.[0] === dataview.id,
        'print-hidden': !layerActive,
      })}
    >
      <Fragment>
        <div className={styles.header}>
          <LayerSwitch
            onToggle={onLayerSwitchToggle}
            disabled={hasDeprecatedDataviewInstances}
            active={layerActive && !hasDeprecatedDataviewInstances}
            className={styles.switch}
            dataview={dataview}
          />
          <Title
            title={datasetTitle}
            className={styles.name}
            classNameActive={styles.active}
            dataview={dataview}
            toggleVisibility={!hasDeprecatedDataviewInstances}
            onToggle={onLayerSwitchToggle}
          />
          <div
            className={cx(
              'print-hidden',
              styles.actions,
              { [styles.active]: layerActive },
              styles.hideUntilHovered
            )}
          >
            {layerActive && (
              <LayerProperties
                dataview={dataview}
                open={colorOpen}
                onColorClick={changeColor}
                onToggleClick={onToggleColorOpen}
                onClickOutside={closeExpandedContainer}
                colorType="fill"
              />
            )}
            {layerActive && showFilters && (
              <ExpandedContainer
                onClickOutside={closeExpandedContainer}
                visible={filterOpen}
                component={
                  showTurningTidesFilters ? (
                    <TurningTidesFilters
                      dataview={dataview}
                      onConfirmCallback={onToggleFilterOpen}
                    />
                  ) : (
                    <LayerFilters dataview={dataview} onConfirmCallback={onToggleFilterOpen} />
                  )
                }
              >
                <div className={styles.filterButtonWrapper}>
                  <IconButton
                    data-test={`activity-layer-panel-btn-filter-${dataview.id}`}
                    icon={filterOpen ? 'filter-on' : 'filter-off'}
                    size="small"
                    onClick={onToggleFilterOpen}
                    tooltip={
                      filterOpen ? t((t) => t.layer.filterClose) : t((t) => t.layer.filterOpen)
                    }
                    tooltipPlacement="top"
                  />
                  {dataview.id === 'fishing-ais' && (
                    <Hint id="filterActivityLayers" className={styles.helpHint} />
                  )}
                </div>
              </ExpandedContainer>
            )}
            {/* {layerActive && stats && <ActivityFitBounds stats={stats} loading={isFetching} />} */}
            <InfoModal
              dataview={dataview}
              // Workaround to always show the auxiliar dataset too
              showAllDatasets={dataview.dataviewId === SAR_DATAVIEW_SLUG}
            />
            {!readOnly && (
              <Remove
                onClick={onRemoveLayerClick}
                loading={!hasDeprecatedDataviewInstances && layerActive && !layerLoaded}
              />
            )}
            {!readOnly && layerActive && layerError && (
              <IconButton
                icon={'warning'}
                type={'warning'}
                tooltip={
                  isGFWUser
                    ? `${t((t) => t.errors.layerLoading)} (${layerError})`
                    : t((t) => t.errors.layerLoading)
                }
                size="small"
              />
            )}
          </div>
          <IconButton
            icon={layerError ? 'warning' : layerActive ? 'more' : undefined}
            type={layerError ? 'warning' : 'default'}
            loading={!hasDeprecatedDataviewInstances && layerActive && !layerLoaded}
            className={cx('print-hidden', styles.shownUntilHovered)}
            size="small"
          />
        </div>
        {layerActive && (
          <div className={styles.properties}>
            {/* TODO remove when final decission on stats display is taken
              {stats && (
                <div
                  className={cx(
                    activityStyles.stats,
                    {
                      [activityStyles.statsLoading]: isFetching,
                    },
                    'print-hidden'
                  )}
                >
                  <Tooltip
                    content={
                      stats.type === 'vessels'
                        ? t(
                            'layer.statsHelp'                          )
                        : t(
                            'layer.statsHelpDetection'                          )
                    }
                  >
                    <div className={activityStyles.help}>
                      {statsValue && statsValue > 0 ? (
                        <span>
                          <I18nNumber number={statsValue} />{' '}
                          {stats.type === 'vessels'
                            ? t((t) => t.common.vessel, {
                                count: statsValue,
                                }).toLocaleLowerCase()
                            : t((t) => t.common.detection, {
                                count: statsValue,
                                }).toLocaleLowerCase()}
                        </span>
                      ) : stats.type === 'vessels' ? (
                        t((t) => t.workspace.noVesselInFilters)
                      ) : (
                        t((t) => t.workspace.noDetectionInFilters)
                      )}
                      {stats.type === 'vessels' &&
                        stats.flags > 0 &&
                        (!dataview.config?.filters?.flag ||
                          dataview.config?.filterOperators?.flag === EXCLUDE_FILTER_ID ||
                          dataview.config?.filters?.flag.length > 1) && (
                          <Fragment>
                            <span> {t((t) => t.common.from)} </span>
                            <span>
                              <I18nNumber number={stats.flags} />{' '}
                              {t((t) => t.layer.flagState, {
                                count: stats.flags,
                                }).toLocaleLowerCase()}
                            </span>
                          </Fragment>
                        )}{' '}
                      {t((t) => t.analysis.globally)}
                    </div>
                  </Tooltip>
                </div>
              )} */}
            <div className={styles.filters}>
              <div className={styles.filters}>
                <OutOfTimerangeDisclaimer dataview={dataview} />
                {dataview.category === DataviewCategory.Activity && (
                  <DatasetFilterSource dataview={dataview} />
                )}
                {filtersAllowed.map(({ id, label }) => (
                  <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
                ))}
                {showTurningTidesFilters && <TurningTidesTags dataview={dataview} />}
              </div>
            </div>
            <div className={activityStyles.legendContainer}>
              <div className={activityStyles.legend}>
                <MapLegend
                  dataview={dataview}
                  showPlaceholder={!bivariateDataviews?.includes(dataview.id)}
                />
              </div>
              {bivariateDataviews?.[0] === dataview.id && (
                <IconButton
                  size="small"
                  type="border"
                  icon="split"
                  tooltip={t((t) => t.layer.toggleCombinationMode.split)}
                  tooltipPlacement="left"
                  className={cx(activityStyles.bivariateSplit, 'print-hidden')}
                  onClick={onSplitLayers}
                />
              )}
            </div>
          </div>
        )}
        {layerActive && <ActivityAuxiliaryLayerPanel dataview={dataview} />}
      </Fragment>
    </div>
  )
}

export default ActivityLayerPanel
