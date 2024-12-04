import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { useTranslation, Trans } from 'react-i18next'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { IconButton, Select, Switch } from '@globalfishingwatch/ui-components'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import type { VesselsColorByProperty } from '@globalfishingwatch/deck-layers'
import { useLocationConnect } from 'routes/routes.hook'
import styles from 'features/workspace/shared/Sections.module.css'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { WORKSPACE_SEARCH } from 'routes/routes'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import {
  hasTracksWithNoData,
  useTimebarVesselTracksData,
} from 'features/timebar/timebar-vessel.hooks'
import { getVesselShipNameLabel } from 'utils/info'
import type { ResourcesState } from 'features/resources/resources.slice'
import { selectResources } from 'features/resources/resources.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectReadOnly, selectVesselsColorBy } from 'features/app/selectors/app.selectors'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { selectWorkspaceVessselGroupsIds } from 'features/vessel-groups/vessel-groups.selectors'
import { NEW_VESSEL_GROUP_ID } from 'features/vessel-groups/vessel-groups.hooks'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import { selectVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselGroupDataviewInstance } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setVesselGroupConfirmationMode } from 'features/vessel-groups/vessel-groups-modal.slice'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselId, getVesselIdentities } from 'features/vessel/vessel.utils'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import VesselTracksLegend from 'features/workspace/vessels/VesselTracksLegend'
import VesselEventsLegend from './VesselEventsLegend'
import VesselLayerPanel from './VesselLayerPanel'
import VesselsFromPositions from './VesselsFromPositions'

const getVesselResourceByDataviewId = (resources: ResourcesState, dataviewId: string) => {
  return resources[
    Object.keys(resources).find((key) =>
      key.includes(dataviewId.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, ''))
    ) as string
  ]
}

