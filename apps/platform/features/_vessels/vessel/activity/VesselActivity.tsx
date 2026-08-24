import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice, Spinner } from '@globalfishingwatch/ui-components'

import ActivityByType from 'features/_vessels/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/_vessels/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { ACTIVITY_CONTAINER_ID } from 'features/_vessels/vessel/activity/event/event-scroll.hooks'
import { VesselActivitySummary } from 'features/_vessels/vessel/activity/VesselActivitySummary'
import { selectVesselHasEventsDatasets } from 'features/_vessels/vessel/selectors/vessel.resources.selectors'
import { selectVesselActivityMode } from 'features/_vessels/vessel/vessel.config.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'

import type { VesselProfileActivityMode } from '../vessel.types'
import { useVesselProfileEventsError, useVesselProfileEventsLoading } from '../vessel-events.hooks'

import styles from './VesselActivity.module.css'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const activityMode = useSelector(selectVesselActivityMode)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const eventsLoading = useVesselProfileEventsLoading()
  const eventsError = useVesselProfileEventsError()

  const setActivityMode = (option: ChoiceOption<VesselProfileActivityMode>) => {
    replaceQueryParams({ vesselActivityMode: option.id })
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: `click_activity_by_${option.id}_summary_tab`,
    })
  }

  const activityOptions: ChoiceOption<VesselProfileActivityMode>[] = useMemo(
    () => [
      {
        id: 'type',
        label: t((t) => t.vessel.activityByType),
      },
      {
        id: 'voyage',
        label: t((t) => t.vessel.activityByVoyages),
      },
    ],
    [t]
  )

  if (!hasEventsDataset) {
    return (
      <div className={styles.emptyState}>
        <p>{t((t) => t.vessel.noActivityData)}</p>
      </div>
    )
  }

  if (eventsError) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.error}>{t((t) => t.errors.profileEvents)}</span>
      </div>
    )
  }

  // The summary counts come from the same map layer as the events list, so showing it while the
  // list is still loading renders half-filled numbers. Keep the whole block in loading state.
  if (eventsLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  return (
    <Fragment>
      <div data-testid="vessel-profile-info" className={styles.activityTitleContainer}>
        <VesselActivitySummary />
        <Choice
          options={activityOptions}
          size="medium"
          activeOption={activityMode}
          className={styles.choice}
          onSelect={setActivityMode}
        />
      </div>
      <div className={styles.activityWrapper} id={ACTIVITY_CONTAINER_ID}>
        {activityMode === 'type' && <ActivityByType />}
        {activityMode === 'voyage' && <ActivityByVoyage />}
      </div>
    </Fragment>
  )
}

export default VesselActivity
