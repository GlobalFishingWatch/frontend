import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useDebounce } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice, Spinner } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  selectHasDeprecatedDataviewInstances,
  selectVesselProfileDataview,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import ActivityByType from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { ACTIVITY_CONTAINER_ID } from 'features/vessel/activity/event/event-scroll.hooks'
import { VesselActivitySummary } from 'features/vessel/activity/VesselActivitySummary'
import { selectVesselHasEventsDatasets } from 'features/vessel/selectors/vessel.resources.selectors'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'

import type { VesselProfileActivityMode } from '../vessel.types'
import { useVesselProfileEventsError, useVesselProfileEventsLoading } from '../vessel-events.hooks'

import styles from './VesselActivity.module.css'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const activityMode = useSelector(selectVesselActivityMode)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)
  const eventsLoading = useVesselProfileEventsLoading()
  const eventsLoadingDebounce = useDebounce(eventsLoading, 400)
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
        label: t('vessel.activityByType'),
      },
      {
        id: 'voyage',
        label: t('vessel.activityByVoyages'),
      },
    ],
    [t]
  )

  if (hasVesselEvents && !hasDeprecatedDataviewInstances && eventsLoadingDebounce) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (!hasEventsDataset) {
    return (
      <div className={styles.emptyState}>
        <p>{t('vessel.noActivityData')}</p>
      </div>
    )
  }

  if (eventsError) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.error}>{t('errors.profileEvents')}</span>
      </div>
    )
  }

  return (
    <Fragment>
      <div data-test="vessel-profile-info" className={styles.activityTitleContainer}>
        <VesselActivitySummary />
        <Choice
          options={areaOptions}
          size="small"
          activeOption={activityMode}
          className={styles.choice}
          onSelect={setActivityMode}
        />
      </div>
      {eventsLoadingDebounce && (
        <div className={styles.placeholder}>
          <Spinner />
        </div>
      )}
      <div id={ACTIVITY_CONTAINER_ID}>
        {!eventsLoadingDebounce && activityMode === 'type' && <ActivityByType />}
        {!eventsLoadingDebounce && activityMode === 'voyage' && <ActivityByVoyage />}
      </div>
    </Fragment>
  )
}

export default VesselActivity
