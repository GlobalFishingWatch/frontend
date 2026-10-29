import type { ReactNode } from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  DataviewDatasetConfigParam,
  IdentityVessel,
  Resource,
} from '@globalfishingwatch/api-types'
import {
  DatasetTypes,
  EndpointId,
  ResourceStatus,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  getVesselIdFromInstanceId,
  resolveDataviewDatasetResource,
} from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { VesselLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton, TagList } from '@globalfishingwatch/ui-components'

import { PRIVATE_ICON } from 'data/map/config'
import { isGFWOnlyDataset, isPrivateDataset } from 'features/_map/datasets/datasets.utils'
import { getFiltersInDataview } from 'features/_map/dataviews/dataviews.filters'
import DatasetSchemaField from 'features/_map/workspace/shared/DatasetSchemaField'
import ExpandedContainer from 'features/_map/workspace/shared/ExpandedContainer'
import { useLayerPanelDataviewSort } from 'features/_map/workspace/shared/layer-panel-sort.hook'
import { getLayerMoreIcon } from 'features/_map/workspace/shared/layer-status-icon.utils'
import VesselDownload from 'features/_map/workspace/vessels/VesselDownload'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import { selectIsWorkspaceOwnerOrDefault } from 'features/_map/workspace/workspace.selectors'
import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser, selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { getOtherVesselNames } from 'features/_vessels/vessel/vessel.utils'
import { getVesselShipNameLabel } from 'features/_vessels/vessel/vessel-label.utils'
import VesselDeprecatedLink from 'features/_vessels/vessel/VesselDeprecatedLink'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import { selectResourceByUrl } from 'features/data/resources/resources.slice'
import { FAKE_VESSEL_NAME, selectDebugOptions } from 'features/debug/debug.slice'
import { getDatasetSourceTranslated } from 'features/i18n/utils.datasets'
import { getVesselOtherNamesLabel } from 'utils/info'

import FitBounds from '../shared/FitBounds'
import Filters from '../shared/LayerFilters'
import LayerProperties from '../shared/LayerProperties'
import LayerSwitch from '../shared/LayerSwitch'
import Remove from '../shared/Remove'
import Title from '../shared/Title'

import { getVesselIdentityTooltipSummary } from './vessel-layer-panel.utils'

import styles from 'features/_map/workspace/shared/LayerPanel.module.css'

export type VesselLayerPanelProps = {
  dataview: UrlDataviewInstance
  showApplyToAll?: boolean
  showSources?: boolean
}

