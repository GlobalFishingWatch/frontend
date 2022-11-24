import { Fragment, useCallback, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import DownloadActivity from 'feature/download-activity/download-activity'
import { useSelector } from 'react-redux'
import EventFilters from 'features/event-filters/EventFilters'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import EventFiltersButton from 'features/event-filters/EventFiltersButton'
import { selectFilterUpdated } from 'features/event-filters/filters.selectors'
import ActivityDataAndTerminology from '../components/activity/ActivityDataAndTerminology'
import { selectCurrentUserProfileHasInsurerPermission } from '../profile.selectors'
import styles from './ActivityFilters.module.css'

interface ActivityFiltersProps {}

const ActivityFilters: React.FC<ActivityFiltersProps> = (
  props: ActivityFiltersProps
): React.ReactElement => {
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
  const filtersApplied = useSelector(selectFilterUpdated)
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)

  const onDownloadAllActivityCsv = useCallback(() => {
    // TODO: Add google analytics tracking for this event
  }, [])
  const onDownloadFilteredActivityCsv = useCallback(() => {
    // TODO: Add google analytics tracking for this event
  }, [])
  const onReadmeClick = useCallback(() => {
    // TODO: Add google analytics tracking for this event
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
        ></EventFiltersButton>
        {!currentProfileIsInsurer && (
          <DownloadActivity
            filtersApplied={filtersApplied}
            onDownloadAllActivityCsv={onDownloadAllActivityCsv}
            onDownloadFilteredActivityCsv={onDownloadFilteredActivityCsv}
            onReadmeClick={onReadmeClick}
          />
        )}
      </div>
    </Fragment>
  )
}

export default ActivityFilters
