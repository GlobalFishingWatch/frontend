import { Fragment, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { IconButton } from '@globalfishingwatch/ui-components'
import { selectFilterUpdated } from 'features/vessels/activity/vessels-activity.selectors'
import EventFilters from 'features/event-filters/EventFilters'
import styles from './ActivityFilters.module.css'

const ActivityFilters: React.FC = (): React.ReactElement => {
  const [isModalOpen, setIsOpen] = useState(false)
  const setModalOpen = useCallback((isOpen) => {
    setIsOpen(isOpen)
  }, [])
  const filtered = useSelector(selectFilterUpdated)

  return (
    <Fragment>
      <EventFilters isModalOpen={isModalOpen} onCloseModal={(isOpen) => setModalOpen(isOpen)}></EventFilters>
      <div className={styles.filters}>
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
