import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectEventsByIds } from 'features/vessel/activity/vessels-activity.selectors'
import Event from '../activity/event/Event'
import styles from './Insights.module.css'

const InsightEventDetails = ({
  eventIds,
  toggleVisibility,
  visible,
}: {
  eventIds: string[]
  toggleVisibility: () => void
  visible: boolean
}) => {
  const { t } = useTranslation()
  const events = useSelector(selectEventsByIds(eventIds))

  return (
    <Fragment>
      <IconButton
        size="small"
        onClick={toggleVisibility}
        className={styles.seeMoreBtn}
        tooltip={
          visible
            ? t('vessel.insights.gapsSeeLess', 'See less')
            : t('vessel.insights.gapsSeeMore', 'See more')
        }
        icon={visible ? 'arrow-top' : 'arrow-down'}
      />
      {visible && events.length > 0 && (
        <ul className={styles.eventDetailsList}>
          {events.map((event) => (
            <Event key={event.id} event={event} className={styles.event} />
          ))}
        </ul>
      )}
    </Fragment>
  )
}

export default InsightEventDetails
