import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { IconButton, Tooltip } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { useSetMapCoordinates } from 'features/map/map/map-viewport.hooks'
import { selectReadOnly } from 'features/map/workspace/selectors/app.selectors'
import { useLayerPanelDataviewSort } from 'features/map/workspace/shared/layer-panel-sort.hook'
import { useDataviewInstancesConnect } from 'features/map/workspace/workspace.hook'
import { selectIsWorkspaceOwnerOrDefault } from 'features/map/workspace/workspace.selectors'
import {
  useReportAreaCenter,
  useVesselGroupBounds,
} from 'features/reports/report-area/area-reports.hooks'
import VesselGroupReportLink from 'features/reports/report-vessel-group/VesselGroupReportLink'
import { selectIsGFWUser, selectUserData } from 'features/user/selectors/user.selectors'
import { selectVesselGroupsStatus } from 'features/user/vessel-groups/vessel-groups.slice'
import { getVesselGroupVesselsCount } from 'features/user/vessel-groups/vessel-groups.utils'
import {
  useMigrateToLatestVesselGroup,
  useVesselGroupDatasetStatus,
} from 'features/user/vessel-groups/vessel-groups-migration.hooks'
import {
  setVesselGroupConfirmationMode,
  setVesselGroupEditId,
  setVesselGroupModalVessels,
  setVesselGroupsModalOpen,
} from 'features/user/vessel-groups/vessel-groups-modal.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import LayerProperties from '../shared/LayerProperties'
import LayerSwitch from '../shared/LayerSwitch'
import Remove from '../shared/Remove'
import Title from '../shared/Title'

import VesselGroupNotFound from './VesselGroupNotFound'

import styles from 'features/map/workspace/shared/LayerPanel.module.css'

export type VesselGroupLayerPanelProps = {
  dataview: UrlDataviewInstance
  vesselGroupLoading?: boolean
}

