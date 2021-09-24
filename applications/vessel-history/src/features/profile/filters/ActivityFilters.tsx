import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectFilterUpdated } from 'features/vessels/activity/vessels-activity.selectors'
import EventFilters from 'features/event-filters/EventFilters'
import EventFiltersHelp from 'features/event-filters/EventFiltersHelp'
import styles from './ActivityFilters.module.css'

const ActivityFilters: React.FC = (): React.ReactElement => {
  const { t } = useTranslation()
  const [isModalOpen, setIsOpen] = useState(false)
  const [showFiltersInfo, setShowFiltersInfo] = useState(false)
  const setModalOpen = useCallback((isOpen) => {
    uaEvent({
      category: 'Vessel Detail ACTIVITY or MAP Tab',
      action: 'Open filters',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
    setIsOpen(isOpen)
  }, [])
  const filtered = useSelector(selectFilterUpdated)

  return (
    <Fragment>
      <EventFilters
        tab="ACTIVITY"
        isModalOpen={isModalOpen}
        onCloseModal={(isOpen) => setModalOpen(isOpen)}
      ></EventFilters>

      <EventFiltersHelp
        isModalOpen={showFiltersInfo}
        onCloseModal={(isOpen) => setShowFiltersInfo(isOpen)}
      ></EventFiltersHelp>
      <div className={styles.filters}>
        <IconButton
          icon="info"
          size="medium"
          type="solid"
          tooltip={t('events.activityDataReference', 'Activity Data Reference')}
          onClick={() => setShowFiltersInfo(true)}
        />
        <IconButton
          icon={filtered ? 'filter-on' : 'filter-off'}
          size="medium"
          type="solid"
          onClick={() => setModalOpen(true)}
        ></IconButton>
      </div>
    </Fragment>
  )
}

export default ActivityFilters
