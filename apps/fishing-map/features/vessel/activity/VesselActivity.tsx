import { useTranslation } from 'react-i18next'
import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Choice, ChoiceOption, Spinner } from '@globalfishingwatch/ui-components'
import ActivityByType from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { VesselActivitySummary } from 'features/vessel/activity/VesselActivitySummary'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import { VesselProfileActivityMode } from 'types'
import { selectVesselHasEventsDatasets } from 'features/vessel/selectors/vessel.resources.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVesselProfileDataview } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useVesselProfileEventsError, useVesselProfileEventsLoading } from '../vessel-events.hooks'
import styles from './VesselActivity.module.css'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const activityMode = useSelector(selectVesselActivityMode)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const eventsLoading = useVesselProfileEventsLoading()
  const eventsError = useVesselProfileEventsError()
  const vesselProfileDataview = useSelector(selectVesselProfileDataview)
  const hasVesselEvents =
    vesselProfileDataview?.config?.events && vesselProfileDataview?.config?.events?.length > 0

  const setActivityMode = (option: ChoiceOption<VesselProfileActivityMode>) => {
    dispatchQueryParams({ vesselActivityMode: option.id })
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `click_activity_by_${option.id}_summary_tab`,
    })
  }

  const areaOptions: ChoiceOption<VesselProfileActivityMode>[] = useMemo(
    () => [
      {
        id: 'type',
        label: t('vessel.activityByType', 'By type'),
      },
      {
        id: 'voyage',
        label: t('vessel.activityByVoyages', 'By voyages'),
      },
    ],
    [t]
  )

  if (hasVesselEvents && eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (!hasEventsDataset) {
    return (
      <div className={styles.emptyState}>
        <p>{t('vessel.noActivityData', 'There are no activity information for this vessel')}</p>
      </div>
    )
  }

  if (eventsError) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.error}>
          {t('errors.profileEvents', 'There was an error requesting the vessel events.')}
        </span>
      </div>
    )
  }

  return (
    <Fragment>
      <div className={styles.activityTitleContainer}>
        <VesselActivitySummary />
        <Choice
          options={areaOptions}
          size="small"
          activeOption={activityMode}
          className={styles.choice}
          onSelect={setActivityMode}
        />
      </div>
      {eventsLoading && (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      )}
      {!eventsLoading && activityMode === 'type' && <ActivityByType />}
      {!eventsLoading && activityMode === 'voyage' && <ActivityByVoyage />}
    </Fragment>
  )
}

export default VesselActivity
