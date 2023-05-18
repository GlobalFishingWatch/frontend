import { useSelector } from 'react-redux'
import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Tab, Tabs } from '@globalfishingwatch/ui-components'
import { selectVesselId, selectVesselDatasetId } from 'routes/routes.selectors'
import {
  fetchVesselEventsThunk,
  fetchVesselInfoThunk,
  selectVesselEventsStatus,
  selectVesselInfoStatus,
} from 'features/vessel/vessel.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import VesselSummary from 'features/vessel/VesselSummary'
import VesselActivity from 'features/vessel/VesselActivity'
import VesselIdentity from './VesselIdentity'

type VesselSection = 'activity' | 'relatedVessels' | 'areas'

const VesselDetail = () => {
  const { t } = useTranslation()
  // useFetchDataviewResources()
  const dispatch = useAppDispatch()
  const vesselId = useSelector(selectVesselId)
  const datasetId = useSelector(selectVesselDatasetId)
  const infoStatus = useSelector(selectVesselInfoStatus)
  const eventsStatus = useSelector(selectVesselEventsStatus)

  useEffect(() => {
    if (infoStatus === 'idle') {
      dispatch(fetchVesselInfoThunk({ vesselId, datasetId }))
    }
    if (eventsStatus === 'idle') {
      dispatch(fetchVesselEventsThunk({ vesselId, datasetId }))
    }
  }, [])

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

  return (
    <Fragment>
      <VesselSummary />
      <VesselIdentity />
      <Tabs tabs={sectionTabs} activeTab={sectionTabs[0].id} />
    </Fragment>
  )
}

export default VesselDetail
