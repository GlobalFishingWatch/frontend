import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { isAuthError } from '@globalfishingwatch/api-client'
import type { Dataview } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'

import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { BASEMAP_DATAVIEW_SLUG } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselAreas from 'features/vessel/areas/VesselAreas'
import Insights from 'features/vessel/insights/Insights'
import RelatedVessels from 'features/vessel/related-vessels/RelatedVessels'
import { selectVesselHasEventsDatasets } from 'features/vessel/selectors/vessel.resources.selectors'
import {
  selectVesselInfoData,
  selectVesselInfoError,
  selectVesselInfoStatus,
} from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselAreaSubsection,
  selectVesselDatasetId,
  selectVesselSection,
} from 'features/vessel/vessel.config.selectors'
import { useUpdateVesselEventsVisibility } from 'features/vessel/vessel.hooks'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { useVesselFitBounds } from 'features/vessel/vessel-bounds.hooks'
import { useSetVesselProfileEvents } from 'features/vessel/vessel-events.hooks'
import VesselHeader from 'features/vessel/VesselHeader'
import ErrorPlaceholder from 'features/workspace/ErrorPlaceholder'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useMigrateWorkspaceToast } from 'features/workspace/workspace-migration.hooks'
import WorkspaceLoginError from 'features/workspace/WorkspaceLoginError'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectIsWorkspaceVesselLocation,
  selectVesselId,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import VesselActivity from './activity/VesselActivity'
import VesselIdentity from './identity/VesselIdentity'
import type { VesselSection } from './vessel.types'

import styles from './Vessel.module.css'

const Vessel = () => {
  useMigrateWorkspaceToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const { removeDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
  const vesselId = useSelector(selectVesselId)
  const vesselSection = useSelector(selectVesselSection)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const datasetId = useSelector(selectVesselDatasetId)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const infoError = useSelector(selectVesselInfoError)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselData = useSelector(selectVesselInfoData)
  const hasSelfReportedData =
    getVesselIdentities(vesselData, {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })?.length > 0
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()
  useVesselFitBounds()
  useUpdateVesselEventsVisibility()
  useSetVesselProfileEvents()
  useFetchDataviewResources(infoStatus === AsyncReducerStatus.Finished)

  const updateAreaLayersVisibility = useCallback(
    (id?: string) => {
      if (!id) {
        removeDataviewInstance(VESSEL_PROFILE_DATAVIEWS_INSTANCES.map((d) => d.id))
      } else {
        upsertDataviewInstance(
          VESSEL_PROFILE_DATAVIEWS_INSTANCES.map((d) => ({
            ...d,
            config: { visible: id ? d.id.includes(id) : false },
          }))
        )
      }
    },
    [removeDataviewInstance, upsertDataviewInstance]
  )

  const sectionTabs: Tab<VesselSection>[] = useMemo(
    () => [
      {
        id: 'activity',
        title: t('vessel.sectionSummary', 'Summary'),
        content: <VesselActivity />,
        testId: 'vv-summary-tab',
      },
      {
        id: 'areas',
        title: t('vessel.sectionAreas', 'Areas'),
        content: hasDeprecatedDataviewInstances ? null : (
          <VesselAreas updateAreaLayersVisibility={updateAreaLayersVisibility} />
        ),
        disabled: !hasEventsDataset,
        testId: 'vv-areas-tab',
      },
      {
        id: 'related_vessels',
        title: t('vessel.sectionRelatedVessels', 'Related Vessels'),
        content: hasDeprecatedDataviewInstances ? null : <RelatedVessels />,
        disabled: !hasEventsDataset,
        testId: 'vv-related-tab',
      },
      {
        id: 'insights' as VesselSection,
        title: t('vessel.sectionInsights', 'Insights'),
        content: hasDeprecatedDataviewInstances ? null : <Insights />,
        disabled: !hasEventsDataset,
        testId: 'vv-insights-tab',
      },
    ],
    [t, hasDeprecatedDataviewInstances, updateAreaLayersVisibility, hasEventsDataset]
  )

  useEffect(() => {
    const fetchVesselProfileAreaDatasets = async () => {
      const vesselProfileDataviews = [
        BASEMAP_DATAVIEW_SLUG,
        ...VESSEL_PROFILE_DATAVIEWS_INSTANCES.map((d) => d.dataviewId),
      ]
      const { payload } = await dispatch(fetchDataviewsByIdsThunk(vesselProfileDataviews))
      if (payload) {
        const datasetsIds = getDatasetsInDataviews(payload as Dataview[])
        if (datasetsIds?.length) {
          dispatch(fetchDatasetsByIdsThunk({ ids: datasetsIds }))
        }
      }
    }
    fetchVesselProfileAreaDatasets()
  }, [dispatch])

  useEffect(() => {
    if (isWorkspaceVesselLocation) {
      dispatch(fetchWorkspaceThunk({ workspaceId: urlWorkspaceId }))
    }
    if (
      !infoStatus ||
      infoStatus === AsyncReducerStatus.Idle ||
      (infoStatus === AsyncReducerStatus.Error && infoError?.status === 401)
    ) {
      dispatch(fetchVesselInfoThunk({ vesselId, datasetId }))
    }
  }, [datasetId, dispatch, vesselId, urlWorkspaceId])

  useEffect(() => {
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [])

  const changeTab = useCallback(
    (tab: Tab<VesselSection>) => {
      dispatchQueryParams({ vesselSection: tab.id })
      updateAreaLayersVisibility(tab.id === 'areas' ? vesselArea : undefined)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: `click_${tab.id}_tab`,
      })
    },
    [dispatchQueryParams, updateAreaLayersVisibility, vesselArea]
  )

  if (infoStatus === AsyncReducerStatus.Loading) {
    return <Spinner />
  }

  if (infoStatus === AsyncReducerStatus.Error) {
    const hasAuthError = isAuthError(infoError)
    return hasAuthError ? (
      <WorkspaceLoginError
        title={
          guestUser
            ? t('errors.profileLogin', 'Login to see this vessel')
            : t('errors.privateProfile', "Your account doesn't have permissions to see this vessel")
        }
        emailSubject={`Requesting access for ${datasetId}-${vesselId} profile`}
      />
    ) : (
      <ErrorPlaceholder title={infoError?.message || 'Unexpected error'} />
    )
  }

  return (
    <Fragment>
      {infoStatus === AsyncReducerStatus.Finished && (
        <Fragment>
          <div className={styles.headerContainer}>
            <VesselHeader />
          </div>
          <VesselIdentity />
        </Fragment>
      )}
      {hasSelfReportedData ? (
        <Tabs
          tabs={sectionTabs}
          activeTab={vesselSection}
          onTabClick={changeTab}
          mountAllTabsOnLoad
        />
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.secondary}>
            {t('vessel.noActivityData', 'There is no activity information for this vessel')}
          </p>
        </div>
      )}
    </Fragment>
  )
}

export default Vessel