function VesselsSection(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchLocation } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const activeDataviews = useSelector(selectActiveVesselsDataviews)
  const workspace = useSelector(selectWorkspace)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const vesselGroupsInWorkspace = useSelector(selectWorkspaceVessselGroupsIds)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vesselTracksData = useTimebarVesselTracksData()
  const hasVesselsWithNoTrack = hasTracksWithNoData(vesselTracksData)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)
  const someVesselsVisible = activeDataviews.length > 0
  const readOnly = useSelector(selectReadOnly)
  const resources = useSelector(selectResources)
  const { dispatchQueryParams } = useLocationConnect()
  const sortOrder = useRef<'ASC' | 'DESC' | 'DEFAULT'>('DEFAULT')
  const vesselsColorBy = useSelector(selectVesselsColorBy)
  const [sectionSettingsExpanded, setSectionSettingsExpanded] = useState(false)

  const onToggleAllVessels = useCallback(() => {
    upsertDataviewInstance(
      dataviews.map(({ id }) => ({
        id: id,
        config: {
          visible: !someVesselsVisible,
        },
      }))
    )
  }, [someVesselsVisible, dataviews, upsertDataviewInstance])

  const onDeleteAllClick = useCallback(() => {
    deleteDataviewInstance(dataviews.map((d) => d.id))
  }, [dataviews, deleteDataviewInstance])

  const onAddToVesselGroupClick = useCallback(
    (vesselGroupId?: string) => {
      dispatch(setVesselGroupConfirmationMode('saveAndDeleteVessels'))
      if (vesselGroupId && vesselGroupId !== NEW_VESSEL_GROUP_ID) {
        const isVesselGroupInWorkspace = vesselGroupsInWorkspace.includes(vesselGroupId)
        const dataviewInstance = !isVesselGroupInWorkspace
          ? getVesselGroupDataviewInstance(vesselGroupId)
          : undefined
        const dataviewsToDelete = dataviews.flatMap((d) =>
          d.config?.visible ? { id: d.id, deleted: true } : []
        )
        upsertDataviewInstance([
          ...dataviewsToDelete,
          ...(dataviewInstance ? [dataviewInstance] : []),
        ])
        trackEvent({
          category: TrackCategory.VesselGroups,
          action: 'add_to_vessel_group_from_workspace',
          label: `${vesselGroupId}`,
        })
      }
    },
    [dataviews, dispatch, upsertDataviewInstance, vesselGroupsInWorkspace]
  )

  const onSetSortOrderClick = useCallback(() => {
    const dataviewsSortedIds = dataviews
      .sort((a, b) => {
        const aResource = getVesselResourceByDataviewId(resources, a.id)
        const bResource = getVesselResourceByDataviewId(resources, b.id)
        const aVesselLabel = aResource ? getVesselShipNameLabel(aResource.data) : ''
        const bVesselLabel = bResource ? getVesselShipNameLabel(bResource.data) : ''
        if (!aVesselLabel || !bVesselLabel) return 0
        if (sortOrder.current === 'ASC') {
          return aVesselLabel < bVesselLabel ? -1 : 1
        } else {
          return aVesselLabel < bVesselLabel ? 1 : -1
        }
      })
      .map((d) => d.id)
    dispatchQueryParams({ dataviewInstancesOrder: dataviewsSortedIds })
  }, [dataviews, dispatchQueryParams, resources])

  const onSetSortOrderAsc = useCallback(() => {
    sortOrder.current = 'ASC'
    onSetSortOrderClick()
  }, [])

  const onSetSortOrderDesc = useCallback(() => {
    sortOrder.current = 'DESC'
    onSetSortOrderClick()
  }, [])

  const onSearchClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.SearchVessel,
      action: 'Click search icon to open search panel',
    })
    dispatchLocation(WORKSPACE_SEARCH, {
      payload: {
        category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      },
    })
  }, [dispatchLocation, workspace])

  const vesselResources = activeDataviews.flatMap((dataview) => {
    const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
    return resources[infoUrl] || []
  })
  const isVesselGroupUpdating = vesselGroupsStatus === AsyncReducerStatus.LoadingUpdate
  const areVesselsLoading = vesselResources.some(
    (resource) => resource.status === ResourceStatus.Loading
  )
  const vesselsToVesselGroup = areVesselsLoading
    ? []
    : vesselResources.map(({ data }) => {
        return {
          id: getVesselId(data),
          identities: getVesselIdentities(data),
          datasetId: data.dataset,
        } as IdentityVesselData
      })

  const toggleExpandedContainer = useCallback(() => {
    setSectionSettingsExpanded((prev) => !prev)
  }, [])

  const closeExpandedContainer = useCallback(() => {
    setSectionSettingsExpanded(false)
  }, [])

  const onColorBySelectionChange = useCallback((e: SelectOption) => {
    dispatchQueryParams({ vesselsColorBy: e.id })
  }, [])

  const colorByOptions: SelectOption<VesselsColorByProperty>[] = [
    {
      id: 'track',
      label: t('vessel.colorByLayer', 'Layer color'),
    },
    {
      id: 'speed',
      label: t('vessel.colorBySpeed', 'Speed'),
    },
    {
      id: 'depth',
      label: t('vessel.colorByDepth', 'Elevation'),
    },
  ]

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx('print-hidden', styles.header)}>
        {dataviews.length > 1 && (
          <Switch
            active={someVesselsVisible}
            onClick={onToggleAllVessels}
            tooltip={t('vessel.toggleAllVessels', 'Toggle all vessels visibility')}
            tooltipPlacement="top"
          />
        )}
        <h2 className={styles.sectionTitle}>
          {t('common.vessel_other', 'Vessels')}
          {dataviews.length > 1 ? ` (${dataviews.length})` : ''}
        </h2>

        {!readOnly && (
          <div className={cx(styles.sectionButtons, styles.sectionButtonsSecondary)}>
            {activeDataviews.length > 0 && (
              <VesselGroupAddButton
                vessels={vesselsToVesselGroup}
                onAddToVesselGroup={onAddToVesselGroupClick}
              >
                <UserLoggedIconButton
                  icon={'add-to-vessel-group'}
                  loading={areVesselsLoading || isVesselGroupUpdating}
                  disabled={areVesselsLoading || isVesselGroupUpdating}
                  size="medium"
                  tooltip={t(
                    'vesselGroup.addVisibleVessels',
                    'Add visible vessels to vessel group'
                  )}
                  tooltipPlacement="top"
                />
              </VesselGroupAddButton>
            )}

            {dataviews.length > 0 && (
              <IconButton
                icon="delete"
                size="medium"
                tooltip={t('vessel.removeAllVessels', 'Remove all vessels')}
                tooltipPlacement="top"
                onClick={onDeleteAllClick}
              />
            )}
          </div>
        )}
        <ExpandedContainer
          onClickOutside={closeExpandedContainer}
          visible={sectionSettingsExpanded}
          component={
            <div className={styles.expandedContainerContent}>
              <Select
                label={t('vessel.colorBy', 'Color by')}
                options={colorByOptions}
                onSelect={onColorBySelectionChange}
                selectedOption={colorByOptions.find((o) => o.id === vesselsColorBy)}
              />
              {dataviews.length > 1 && (
                <div>
                  <label>{t('vessel.sort', 'Sort vessels')}</label>
                  <IconButton
                    icon={'sort-desc'}
                    size="medium"
                    type={sortOrder.current === 'ASC' ? 'border' : 'default'}
                    tooltip={t('vessel.sortAsc', 'Sort vessels alphabetically (ascending)')}
                    tooltipPlacement="top"
                    onClick={onSetSortOrderAsc}
                  />
                  <IconButton
                    icon={'sort-asc'}
                    size="medium"
                    type={sortOrder.current === 'DESC' ? 'border' : 'default'}
                    tooltip={t('vessel.sortDesc', 'Sort vessels alphabetically (descending)')}
                    tooltipPlacement="top"
                    onClick={onSetSortOrderDesc}
                  />
                </div>
              )}
            </div>
          }
        >
          <IconButton
            icon="settings"
            size="medium"
            tooltip={t('common.expand', 'Open Expanded Container')}
            tooltipPlacement="top"
            onClick={toggleExpandedContainer}
            className={styles.sectionButtonsSecondary}
          />
        </ExpandedContainer>
        <IconButton
          icon="search"
          type="border"
          size="medium"
          testId="search-vessels-open"
          disabled={!searchAllowed}
          tooltip={
            searchAllowed
              ? t('search.vessels', 'Search vessels')
              : t('search.notAllowed', 'Search not allowed')
          }
          tooltipPlacement="top"
          onClick={onSearchClick}
        />
      </div>
      {hasVisibleDataviews && <VesselTracksLegend />}
      <SortableContext items={dataviews}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview) => (
            <VesselLayerPanel
              key={dataview.id}
              dataview={dataview}
              showApplyToAll={dataviews.length > 1}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            {t(
              'workspace.emptyStateVessels',
              'The vessels selected in the search or by clicking on activity grid cells will appear here.'
            )}
          </div>
        )}
      </SortableContext>
      {activeDataviews.length > 0 && guestUser && (
        <p className={styles.disclaimer}>
          {hasVesselsWithNoTrack ? (
            <Trans i18nKey="vessel.trackLogin">
              One of your selected sources requires you to
              <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink> to see
              vessel tracks and events
            </Trans>
          ) : (
            <Trans i18nKey="vessel.trackResolution">
              <LocalStorageLoginLink className={styles.link}>Login</LocalStorageLoginLink> to see
              more detailed vessel tracks (free, 2 minutes)
            </Trans>
          )}
        </p>
      )}
      <VesselEventsLegend dataviews={dataviews} />
      <VesselsFromPositions />
    </div>
  )
}

export default VesselsSection
