import { useSelector } from 'react-redux'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import {
  selectIsVesselLocation,
  selectIsWorkspaceVesselLocation,
  selectVesselId,
  selectWorkspaceId,
} from 'routes/routes.selectors'
import {
  fetchVesselInfoThunk,
  selectVesselInfoError,
  selectVesselInfoStatus,
  selectVesselPrintMode,
  setVesselPrintMode,
} from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselHeader from 'features/vessel/VesselHeader'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { ErrorPlaceHolder, WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { isGuestUser } from 'features/user/user.slice'
import {
  selectVesselAreaSubsection,
  selectVesselDatasetId,
  selectVesselSection,
} from 'features/vessel/vessel.config.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import { useVesselFitBounds } from 'features/vessel/vessel.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { useClickedEventConnect } from 'features/map/map.hooks'
import VesselAreas from 'features/vessel/areas/VesselAreas'
import RelatedVessels from 'features/vessel/related-vessels/RelatedVessels'
import { useLocationConnect } from 'routes/routes.hook'
import { VesselAreaSubsection, VesselSection } from 'types'
import { selectVesselHasEventsDatasets } from 'features/vessel/vessel.selectors'
import {
  EEZ_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import VesselIdentity from './identity/VesselIdentity'
import VesselActivity from './activity/VesselActivity'
import styles from './Vessel.module.css'

type VesselAreaLayer = {
  id: VesselAreaSubsection
  dataviewInstanceId: string
}

const VESSEL_AREA_LAYERS: VesselAreaLayer[] = [
  {
    id: 'eez',
    dataviewInstanceId: EEZ_DATAVIEW_INSTANCE_ID,
  },
  {
    id: 'fao',
    dataviewInstanceId: FAO_AREAS_DATAVIEW_INSTANCE_ID,
  },
  {
    id: 'rfmo',
    dataviewInstanceId: RFMO_DATAVIEW_INSTANCE_ID,
  },
  {
    id: 'mpa',
    dataviewInstanceId: MPA_DATAVIEW_INSTANCE_ID,
  },
]

const Vessel = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const vesselId = useSelector(selectVesselId)
  const vesselSection = useSelector(selectVesselSection)
  const vesselArea = useSelector(selectVesselAreaSubsection)
  const datasetId = useSelector(selectVesselDatasetId)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const infoError = useSelector(selectVesselInfoError)
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const regionsDatasets = useSelector(selectRegionsDatasets)
  const guestUser = useSelector(isGuestUser)
  const map = useMapInstance()
  const { cleanFeatureState } = useFeatureState(map)
  const { dispatchClickedEvent, cancelPendingInteractionRequests } = useClickedEventConnect()
  useVesselFitBounds(isVesselLocation)
  useFetchDataviewResources()

  const updateAreaLayersVisibility = useCallback(
    (id?: string) => {
      upsertDataviewInstance(
        VESSEL_AREA_LAYERS.map((area) => ({
          id: area.dataviewInstanceId,
          config: { visible: area.id === id },
        }))
      )
    },
    [upsertDataviewInstance]
  )

  const sectionTabs: Tab<VesselSection>[] = useMemo(
    () => [
      {
        id: 'activity',
        title: t('vessel.sectionActivity', 'activity'),
        content: <VesselActivity />,
      },
      {
        id: 'areas',
        title: t('vessel.sectionAreas', 'Areas'),
        content: <VesselAreas updateAreaLayersVisibility={updateAreaLayersVisibility} />,
        disabled: !hasEventsDataset,
      },
      {
        id: 'relatedVessels',
        title: t('vessel.sectionRelatedVessels', 'Related Vessels'),
        content: <RelatedVessels />,
        disabled: !hasEventsDataset,
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
    if (isWorkspaceVesselLocation) {
      dispatch(fetchWorkspaceThunk(urlWorkspaceId))
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

  const vesselPrintCallback = useCallback(() => {
    window.print()
  }, [])

  useEffect(() => {
    const enableVesselPrintMode = () => {
      dispatch(setVesselPrintMode(true))
    }
    const disableVesselPrintMode = () => {
      dispatch(setVesselPrintMode(false))
    }
    window.addEventListener('beforeprint', enableVesselPrintMode)
    window.addEventListener('afterprint', disableVesselPrintMode)
    return () => {
      window.removeEventListener('beforeprint', enableVesselPrintMode)
      window.removeEventListener('afterprint', disableVesselPrintMode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    cleanFeatureState('click')
    dispatchClickedEvent(null)
    cancelPendingInteractionRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useCallbackAfterPaint({
    callback: vesselPrintCallback,
    /**
     * Signal to the hook that we want to capture the frame right after our item list
     * model is populated.
     */
    enabled: vesselPrintMode,
  })

  const changeTab = (tab: Tab<VesselSection>) => {
    dispatchQueryParams({ vesselSection: tab.id })
    updateAreaLayersVisibility(tab.id === 'areas' ? vesselArea : undefined)
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
          <VesselHeader />
          <VesselIdentity />
        </Fragment>
      )}
      <div className={styles.activityContainer}>
        <Tabs
          tabs={sectionTabs}
          activeTab={vesselSection}
          onTabClick={changeTab}
          mountAllTabsOnLoad
        />
      </div>
    </Fragment>
  )
}

export default Vessel
