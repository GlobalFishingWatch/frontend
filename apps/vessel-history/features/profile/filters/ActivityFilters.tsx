import { Fragment, useCallback, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import EventFilters from 'features/event-filters/EventFilters'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import EventFiltersButton from 'features/event-filters/EventFiltersButton'
import ActivityDataAndTerminology from '../components/activity/ActivityDataAndTerminology'
import styles from './ActivityFilters.module.css'

interface ActivityFiltersProps {
  onDownloadCsv?: () => void
  onDownloadAllActivityCsv?: () => void
  onDownloadFilteredActivityCsv?: () => void
  onReadmeClick?: () => void
}

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  onDownloadAllActivityCsv,
  onDownloadFilteredActivityCsv,
  onReadmeClick,
}: ActivityFiltersProps): React.ReactElement => {
  const { t } = useTranslation()
  const [isModalOpen, setIsOpen] = useState(false)
  const setModalOpen = useCallback((isOpen) => {
    uaEvent({
      category: 'Vessel Detail ACTIVITY or MAP Tab',
      action: 'Open filters',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
    setIsOpen(isOpen)
  }, [])

  return (
    <Fragment>
      <EventFilters
        tab="ACTIVITY"
        isModalOpen={isModalOpen}
        onCloseModal={(isOpen) => setModalOpen(isOpen)}
      ></EventFilters>
      <div className={styles.filters}>
        <DataAndTerminology
          containerClassName={styles.dataAndTerminologyContainer}
          size="medium"
          type="solid"
          title={t('common.dataAndTerminology', 'Data and Terminology')}
        >
          <ActivityDataAndTerminology />
        </DataAndTerminology>
        <EventFiltersButton
          type="secondary"
          onClick={() => setModalOpen(true)}
          onDownloadAllActivityCsv={onDownloadAllActivityCsv}
          onDownloadFilteredActivityCsv={onDownloadFilteredActivityCsv}
          onReadmeClick={onReadmeClick}
        ></EventFiltersButton>
      </div>
    </Fragment>
  )
}

export default ActivityFilters
