import { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { DEFAULT_STATS_FIELDS, useGetStatsByDataviewQuery } from 'queries/stats-api'
import { ColorBarOption, IconButton, Tooltip } from '@globalfishingwatch/ui-components'
import {
  getDatasetConfigByDatasetType,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { DatasetTypes, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectBivariateDataviews, selectReadOnly } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'
import { getDatasetTitleByDataview, SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import Hint from 'features/hints/Hint'
import { selectHintsDismissed, setHintDismissed } from 'features/hints/hints.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import I18nNumber from 'features/i18n/i18nNumber'
import { isGuestUser } from 'features/user/user.slice'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import ActivityAuxiliaryLayerPanel from 'features/workspace/activity/ActivityAuxiliaryLayer'
import { SAR_DATAVIEW_SLUG } from 'data/workspaces'
import DatasetNotFound from 'features/workspace/shared/DatasetNotFound'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import ActivityFitBounds from 'features/workspace/activity/ActivityFitBounds'
import Color from 'features/workspace/common/Color'
import DatasetFilterSource from '../shared/DatasetSourceField'
import DatasetFlagField from '../shared/DatasetFlagsField'
import DatasetSchemaField from '../shared/DatasetSchemaField'
import LayerSwitch from '../common/LayerSwitch'
import Remove from '../common/Remove'
import Title from '../common/Title'
import InfoModal from '../common/InfoModal'
import OutOfTimerangeDisclaimer from '../common/OutOfBoundsDisclaimer'
import Filters from './ActivityFilters'
import { isActivityDataview, isDetectionsDataview } from './activity.utils'
import activityStyles from './ActivitySection.module.css'

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
}: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [filterOpen, setFiltersOpen] = useState(isOpen === undefined ? false : isOpen)
  const [colorOpen, setColorOpen] = useState(false)

  const { deleteDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const { dispatchQueryParams } = useLocationConnect()
  const urlTimeRange = useSelector(selectUrlTimeRange)
  const bivariateDataviews = useSelector(selectBivariateDataviews)
  const hintsDismissed = useSelector(selectHintsDismissed)
  const guestUser = useSelector(isGuestUser)
  const readOnly = useSelector(selectReadOnly)
  const layerActive = dataview?.config?.visible ?? true
  const datasetStatsFields = dataview.datasets.flatMap((d) =>
    Object.entries(d.schema).flatMap(([id, schema]) => (schema.stats ? id : []))
  )

  const fields = datasetStatsFields?.length > 0 ? datasetStatsFields : DEFAULT_STATS_FIELDS

  const { data: stats, isFetching } = useGetStatsByDataviewQuery(
    {
      dataview,
      timerange: urlTimeRange,
      fields,
    },
    {
      skip: guestUser || !urlTimeRange || !layerActive,
    }
  )

  const disableBivariate = () => {
    dispatchQueryParams({ bivariateDataviews: undefined })
  }

  const onSplitLayers = () => {
    disableBivariate()

    uaEvent({
      category: 'Activity data',
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
    if (!hintsDismissed.filterActivityLayers) {
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
  const hasDatasetAvailable =
    getDatasetConfigByDatasetType(dataview, DatasetTypes.Fourwings) !== undefined

  const showFilters = isActivityDataview(dataview) || isDetectionsDataview(dataview)
  const TitleComponent = (
    <Title
      title={datasetTitle}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onLayerSwitchToggle}
    />
  )

  const datasetFields = useMemo(() => {
    const fields: { field: SupportedDatasetSchema; label: string }[] = [
      { field: 'radiance', label: t('layer.radiance', 'Radiance') },
      { field: 'geartype', label: t('layer.gearType_other', 'Gear types') },
      { field: 'fleet', label: t('layer.fleet_other', 'Fleets') },
      { field: 'shiptype', label: t('vessel.shiptype', 'Ship type') },
      { field: 'origin', label: t('vessel.origin', 'Origin') },
      { field: 'matched', label: t('vessel.matched', 'Matched') },
      { field: 'source', label: t('vessel.source', 'Source') },
      { field: 'target_species', label: t('vessel.target_species', 'Target species') },
      { field: 'license_category', label: t('vessel.license_category', 'License category') },
      { field: 'vessel_type', label: t('vessel.vesselType_other', 'Vessel types') },
      { field: 'vessel-groups', label: t('vesselGroup.vesselGroups', 'Vessel Groups') },
    ]
    return fields
  }, [t])

  const statsValue = stats && (stats.vesselIds || stats.id)

  return (
    <div
      className={cx(styles.LayerPanel, activityStyles.layerPanel, {
        [styles.expandedContainerOpen]: filterOpen || colorOpen,
        [styles.noBorder]: !showBorder || bivariateDataviews?.[0] === dataview.id,
        'print-hidden': !layerActive,
      })}
    >
      {hasDatasetAvailable ? (
        <Fragment>
          <div className={styles.header}>
            <LayerSwitch
              onToggle={onLayerSwitchToggle}
              active={layerActive}
              className={styles.switch}
              dataview={dataview}
            />
            {datasetTitle.length > 20 ? (
              <Tooltip content={datasetTitle}>{TitleComponent}</Tooltip>
            ) : (
              TitleComponent
            )}
            <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
              {layerActive && (
                <Color
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
                  visible={filterOpen}
                  onClickOutside={closeExpandedContainer}
                  component={<Filters dataview={dataview} />}
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
                    {dataview.id === 'fishing-ais' && (
                      <Hint id="filterActivityLayers" className={styles.helpHint} />
                    )}
                  </div>
                </ExpandedContainer>
              )}
              {layerActive && stats && <ActivityFitBounds stats={stats} loading={isFetching} />}
              <InfoModal
                dataview={dataview}
                // Workaround to always show the auxiliar dataset too
                showAllDatasets={dataview.dataviewId === SAR_DATAVIEW_SLUG}
              />
              {!readOnly && <Remove onClick={onRemoveLayerClick} />}
            </div>
          </div>
          {layerActive && (
            <div className={styles.properties}>
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
                            'layer.statsHelp',
                            'The number of vessels and flag states is calculated for your current filters and time range globally (up to 1 year). Some double counting may occur.'
                          )
                        : t(
                            'layer.statsHelpDetection',
                            'The number of detections is calculated for your current filters and time range globally (up to 1 year). Some double counting may occur.'
                          )
                    }
                  >
                    <div className={activityStyles.help}>
                      {statsValue > 0 ? (
                        <span>
                          <I18nNumber number={statsValue} />{' '}
                          {stats.type === 'vessels'
                            ? t('common.vessel', {
                                count: statsValue,
                                defaultValue: 'vessels',
                              }).toLocaleLowerCase()
                            : t('common.detection', {
                                count: statsValue,
                                defaultValue: 'detections',
                              }).toLocaleLowerCase()}
                        </span>
                      ) : stats.type === 'vessels' ? (
                        t('workspace.noVesselInFilters', 'No vessels match your filters')
                      ) : (
                        t('workspace.noDetectionInFilters', 'No detections match your filters')
                      )}
                      {stats.type === 'vessels' &&
                        stats.flags > 0 &&
                        (!dataview.config?.filters?.flag ||
                          dataview.config?.filterOperators?.flag === EXCLUDE_FILTER_ID ||
                          dataview.config?.filters?.flag.length > 1) && (
                          <Fragment>
                            <span> {t('common.from', 'from')} </span>
                            <span>
                              <I18nNumber number={stats.flags} />{' '}
                              {t('layer.flagState', {
                                count: stats.flags,
                                defaultValue: 'flag states',
                              }).toLocaleLowerCase()}
                            </span>
                          </Fragment>
                        )}{' '}
                      {t('common.globally', 'globally')}
                    </div>
                  </Tooltip>
                </div>
              )}
              <div className={styles.filters}>
                <div className={styles.filters}>
                  <OutOfTimerangeDisclaimer dataview={dataview} />
                  <DatasetFilterSource dataview={dataview} />
                  <DatasetFlagField dataview={dataview} />
                  {datasetFields.map(({ field, label }) => (
                    <DatasetSchemaField
                      key={field}
                      dataview={dataview}
                      field={field}
                      label={label}
                    />
                  ))}
                </div>
              </div>
              <div className={activityStyles.legendContainer}>
                <div className={activityStyles.legend} id={`legend_${dataview.id}`}></div>
                {bivariateDataviews?.[0] === dataview.id && (
                  <IconButton
                    size="small"
                    type="border"
                    icon="split"
                    tooltip={t('layer.toggleCombinationMode.split', 'Split layers')}
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
      ) : (
        <DatasetNotFound dataview={dataview} />
      )}
    </div>
  )
}

export default ActivityLayerPanel
