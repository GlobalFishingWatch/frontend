import { useSelector } from 'react-redux'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
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
import { selectVesselDatasetId, selectVesselSection } from 'features/vessel/vessel.config.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import { useVesselFitBounds } from 'features/vessel/vessel.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { useClickedEventConnect } from 'features/map/map.hooks'
import VesselAreas from 'features/vessel/areas/VesselAreas'
import RelatedVessels from 'features/vessel/related-vessels/RelatedVessels'
import { useLocationConnect } from 'routes/routes.hook'
import { VesselSection } from 'types'
import VesselIdentity from './identity/VesselIdentity'
import VesselActivity from './activity/VesselActivity'
import styles from './Vessel.module.css'

const Vessel = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselId = useSelector(selectVesselId)
  const vesselSection = useSelector(selectVesselSection)
  const datasetId = useSelector(selectVesselDatasetId)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
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
        content: <VesselAreas />,
      },
      {
        id: 'relatedVessels',
        title: t('vessel.sectionRelatedVessels', 'Related Vessels'),
        content: <RelatedVessels />,
      },
    ],
    [t]
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
    const disableVesselPrintMode = () => {
      dispatch(setVesselPrintMode(false))
    }
    window.addEventListener('afterprint', disableVesselPrintMode)
    return () => {
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
        <Tabs tabs={sectionTabs} activeTab={vesselSection} onTabClick={changeTab} />
      </div>
    </Fragment>
  )
}

export default Vessel
