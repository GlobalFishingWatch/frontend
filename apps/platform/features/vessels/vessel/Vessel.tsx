import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { isAuthError } from '@globalfishingwatch/api-client'
import type { Dataview } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { VMS_DATASET_ID } from '@globalfishingwatch/datasets-client'
import type { Tab } from '@globalfishingwatch/ui-components'
import { Spinner, Tabs } from '@globalfishingwatch/ui-components'

import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/map/default-workspaces/context-layers'
import { BASEMAP_DATAVIEW_SLUG } from 'data/map/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useFetchDataviewResources } from 'features/data/resources/resources.hooks'
import { fetchDatasetsByIdsThunk } from 'features/map/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/map/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk } from 'features/map/dataviews/dataviews.slice'
import { useClickedEventConnect } from 'features/map/map/map-interactions.hooks'
import ErrorPlaceholder from 'features/map/workspace/ErrorPlaceholder'
import { useDataviewInstancesConnect } from 'features/map/workspace/workspace.hook'
import { useMigrateWorkspaceToast } from 'features/map/workspace/workspace-migration.hooks'
import WorkspaceLoginError from 'features/map/workspace/WorkspaceLoginError'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import VesselAreas from 'features/vessels/vessel/areas/VesselAreas'
import Insights from 'features/vessels/vessel/insights/Insights'
import RelatedVessels from 'features/vessels/vessel/related-vessels/RelatedVessels'
import { selectVesselHasEventsDatasets } from 'features/vessels/vessel/selectors/vessel.resources.selectors'
import {
  selectIsVesselRefreshing,
  selectVesselInfoData,
  selectVesselInfoError,
  selectVesselInfoStatus,
} from 'features/vessels/vessel/selectors/vessel.selectors'
import {
  selectIncludeRelatedIdentities,
  selectVesselAreaSubsection,
  selectVesselDatasetId,
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectVesselSection,
} from 'features/vessels/vessel/vessel.config.selectors'
import { useUpdateVesselEventsVisibility } from 'features/vessels/vessel/vessel.hooks'
import { fetchVesselInfoThunk } from 'features/vessels/vessel/vessel.slice'
import { getCurrentIdentityVessel, getVesselIdentities } from 'features/vessels/vessel/vessel.utils'
import { useVesselFitBounds } from 'features/vessels/vessel/vessel-bounds.hooks'
import { useSetVesselProfileEvents } from 'features/vessels/vessel/vessel-events.hooks'
import VesselSubHeader from 'features/vessels/vessel/VesselSubHeader'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectVesselId } from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useEventActivityToggle } from './activity/event/event-activity.hooks'
import VesselActivity from './activity/VesselActivity'
import VesselIdentity from './identity/VesselIdentity'
import type { VesselSection } from './vessel.types'

import styles from './Vessel.module.css'

const Vessel = () => {
  useMigrateWorkspaceToast()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const { removeDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const vesselId = useSelector(selectVesselId)
  const includeRelatedIdentities = useSelector(selectIncludeRelatedIdentities)
  const vesselSection = useSelector(selectVesselSection)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const datasetId = useSelector(selectVesselDatasetId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const isVesselRefreshing = useSelector(selectIsVesselRefreshing)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const infoError = useSelector(selectVesselInfoError)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const hasSelfReportedData =
    getVesselIdentities(vesselData, {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })?.length > 0
  const [expandedEventGroup] = useEventActivityToggle()
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()
  useVesselFitBounds()
  useUpdateVesselEventsVisibility()
  useSetVesselProfileEvents()
  useFetchDataviewResources(infoStatus === AsyncReducerStatus.Finished)

  const vesselIdentity = useMemo(() => {
    if (!vesselData) {
      return undefined
    }
    return getCurrentIdentityVessel(vesselData, {
      identityId,
      identitySource,
    })
  }, [identityId, identitySource, vesselData])

  const isOnlyVMS = useMemo(() => {
    return vesselIdentity?.sourceCode?.every((source) =>
      source.toUpperCase().includes(VMS_DATASET_ID)
    )
  }, [vesselIdentity])

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
        title: t((t) => t.vessel.sectionSummary),
        content: <VesselActivity />,
        testId: 'vv-summary-tab',
      },
      {
        id: 'areas',
        title: t((t) => t.vessel.sectionAreas),
        content: <VesselAreas updateAreaLayersVisibility={updateAreaLayersVisibility} />,
        disabled: !hasEventsDataset,
        testId: 'vv-areas-tab',
      },
      {
        id: 'related_vessels',
        title: t((t) => t.vessel.sectionRelatedVessels),
        content: <RelatedVessels />,
        disabled: !hasEventsDataset,
        testId: 'vv-related-tab',
      },
      {
        id: 'insights' as VesselSection,
        title: t((t) => t.vessel.sectionInsights),
        content: <Insights />,
        disabled: !hasEventsDataset || isOnlyVMS,
        testId: 'vv-insights-tab',
      },
    ],
    [t, updateAreaLayersVisibility, hasEventsDataset, isOnlyVMS]
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
    if (
      !infoStatus ||
      infoStatus === AsyncReducerStatus.Idle ||
      (infoStatus === AsyncReducerStatus.Error && infoError?.status === 401)
    ) {
      dispatch(fetchVesselInfoThunk({ vesselId, datasetId, includeRelatedIdentities }))
    }
  }, [datasetId, dispatch, vesselId])

  useEffect(() => {
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
  }, [])

  const changeTab = useCallback(
    (tab: Tab<VesselSection>) => {
      replaceQueryParams({ vesselSection: tab.id })
      updateAreaLayersVisibility(tab.id === 'areas' ? vesselArea : undefined)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: `click_${tab.id}_tab`,
      })
    },
    [updateAreaLayersVisibility, vesselArea]
  )

  const handleFullProfileClick = useCallback(() => {
    replaceQueryParams({
      includeRelatedIdentities: true,
      start: undefined,
      end: undefined,
      vesselSelfReportedId: undefined,
    })
  }, [])

  if (!infoStatus || infoStatus === AsyncReducerStatus.Loading || isVesselRefreshing) {
    return <Spinner />
  }

  if (infoStatus === AsyncReducerStatus.Error) {
    const hasAuthError = isAuthError(infoError)
    return hasAuthError ? (
      <WorkspaceLoginError
        loginSource="vessel-events"
        title={guestUser ? t((t) => t.errors.profileLogin) : t((t) => t.errors.privateProfile)}
        emailSubject={`Requesting access for ${datasetId}-${vesselId} profile`}
      />
    ) : (
      <ErrorPlaceholder title={infoError?.message || 'Unexpected error'} />
    )
  }

  return (
    <Fragment>
      <VesselSubHeader />
      {infoStatus === AsyncReducerStatus.Finished && <VesselIdentity />}
      {guestUser ? (
        <WorkspaceLoginError
          title={t((t) => t.errors.vesselActivityLogin)}
          loginSource="vessel-events"
          className={styles.loginRequiered}
        />
      ) : hasSelfReportedData ? (
        <Fragment>
          <Tabs
            tabs={sectionTabs}
            activeTab={vesselSection}
            onTabClick={changeTab}
            mountAllTabsOnLoad
            className={styles.tabsContainer}
          />
          {vesselSection === 'activity' && expandedEventGroup != null && (
            <div className="print-hidden" style={{ height: '48vh' }}></div>
          )}
        </Fragment>
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.secondary}>{t((t) => t.vessel.noActivityData)}</p>
        </div>
      )}
    </Fragment>
  )
}

export default Vessel
