import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import DataAndTerminology from 'features/data-and-terminology/DataAndTerminology'
import DownloadActivity from 'features/download-activity/download-activity'
import EventFilters from 'features/event-filters/EventFilters'
import EventFiltersButton from 'features/event-filters/EventFiltersButton'
import { selectIsFilterUpdated } from 'features/event-filters/filters.selectors'

import ActivityDataAndTerminology from '../components/activity/ActivityDataAndTerminology'
import { selectCurrentUserHasDownloadPermission } from '../profile.selectors'

import styles from './ActivityFilters.module.css'

const ActivityFilters: React.FC = (): React.ReactElement<any> => {
  const { t } = useTranslation()
  const [isModalOpen, setIsOpen] = useState(false)
  const setModalOpen = useCallback((isOpen) => {
    trackEvent({
      category: TrackCategory.VesselDetailActivityOrMapTab,
      action: 'Open filters',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
    setIsOpen(isOpen)
  }, [])
  const filtersApplied = useSelector(selectIsFilterUpdated)
  const isDownloadEnabled = useSelector(selectCurrentUserHasDownloadPermission)

  const onDownloadAllActivityCsv = useCallback(() => {
    trackEvent({
      category: TrackCategory.VesselDetailActivityOrMapTab,
      action: 'Click ‘download entire vessel activity‘ option',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
  }, [])
  const onDownloadFilteredActivityCsv = useCallback(() => {
    trackEvent({
      category: TrackCategory.VesselDetailActivityOrMapTab,
      action: 'Click ‘download filtered vessel activity‘ option',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
  }, [])
  const onReadmeClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.VesselDetailActivityOrMapTab,
      action: 'Click ‘view readme.md file‘ option',
      label: JSON.stringify({ tab: 'ACTIVITY' }),
    })
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
        {isDownloadEnabled && (
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
