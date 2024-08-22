import { Fragment, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { useTranslation, Trans } from 'react-i18next'
import { IconButton, Switch } from '@globalfishingwatch/ui-components'
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
import { getVesselLabel } from 'utils/info'
import { selectResources, ResourcesState } from 'features/resources/resources.slice'
import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
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
  const { dispatchLocation } = useLocationConnect()
  const dataviews = useSelector(selectVesselsDataviews)
  const workspace = useSelector(selectWorkspace)
  const guestUser = useSelector(selectIsGuestUser)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const vesselTracksData = useTimebarVesselTracksData()
  const hasVesselsWithNoTrack = hasTracksWithNoData(vesselTracksData)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const searchAllowed = useSelector(isBasicSearchAllowed)
  const someVesselsVisible = dataviews.some((d) => d.config?.visible)
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

  const onAddToVesselGroupClick = useCallback(() => {
    console.log('todo')
  }, [dataviews, deleteDataviewInstance])

  const onAddVesselGroupClick = useCallback(() => {
    console.log('todo')
  }, [dataviews, deleteDataviewInstance])

  const onSetSortOrderClick = useCallback(() => {
    sortOrder.current = sortOrder.current === 'ASC' ? 'DESC' : 'ASC'
    const dataviewsSortedIds = dataviews
      .sort((a, b) => {
        const aResource = getVesselResourceByDataviewId(resources, a.id)
        const bResource = getVesselResourceByDataviewId(resources, b.id)
        const aVesselLabel = aResource ? getVesselLabel(aResource.data) : ''
        const bVesselLabel = bResource ? getVesselLabel(bResource.data) : ''
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
            {dataviews.length > 1 && (
              <Fragment>
                <VesselGroupAddButton vessels={[]} onAddToVesselGroup={onAddToVesselGroupClick}>
                  <IconButton
                    icon={'add-to-vessel-group'}
                    size="medium"
                    tooltip={t('vesselGroup.addVessels', 'Add vessels to vessel group')}
                    tooltipPlacement="top"
                  />
                </VesselGroupAddButton>
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
              </Fragment>
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
            <IconButton
              icon="vessel-group"
              size="medium"
              tooltip={t('vesselGroup.addToWorkspace', 'Add vessel group to workspace')}
              tooltipPlacement="top"
              onClick={onAddVesselGroupClick}
            />
          </div>
        )}
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
      {hasVesselsWithNoTrack && guestUser && (
        <p className={styles.disclaimer}>
          <Trans i18nKey="vessel.trackLogin">
            One of your selected sources requires you to
            <LocalStorageLoginLink className={styles.link}>login</LocalStorageLoginLink> to see
            vessel tracks and events
          </Trans>
        </p>
      )}
      <VesselEventsLegend dataviews={dataviews} />
      <VesselsFromPositions />
    </div>
  )
}

export default VesselsSection
