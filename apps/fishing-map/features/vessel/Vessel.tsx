import { useSelector } from 'react-redux'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import {
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
import { selectVesselDatasetId } from 'features/vessel/vessel.config.selectors'
import { fetchWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import VesselIdentity from './identity/VesselIdentity'
import VesselActivity from './activity/VesselActivity'
import styles from './Vessel.module.css'

type VesselSection = 'activity' | 'relatedVessels' | 'areas'

const Vessel = () => {
  const { t } = useTranslation()
  useFetchDataviewResources()
  const dispatch = useAppDispatch()
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const infoError = useSelector(selectVesselInfoError)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const guestUser = useSelector(isGuestUser)
  const regionsDatasets = useSelector(selectRegionsDatasets)

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

  useCallbackAfterPaint({
    callback: vesselPrintCallback,
    /**
     * Signal to the hook that we want to capture the frame right after our item list
     * model is populated.
     */
    enabled: vesselPrintMode,
  })

  const sectionTabs: Tab<VesselSection>[] = useMemo(
    () => [
      {
        id: 'activity',
        title: t('vessel.sectionActivity', 'activity'),
        content: <VesselActivity />,
      },
      {
        id: 'relatedVessels',
        title: t('vessel.sectionRelatedVessels', 'Related Vessels'),
        tooltip: t('common.comingSoon', 'Coming soon'),
        tooltipPlacement: 'top',
        disabled: true,
      },
      {
        id: 'areas',
        title: t('vessel.sectionAreas', 'Areas'),
        tooltip: t('common.comingSoon', 'Coming soon'),
        tooltipPlacement: 'top',
        disabled: true,
      },
    ],
    [t]
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
        <Tabs tabs={sectionTabs} activeTab={sectionTabs[0].id} />
      </div>
    </Fragment>
  )
}

export default Vessel