function VesselLayerPanel({
  dataview,
  showApplyToAll,
  showSources,
}: VesselLayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const [filterOpen, setFiltersOpen] = useState(false)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl, dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const vesselLayerInstance = useGetDeckLayer<VesselLayer>(dataview.id)?.instance
  // const vesselInstance = useMapVesselLayer(dataview.id)
  const gfwUser = useSelector(selectIsGFWUser)
  const guestUser = useSelector(selectIsGuestUser)
  const trackDatasetId = dataview.datasets?.find((rld) => rld.type === DatasetTypes.Tracks)?.id
  const hideVesselNames = useSelector(selectDebugOptions)?.hideVesselNames
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwnerOrDefault)
  const infoResource: Resource<IdentityVessel> = useSelector(
    selectResourceByUrl<IdentityVessel>(infoUrl)
  )
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)

  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const changeTrackColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
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

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setFiltersOpen(false)
    setInfoOpen(false)
  }

  const showDeprecatedWarning = isWorkspaceOwner && dataview.deprecated
  const trackLoaded = vesselLayerInstance?.getVesselTracksLayersLoaded()
  const trackLayerVisible = vesselLayerInstance?.props?.visible
  const infoLoading = infoResource?.status === ResourceStatus.Loading
  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError = vesselLayerInstance?.getVesselLayersError('track')
  // Track and events fail independently, events usually later as they take longer to respond
  const rateLimited = vesselLayerInstance?.getVesselLayersRateLimited()
  // Refetch them once any rate limit reset succeeds, wherever the challenge was started from
  useEffect(() => {
    if (rateLimited && vesselLayerInstance) {
      return GFWAPI.onRateLimitReset(() => vesselLayerInstance?.reloadErroredSublayers())
    }
  }, [rateLimited, vesselLayerInstance])
  const trackLoading = trackLayerVisible && !trackLoaded && !trackError
  // Nothing to draw: guests get no track datasets and a failed track stays failed until reloaded
  const layerDisabled = guestUser || !!trackError
  const layerActive = (dataview?.config?.visible ?? true) && !layerDisabled

  const vesselData = infoResource?.data
  const vesselLabel = vesselData ? getVesselShipNameLabel(vesselData) : ''
  const sourceLabel = showSources && dataset ? getDatasetSourceTranslated(dataset) : ''
  const otherVesselsLabel = vesselData
    ? getVesselOtherNamesLabel(getOtherVesselNames(vesselData as IdentityVessel))
    : ''
  const identitiesSummary = vesselData
    ? getVesselIdentityTooltipSummary(vesselData, { showVesselId: gfwUser || false })
    : ''

  const { filtersAllowed } = getFiltersInDataview(dataview, {
    fieldsToInclude: ['speed', 'elevation'],
  })

  const hasSchemaFilterSelection = filtersAllowed.some(
    (schema) => schema.optionsSelected?.length > 0
  )

  const showGapSegmentThresholdFilter = dataview.config?.gapSegmentThreshold !== undefined

  const vesselId =
    (infoResource?.datasetConfig?.params?.find(
      (p: DataviewDatasetConfigParam) => p.id === 'vesselId'
    )?.value as string) ||
    getVesselIdFromInstanceId(dataview.id) ||
    ''

  const getVesselTitle = (): ReactNode => {
    if (infoLoading) return t((t) => t.vessel.loadingInfo)
    if (infoError) return t((t) => t.common.unknownVessel)
    if (hideVesselNames) return FAKE_VESSEL_NAME

    if (dataview?.datasetsConfig?.some((d) => isGFWOnlyDataset({ id: d.datasetId })))
      return (
        <Fragment>
          <GFWOnly type="only-icon" userGroup="gfw" />
          {vesselLabel}
          {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
        </Fragment>
      )

    const isPrivateVessel = dataview?.datasetsConfig
      ?.filter((d) => d.datasetId && d.endpoint !== EndpointId.TracksRealTime)
      .some((d) => isPrivateDataset({ id: d.datasetId }))
    return (
      <Fragment>
        {isPrivateVessel && PRIVATE_ICON}
        {vesselLabel + (showSources ? ` (${sourceLabel})` : '')}
        {otherVesselsLabel && <span className={styles.secondary}>{otherVesselsLabel}</span>}
      </Fragment>
    )
  }

  return (
    <div
      className={cx(
        styles.LayerPanel,
        {
          [styles.expandedContainerOpen]: colorOpen || infoOpen || filterOpen,
        },
        { 'print-hidden': !layerActive }
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        <LayerSwitch
          testId={`vessel-switch-${vesselLabel.replace(/\s/g, '-')}`}
          active={layerActive}
          disabled={layerDisabled}
          tooltip={guestUser ? t((t) => t.vessel.trackLoginTooltip) : undefined}
          className={styles.switch}
          dataview={dataview}
        />
        <Title
          title={
            <Fragment>
              <span className={cx({ [styles.faded]: infoLoading || infoError })}>
                <VesselLink
                  className={cx(styles.link)}
                  vesselId={vesselId}
                  datasetId={dataset?.id}
                  tooltip={<div>{identitiesSummary}</div>}
                  query={{
                    vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
                    vesselSelfReportedId: vesselId,
                  }}
                  testId="vessel-layer-vessel-name"
                  dataviewId={dataview.id}
                >
                  {getVesselTitle()}
                </VesselLink>
              </span>
            </Fragment>
          }
          showTooltip={false}
          className={styles.name}
          classNameActive={styles.active}
          active={layerActive}
          dataview={dataview}
          toggleVisibility={false}
        />
        <div
          className={cx('print-hidden', styles.actions, styles.hideUntilHovered, {
            [styles.active]: layerActive,
          })}
        >
          <Fragment>
            {!infoLoading && !(infoError || trackError) && (
              <Fragment>
                {trackDatasetId && (
                  <VesselDownload
                    dataview={dataview}
                    vesselIds={[vesselId, ...(dataview.config?.relatedVesselIds || [])]}
                    vesselTitle={vesselLabel || t((t) => t.common.unknownVessel)}
                    datasetId={trackDatasetId}
                  />
                )}
                {layerActive && (
                  <Fragment>
                    <LayerProperties
                      dataview={dataview}
                      open={colorOpen}
                      onColorClick={changeTrackColor}
                      onToggleClick={onToggleColorOpen}
                      onClickOutside={closeExpandedContainer}
                    />
                    {!guestUser && (
                      <FitBounds
                        hasError={trackError}
                        layer={vesselLayerInstance}
                        infoResource={infoResource}
                        disabled={trackLoading}
                      />
                    )}
                    <ExpandedContainer
                      visible={filterOpen}
                      onClickOutside={closeExpandedContainer}
                      component={
                        <Filters
                          dataview={dataview}
                          onConfirmCallback={onToggleFilterOpen}
                          showApplyToAll={showApplyToAll}
                        />
                      }
                    >
                      <div className={styles.filterButtonWrapper}>
                        <IconButton
                          icon={filterOpen ? 'filter-on' : 'filter-off'}
                          size="small"
                          onClick={onToggleFilterOpen}
                          tooltip={
                            filterOpen
                              ? t((t) => t.layer.filterClose)
                              : t((t) => t.layer.filterOpen)
                          }
                          tooltipPlacement="top"
                        />
                      </div>
                    </ExpandedContainer>
                  </Fragment>
                )}
              </Fragment>
            )}
            <Remove dataview={dataview} />
          </Fragment>
          {infoLoading && (
            <IconButton
              loading
              className={styles.loadingIcon}
              size="small"
              tooltip={t((t) => t.vessel.loadingInfo)}
            />
          )}
          {showDeprecatedWarning && vesselData && (
            <VesselDeprecatedLink vesselIdentity={vesselData} dataview={dataview} />
          )}
          {(infoError || trackError || rateLimited) && !showDeprecatedWarning && (
            <IconButton
              size="small"
              icon="warning"
              type="warning-invert"
              disabled={!rateLimited}
              onClick={
                rateLimited ? () => GFWAPI.startRateLimitChallenge().catch(() => {}) : undefined
              }
              tooltip={
                rateLimited
                  ? t((t) => t.rateLimit.trackLimitReached)
                  : `${t((t) => t.errors.vesselLoading)} (${vesselId})`
              }
              tooltipPlacement="top"
            />
          )}
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
        <IconButton
          {...getLayerMoreIcon({
            layerActive,
            deprecated: showDeprecatedWarning,
            error: !!(infoError || trackError),
          })}
          loading={!showDeprecatedWarning && trackLoading}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
      </div>
      {(hasSchemaFilterSelection || showGapSegmentThresholdFilter) && layerActive && (
        <div className={styles.propertiesNoPaddingBlock}>
          <div className={styles.filters}>
            <div className={styles.filters}>
              {showGapSegmentThresholdFilter && (
                <div className={cx(styles.filter)}>
                  <label className={styles.tagListLabel}>
                    {t((t) => t.layer.gapDuration)} ({t((t) => t.common.hours)})
                  </label>
                  <TagList
                    tags={[
                      {
                        id: dataview.config?.gapSegmentThreshold?.toString() || '',
                        label: dataview.config?.gapSegmentThreshold?.toString() || '',
                      },
                    ]}
                    color={dataview.config?.color}
                    className={styles.tagList}
                    onRemove={() => {
                      upsertDataviewInstance({
                        id: dataview.id,
                        config: {
                          gapSegmentThreshold: undefined,
                        },
                      })
                    }}
                  />
                </div>
              )}
              {hasSchemaFilterSelection &&
                filtersAllowed.map(({ id, label }) => (
                  <DatasetSchemaField key={id} dataview={dataview} field={id} label={label} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VesselLayerPanel
