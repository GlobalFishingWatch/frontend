import { useSelector } from 'react-redux'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import { Dataview, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import {
  selectIsWorkspaceVesselLocation,
  selectVesselId,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import { fetchVesselInfoThunk } from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselHeader from 'features/vessel/VesselHeader'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { ErrorPlaceHolder, WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import {
  selectVesselAreaSubsection,
  selectVesselDatasetId,
  selectVesselSection,
} from 'features/vessel/vessel.config.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useSetVesselProfileEvents } from 'features/vessel/vessel-events.hooks'
import { useUpdateVesselEventsVisibility } from 'features/vessel/vessel.hooks'
import { useClickedEventConnect } from 'features/map/map-interactions.hooks'
import VesselAreas from 'features/vessel/areas/VesselAreas'
import RelatedVessels from 'features/vessel/related-vessels/RelatedVessels'
import { useLocationConnect } from 'routes/routes.hook'
import { VesselSection } from 'types'
import { selectVesselHasEventsDatasets } from 'features/vessel/selectors/vessel.resources.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { fetchDataviewsByIdsThunk } from 'features/dataviews/dataviews.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { BASEMAP_DATAVIEW_SLUG } from 'data/workspaces'
import { useVesselFitBounds } from 'features/vessel/vessel-bounds.hooks'
import { getVesselIdentities } from 'features/vessel/vessel.utils'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import {
  selectVesselInfoStatus,
  selectVesselInfoError,
  selectVesselInfoData,
} from 'features/vessel/selectors/vessel.selectors'
import Insights from 'features/vessel/insights/Insights'
import VesselActivity from './activity/VesselActivity'
import VesselIdentity from './identity/VesselIdentity'
import styles from './Vessel.module.css'

const Vessel = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const { removeDataviewInstance, upsertDataviewInstance } = useDataviewInstancesConnect()
  const vesselId = useSelector(selectVesselId)
  const vesselSection = useSelector(selectVesselSection)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const datasetId = useSelector(selectVesselDatasetId)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const infoError = useSelector(selectVesselInfoError)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const regionsDatasets = useSelector(selectRegionsDatasets)
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
        content: <VesselAreas updateAreaLayersVisibility={updateAreaLayersVisibility} />,
        disabled: !hasEventsDataset,
        testId: 'vv-areas-tab',
      },
      {
        id: 'related_vessels',
        title: t('vessel.sectionRelatedVessels', 'Related Vessels'),
        content: <RelatedVessels />,
        disabled: !hasEventsDataset,
        testId: 'vv-related-tab',
      },
      {
        id: 'insights' as VesselSection,
        title: t('vessel.sectionInsights', 'Insights'),
        content: <Insights />,
        testId: 'vv-insights-tab',
      },
    ],
    [t, updateAreaLayersVisibility, hasEventsDataset]
  )

  useEffect(() => {
    if (Object.values(regionsDatasets).every((d) => d)) {
      dispatch(fetchRegionsThunk(regionsDatasets))
    }
  }, [dispatch, regionsDatasets])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId, dispatch, vesselId, urlWorkspaceId])

  useEffect(() => {
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeTab = (tab: Tab<VesselSection>) => {
    dispatchQueryParams({ vesselSection: tab.id })
    updateAreaLayersVisibility(tab.id === 'areas' ? vesselArea : undefined)
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `click_${tab.id}_tab`,
    })
  }

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
      <ErrorPlaceHolder title={infoError?.message || 'Unexpected error'} />
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
