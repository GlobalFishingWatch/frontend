import { useSelector } from 'react-redux'
import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { isAuthError } from '@globalfishingwatch/api-client'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import {
  fetchVesselInfoThunk,
  selectVesselInfoError,
  selectVesselInfoStatus,
} from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import { useFetchDataviewResources } from 'features/resources/resources.hooks'
import { ErrorPlaceHolder, WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { isGuestUser } from 'features/user/user.slice'
import VesselIdentity from './VesselIdentity'
import VesselActivity from './activity/VesselActivity'

type VesselSection = 'activity' | 'relatedVessels' | 'areas'

const VesselDetail = () => {
  const { t } = useTranslation()
  useFetchDataviewResources()
  const dispatch = useAppDispatch()
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const infoError = useSelector(selectVesselInfoError)
  const guestUser = useSelector(isGuestUser)
  const regionsDatasets = useSelector(selectRegionsDatasets)

  useEffect(() => {
    if (Object.values(regionsDatasets).every((d) => d)) {
      dispatch(fetchRegionsThunk(regionsDatasets))
    }
  }, [dispatch, regionsDatasets])

  useEffect(() => {
    if (
      infoStatus === AsyncReducerStatus.Idle ||
      (infoStatus === AsyncReducerStatus.Error && infoError?.status === 401)
    ) {
      dispatch(fetchVesselInfoThunk({ vesselId, datasetId }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetId, dispatch, vesselId])

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
        disabled: true,
      },
      {
        id: 'areas',
        title: t('vessel.sectionAreas', 'Areas'),
        tooltip: t('common.comingSoon', 'Coming soon'),
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
    console.log('🚀 ~ VesselDetail ~ infoError:', infoError)
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
          <VesselSummary />
          <VesselIdentity />
        </Fragment>
      )}
      <Tabs tabs={sectionTabs} activeTab={sectionTabs[0].id} />
    </Fragment>
  )
}

export default VesselDetail
