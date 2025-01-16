import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { InputDate, Modal, Switch } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE } from 'data/config'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'

import { useApplyFiltersConnect } from './filters.hooks'
import type { availableEventFilters} from './filters.slice';
import { selectEnd, selectFilter, selectStart } from './filters.slice'

import styles from './EventFilters.module.css'

interface ModalProps {
  tab: 'ACTIVITY' | 'MAP'
  isModalOpen: boolean
  onCloseModal: (close: boolean) => void
}

const EventFilters: React.FC<ModalProps> = (props): React.ReactElement<any> => {
  const { t } = useTranslation()
  const tab = props.tab
  const { setFilter, setDate } = useApplyFiltersConnect()
  const isModalOpen = props.isModalOpen
  const closeModal = useCallback(() => props.onCloseModal(false), [props])
  const isPortVisitActive = useSelector(selectFilter('portVisits'))
  const isFishingEventsActive = useSelector(selectFilter('fishingEvents'))
  const isEncountersActive = useSelector(selectFilter('encounters'))
  const isLoiteringEventsActive = useSelector(selectFilter('loiteringEvents'))
  const isGapEventsActive = useSelector(selectFilter('gapEvents'))
  const start = useSelector(selectStart)?.slice(0, 10)
  const end = useSelector(selectEnd)?.slice(0, 10)

  const trackAndSetFilter = useCallback(
    (filter: availableEventFilters, value: boolean) => {
      trackEvent({
        category: TrackCategory.VesselDetailActivityOrMapTab,
        action: 'Click Filter Icon - Event type',
        label: JSON.stringify({ [filter]: value, tab: tab }),
      })
      setFilter(filter, value)
    },
    [setFilter, tab]
  )

  const trackAndSetDate = useCallback(
    (filter: 'start' | 'end', value?: string) => {
      trackEvent({
        category: TrackCategory.VesselDetailActivityOrMapTab,
        action: 'Click Filter Icon - Change dates',
        label: JSON.stringify({
          start,
          end,
          [filter]: value,
          tab: tab,
        }),
      })
      setDate(filter, value)
    },
    [end, setDate, start, tab]
  )

  return (
    <Modal
      appSelector="__next"
      title={t(`filters.title` as any, 'Filter events')}
      isOpen={isModalOpen}
      onClose={closeModal}
    >
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => trackAndSetFilter('portVisits', !isPortVisitActive)}
          active={isPortVisitActive}
        ></Switch>
        {t(`settings.portVisits.title` as any, 'Port Visits')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => trackAndSetFilter('fishingEvents', !isFishingEventsActive)}
          active={isFishingEventsActive}
        ></Switch>
        {t(`settings.fishingEvents.title` as any, 'Fishing Events')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => trackAndSetFilter('encounters', !isEncountersActive)}
          active={isEncountersActive}
        ></Switch>
        {t(`settings.encounters.title` as any, 'Encounters')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => trackAndSetFilter('loiteringEvents', !isLoiteringEventsActive)}
          active={isLoiteringEventsActive}
        ></Switch>
        {t(`settings.loiteringEvents.title` as any, 'Loitering Events')}
      </div>
      <div className={styles.filterSelector}>
        <Switch
          className={styles.filterSwitch}
          onClick={() => trackAndSetFilter('gapEvents', !isGapEventsActive)}
          active={isGapEventsActive}
        ></Switch>
        {t(`settings.gapEvents.title` as any, 'Likely disabling events')}
      </div>
      <br />
      <InputDate
        value={start ?? ''}
        onChange={(e) => {
          if (e.target.value !== start) {
            trackAndSetDate('start', e.target.value)
          }
        }}
        onRemove={() => {
          trackAndSetDate('start', undefined)
        }}
        label={t(`event.start` as any, 'Start')}
        min={DEFAULT_WORKSPACE.start}
        max={DEFAULT_WORKSPACE.end}
      />
      <br />
      <InputDate
        value={end ?? ''}
        onChange={(e) => {
          if (e.target.value !== end) {
            trackAndSetDate('end', e.target.value)
          }
        }}
        onRemove={() => {
          trackAndSetDate('end', undefined)
        }}
        label={t(`event.end` as any, 'End')}
        min={start ?? DEFAULT_WORKSPACE.start}
        max={DEFAULT_WORKSPACE.end}
      />
    </Modal>
  )
}

export default EventFilters
