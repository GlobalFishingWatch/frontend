import { useCallback, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { IconButton, Switch } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectActiveVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectHasDeprecatedDataviewInstances,
  selectVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { getVesselGroupDataviewInstance } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import type { ResourcesState } from 'features/resources/resources.slice'
import { selectResources } from 'features/resources/resources.slice'
import { isBasicSearchAllowed } from 'features/search/search.selectors'
import {
  hasTracksWithNoData,
  useTimebarVesselTracksData,
} from 'features/timebar/timebar-vessel.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import { getVesselId, getVesselIdentities } from 'features/vessel/vessel.utils'
import { NEW_VESSEL_GROUP_ID } from 'features/vessel-groups/vessel-groups.hooks'
import { selectWorkspaceVessselGroupsIds } from 'features/vessel-groups/vessel-groups.selectors'
import { selectVesselGroupsStatus } from 'features/vessel-groups/vessel-groups.slice'
import { setVesselGroupConfirmationMode } from 'features/vessel-groups/vessel-groups-modal.slice'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import styles from 'features/workspace/shared/Sections.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import LocalStorageLoginLink from 'routes/LoginLink'
import { WORKSPACE_SEARCH } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getVesselShipNameLabel } from 'utils/info'

import VesselEventsLegend from './VesselEventsLegend'
import VesselLayerPanel from './VesselLayerPanel'
import VesselsFromPositions from './VesselsFromPositions'
import VesselTracksLegend from './VesselTracksLegend'

const getVesselResourceByDataviewId = (resources: ResourcesState, dataviewId: string) => {
  return resources[
    Object.keys(resources).find((key) =>
      key.includes(dataviewId.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, ''))
    ) as string
  ]
}

function VesselsSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchLocation } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const activeDataviews = useSelector(selectActiveVesselsDataviews)
  const workspace = useSelector(selectWorkspace)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
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
    sortOrder.current = sortOrder.current === 'ASC' ? 'DESC' : 'ASC'
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
    : vesselResources.flatMap(({ data }) => {
        if (!data) {
          return []
        }
        return {
          id: getVesselId(data),
          identities: getVesselIdentities(data),
          datasetId: data.dataset,
        } as IdentityVesselData
      })

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx(styles.header)}>
        {dataviews.length > 1 && (
          <Switch
            className="print-hidden"
            active={someVesselsVisible}
            disabled={hasDeprecatedDataviewInstances}
            onClick={onToggleAllVessels}
            tooltip={t('vessel.toggleAllVessels', 'Toggle all vessels visibility')}
            tooltipPlacement="top"
          />
        )}
        <h2 className={styles.sectionTitle}>
          {t('common.vessel_other', 'Vessels')}
          <span className="print-hidden">
            {dataviews.length > 1 ? ` (${dataviews.length})` : ''}
          </span>
        </h2>

        {!readOnly && (
          <div
            className={cx(styles.sectionButtons, styles.sectionButtonsSecondary, 'print-hidden')}
          >
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
            {dataviews.length > 1 && (
              <IconButton
                icon={sortOrder.current === 'DESC' ? 'sort-asc' : 'sort-desc'}
                size="medium"
                tooltip={
                  sortOrder.current === 'DESC'
                    ? t('vessel.sortAsc', 'Sort vessels alphabetically (ascending)')
                    : t('vessel.sortDesc', 'Sort vessels alphabetically (descending)')
                }
                tooltipPlacement="top"
                onClick={onSetSortOrderClick}
              />
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
        <IconButton
          icon="search"
          type="border"
          size="medium"
          testId="search-vessels-open"
          disabled={!searchAllowed || hasDeprecatedDataviewInstances}
          className="print-hidden"
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
      {activeDataviews.length > 0 && guestUser && !hasDeprecatedDataviewInstances && (
        <p className={cx(styles.disclaimer, 'print-hidden')}>
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
      {!hasDeprecatedDataviewInstances && <VesselEventsLegend dataviews={dataviews} />}
      <VesselsFromPositions />
    </div>
  )
}

export default VesselsSection
