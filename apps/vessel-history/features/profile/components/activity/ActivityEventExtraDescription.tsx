import { Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { Icon, IconButton } from '@globalfishingwatch/ui-components'
import { EventVessel } from '@globalfishingwatch/api-types'
import { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { getEncounterStatus } from 'features/vessels/activity/vessels-activity.utils'
import ActivityDate from './ActivityDate'
import styles from './Activity.module.css'

interface EventProps {
  event: RenderedEvent
}

const ActivityEventExtraDescription: React.FC<EventProps> = ({
  event,

}): React.ReactElement => {
  const { t } = useTranslation()
  const relatedVessel = event.encounter?.vessel as EventVessel
  return (
    <Fragment>
      {event.fishing?.averageSpeedKnots &&
        <div className={styles.description}>
          {t('event.avgSpeed', 'Avg Speed')}: {t('event.formatSpeedKnots', '{{value}} knots', {
            value: event.fishing.averageSpeedKnots.toFixed(2),
          })}
        </div>
      }
      {event.encounter && relatedVessel &&
        <div className={styles.description}>
          {t('vessel.encounteredVessel', 'Encountered Vessel')}:<br />
          {t('vessel.flag', 'Flag')}:  {relatedVessel.flag}<br />
          {t('vessel.mmsi', 'Mmsi')}: {relatedVessel.ssvid}<br />
          {t('vessel.type', 'Vessel Type')}: {relatedVessel.type}<br />
          {t('event.medianSpeed', 'Median Speed')}: {t('event.formatSpeedKnots', '{{value}} knots', {
            value: event.encounter.medianSpeedKnots.toFixed(2),
          })}<br />
        </div>
      }
      {event.loitering?.averageSpeedKnots &&
        <div className={styles.description}>
          {t('event.avgSpeed', 'Avg Speed')}: {t('event.formatSpeedKnots', '{{value}} knots', {
            value: event.loitering?.averageSpeedKnots.toFixed(2),
          })}
        </div>
      }

    </Fragment>
  )
}

export default ActivityEventExtraDescription