function VesselGroupLayerPanel({
  dataview,
  vesselGroupLoading,
}: VesselGroupLayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isGFWUser = useSelector(selectIsGFWUser)
  const userData = useSelector(selectUserData)
  const readOnly = useSelector(selectReadOnly)
  const { vesselGroup } = dataview
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { isLoading, migrateToLatestVesselGroupByDataview } = useMigrateToLatestVesselGroup()
  const activityLayer = useGetDeckLayer<FourwingsLayer>(dataview?.id)
  const layerLoaded = activityLayer?.loaded && !vesselGroupLoading
  const layerError = activityLayer?.instance?.getError?.()
  const { items, attributes, listeners, setNodeRef, setActivatorNodeRef, style } =
    useLayerPanelDataviewSort(dataview.id)
  const [colorOpen, setColorOpen] = useState(false)
  const layerActive = dataview?.config?.visible ?? true
  const { isOutdated, hasDeprecatedVesselGroupVessels, hasDeletedDatasets } =
    useVesselGroupDatasetStatus(vesselGroup?.vesselsSummary?.datasets, vesselGroup)

  const [fitBoundsClicked, setfitBoundsClicked] = useState(false)
  const { loaded, bbox } = useVesselGroupBounds(fitBoundsClicked ? dataview?.id : undefined)
  const coordinates = useReportAreaCenter(bbox!)
  const setMapCoordinates = useSetMapCoordinates()
  const vesselGroupStatus = useSelector(selectVesselGroupsStatus)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwnerOrDefault)
  const isVesselGroupOwner = vesselGroup?.ownerId === userData?.id
  const showDeprecatedWarning = isWorkspaceOwner && dataview.deprecated
  const warningActive = showDeprecatedWarning || hasDeletedDatasets

  useEffect(() => {
    if (coordinates && loaded) {
      setMapCoordinates(coordinates)
      setfitBoundsClicked(false)
    }
  }, [loaded, coordinates, setMapCoordinates])

  useEffect(() => {
    if (hasDeletedDatasets && layerActive) {
      upsertDataviewInstance({
        id: dataview.id,
        config: {
          visible: false,
        },
      })
    }
  }, [hasDeletedDatasets, layerActive, dataview.id, upsertDataviewInstance])

  const changeInstanceColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }

  const onEditClick = () => {
    if (vesselGroup && (vesselGroup?.id || !vesselGroup?.vessels?.length)) {
      dispatch(setVesselGroupEditId(vesselGroup.id))
      dispatch(setVesselGroupModalVessels(vesselGroup.vessels ?? null))
      dispatch(setVesselGroupsModalOpen(true))
      if (isOutdated) {
        dispatch(setVesselGroupConfirmationMode('update'))
      }
    }
  }

  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const onUpdateDeprecatedLayerClick = () => {
    migrateToLatestVesselGroupByDataview(dataview)
  }

  if (!vesselGroup) {
    return <VesselGroupNotFound dataview={dataview} />
  }

  const nameLabel = vesselGroupLoading ? (
    t((t) => t.vesselGroup.loadingInfo)
  ) : (
    <Fragment>
      {formatInfoField(vesselGroup?.name, 'shipname')}{' '}
      {getVesselGroupVesselsCount(vesselGroup) > 0 && (
        <span className={styles.secondary}>({getVesselGroupVesselsCount(vesselGroup)})</span>
      )}
    </Fragment>
  )

  const titleContent = layerActive ? (
    <VesselGroupReportLink vesselGroupId={vesselGroup?.id}>
      <Tooltip
        content={
          isOutdated || hasDeletedDatasets
            ? t((t) => t.vesselGroupReport.linkDisabled)
            : t((t) => t.vesselGroupReport.clickToSee)
        }
      >
        <span>{nameLabel}</span>
      </Tooltip>
    </VesselGroupReportLink>
  ) : (
    <span>{nameLabel}</span>
  )

  return (
    <div
      className={cx(
        styles.LayerPanel,
        { [styles.expandedContainerOpen]: colorOpen },
        { 'print-hidden': !layerActive }
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className={styles.header}>
        {!hasDeletedDatasets && (
          <LayerSwitch active={layerActive} className={styles.switch} dataview={dataview} />
        )}
        <Title
          title={titleContent}
          className={cx(styles.name, { [styles.disabled]: isOutdated && !hasDeletedDatasets })}
          classNameActive={styles.active}
          dataview={dataview}
          toggleVisibility={false}
        />
        <div
          className={cx('print-hidden', styles.actions, styles.hideUntilHovered, {
            [styles.active]: layerActive,
          })}
        >
          <Fragment>
            {layerActive && !hasDeletedDatasets && (
              <Fragment>
                <VesselGroupReportLink vesselGroupId={vesselGroup?.id}>
                  <IconButton
                    tooltip={t((t) => t.vesselGroupReport.clickToSee)}
                    icon="analysis"
                    size="small"
                  />
                </VesselGroupReportLink>
                {isVesselGroupOwner && !isOutdated && (
                  <IconButton
                    size="small"
                    icon={'edit'}
                    type={'default'}
                    tooltip={t((t) => t.vesselGroup.edit)}
                    loading={vesselGroupStatus === AsyncReducerStatus.LoadingUpdate}
                    onClick={onEditClick}
                  />
                )}
                <IconButton
                  icon="target"
                  size="small"
                  tooltip={t((t) => t.layer.vessel_group_fit_bounds)}
                  onClick={() => setfitBoundsClicked(true)}
                  tooltipPlacement="top"
                  loading={fitBoundsClicked}
                />
                <LayerProperties
                  dataview={dataview}
                  open={colorOpen}
                  onColorClick={changeInstanceColor}
                  onToggleClick={onToggleColorOpen}
                  onClickOutside={closeExpandedContainer}
                  colorType="fill"
                />
              </Fragment>
            )}
            {!readOnly && (
              <Remove
                dataview={dataview}
                loading={layerActive && !layerLoaded && !hasDeletedDatasets}
                testId={`vessel-group-layer-panel-remove-${dataview.id}`}
              />
            )}
            {!readOnly &&
              (hasDeletedDatasets || (layerActive && (layerError || showDeprecatedWarning))) && (
                <IconButton
                  icon="warning"
                  type={warningActive ? 'warning-invert' : 'warning'}
                  onClick={warningActive ? onUpdateDeprecatedLayerClick : undefined}
                  loading={isLoading}
                  disabled={isLoading}
                  tooltip={
                    hasDeletedDatasets
                      ? t((t) => t.workspace.deletedVesselGroupLayer)
                      : showDeprecatedWarning
                        ? t((t) => t.workspace.deprecatedVesselGroupLayer)
                        : isGFWUser
                          ? `${t((t) => t.errors.layerLoading)} (${layerError})`
                          : t((t) => t.errors.layerLoading)
                  }
                  size="small"
                />
              )}
          </Fragment>
        </div>
        {isVesselGroupOwner &&
          isOutdated &&
          !hasDeletedDatasets &&
          !hasDeprecatedVesselGroupVessels && (
            <IconButton
              size="small"
              icon={'warning'}
              type={'warning'}
              tooltip={t((t) => t.vesselGroup.clickToUpdateLong)}
              loading={isLoading || vesselGroupStatus === AsyncReducerStatus.LoadingUpdate}
              disabled={isLoading}
              onClick={onEditClick}
            />
          )}
        <IconButton
          icon={
            hasDeletedDatasets
              ? 'warning'
              : layerActive
                ? layerError || showDeprecatedWarning
                  ? 'warning'
                  : 'more'
                : undefined
          }
          type={
            hasDeletedDatasets
              ? 'warning-invert'
              : layerActive
                ? showDeprecatedWarning
                  ? 'warning-invert'
                  : layerError
                    ? 'warning'
                    : 'default'
                : 'default'
          }
          loading={!warningActive && layerActive && !layerLoaded}
          className={cx('print-hidden', styles.shownUntilHovered)}
          size="small"
        />
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
  )
}

export default VesselGroupLayerPanel
