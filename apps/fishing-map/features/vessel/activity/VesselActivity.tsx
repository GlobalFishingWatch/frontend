import { useTranslation } from 'react-i18next'
import { Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Choice, ChoiceOption, Spinner } from '@globalfishingwatch/ui-components'
import { ResourceStatus } from '@globalfishingwatch/api-types'
import { ActivityByType } from 'features/vessel/activity/activity-by-type/ActivityByType'
import ActivityByVoyage from 'features/vessel/activity/activity-by-voyage/ActivityByVoyage'
import { VesselActivitySummary } from 'features/vessel/activity/VesselActivitySummary'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselActivityMode } from 'features/vessel/vessel.config.selectors'
import { VesselProfileActivityMode } from 'types'
import {
  selectVesselEventsResources,
  selectVesselEventsResourcesLoading,
  selectVesselHasEventsDatasets,
} from 'features/vessel/vessel.selectors'
import styles from './VesselActivity.module.css'

const VesselActivity = () => {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const activityMode = useSelector(selectVesselActivityMode)
  const hasEventsDataset = useSelector(selectVesselHasEventsDatasets)
  const eventsLoading = useSelector(selectVesselEventsResourcesLoading)
  const eventsResources = useSelector(selectVesselEventsResources)

  const setActivityMode = (option: ChoiceOption<VesselProfileActivityMode>) => {
    dispatchQueryParams({ vesselActivityMode: option.id })
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

  if (!eventsResources.length || eventsLoading) {
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

  const eventsError = eventsResources.some((resource) => resource.status === ResourceStatus.Error)
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
