import { useSelector } from 'react-redux'
import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Spinner, Tab, Tabs } from '@globalfishingwatch/ui-components'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import {
  fetchVesselEventsThunk,
  fetchVesselInfoThunk,
  selectVesselEventsError,
  selectVesselEventsStatus,
  selectVesselInfoError,
  selectVesselInfoStatus,
} from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselSummary from 'features/vessel/VesselSummary'
import { AsyncReducerStatus } from 'utils/async-slice'
import { fetchRegionsThunk } from 'features/regions/regions.slice'
import { selectRegionsDatasets } from 'features/regions/regions.selectors'
import VesselIdentity from './VesselIdentity'
import VesselActivity from './activity/VesselActivity'

type VesselSection = 'activity' | 'relatedVessels' | 'areas'

const VesselDetail = () => {
  const { t } = useTranslation()
  // useFetchDataviewResources()
  const dispatch = useAppDispatch()
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const infoError = useSelector(selectVesselInfoError)
  const eventsStatus = useSelector(selectVesselEventsStatus)
  const eventsError = useSelector(selectVesselEventsError)
  const regionsDatasets = useSelector(selectRegionsDatasets)
  console.log('🚀 ~ VesselDetail ~ regionsDatasets:', regionsDatasets)

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
    if (
      eventsStatus === AsyncReducerStatus.Idle ||
      (eventsStatus === AsyncReducerStatus.Error && eventsError?.status === 401)
    ) {
      dispatch(fetchVesselEventsThunk({ vesselId, datasetId }))
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

  return (
    <Fragment>
      {infoStatus === AsyncReducerStatus.Finished && (
        <Fragment>
          <VesselSummary />
          <VesselIdentity />
        </Fragment>
      )}
      {eventsStatus === AsyncReducerStatus.Finished && (
        <Tabs tabs={sectionTabs} activeTab={sectionTabs[0].id} />
      )}
    </Fragment>
  )
}

export default VesselDetail
