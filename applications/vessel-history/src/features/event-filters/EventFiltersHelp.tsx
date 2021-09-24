import { useCallback } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import styles from './EventFiltersHelp.module.css'

interface ModalProps {
  isModalOpen: boolean
  onCloseModal: (close: boolean) => void
}

const EventFiltersHelp: React.FC<ModalProps> = ({
  isModalOpen,
  onCloseModal,
}): React.ReactElement => {
  const { t } = useTranslation()
  const closeModal = useCallback(() => onCloseModal(false), [onCloseModal])

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={t('events.activityFilters', 'Activity Filters')}
      className={styles.filtersInfo}
    >
      <p>
        {t(
          'events.activityEventsDescription',
          'All activity data is estimated through algorithms by Global Fishing Watch (GFW). Data caveats can be found in the FAQ here'
        )}
      </p>
      <p>
        <span className={styles.eventsLabel}>{t('events.fishingEvents', 'Fishing Events')}: </span>
        <Trans i18nKey="events.fishingEventsDescription">
          When there is a consistent series of AIS points estimated as indicating apparent fishing
          activity the points are grouped into 'Fishing Events'. <br />
          We analyze the automatic identification system (AIS) data collected from vessels that our
          research has identified as known or possible commercial fishing vessels, and apply a
          fishing detection algorithm to determine “apparent fishing activity” based on changes in
          vessel speed and direction.
          <br />
          The algorithm classifies each AIS broadcast data point for these vessels as either
          “apparently fishing” or “not fishing” and shows the former on our fishing activity heat
          map. You can find more detail in our Technology page:{' '}
          <a href="https://globalfishingwatch.org/our-technology/">
            https://globalfishingwatch.org/our-technology/
          </a>{' '}
          and Dataset page:{' '}
          <a href="https://globalfishingwatch.org/datasets-and-code/">
            https://globalfishingwatch.org/datasets-and-code/
          </a>
          .
        </Trans>
      </p>
      <p>
        <span className={styles.eventsLabel}>
          {t('events.encounterEvents', 'Encounter Events')}:{' '}
        </span>
        <Trans i18nKey="events.encounterEventsDescription">
          Encounters may indicate potential transshipment activity between two vessels that both
          appear on AIS. Encounters are estimated using AIS data, including distance between the two
          vessels, vessel speeds, and duration in a given area. <br />
          An encounter is defined as when two vessels, a carrier vessel and encountered fishing
          vessel, are detected on AIS data as within 500 meters for at least two hours and traveling
          at a median speed &lt;2 knots, while at least 10 km from a coastal anchorage.
        </Trans>
      </p>
      <p>
        <span className={styles.eventsLabel}>
          {t('events.loiteringEvents', 'Loitering Events')}:{' '}
        </span>
        <Trans i18nKey="events.loiteringEventsDescription">
          Loitering is when a single vessel exhibits behavior indicative of a potential encounter
          event. Loitering is also estimated using AIS data, including vessel speed, duration in a
          given location, and distance from shore. <br />
          Loitering occurs when a carrier vessel travels at average speed of &lt;2 knots.
          <br />
          Due to the individual definitions of loitering events and encounter events, it is possible
          for a loitering event to overlap with encounter events and to encompass one or more
          encounter events.
        </Trans>
      </p>
      <p>
        <span className={styles.eventsLabel}>{t('events.portVisitEvents', 'Port Visits')}: </span>
        <Trans i18nKey="events.portVisitEventsDescription">
          A port visit occurs when a vessel has a port Entry, Stop or Gap, and Exit event. This
          means the vessel is within 3 km of an anchorage (Port Entry), and is moving between 0.5
          and 0.2 knots (Port Stop), or within an anchorage but has aa gap in AIS transmission for
          at least 4 hours (Port Gap), and then the vesselt transits more than 4 km outside of the
          anchorage point (Port Exit). Ports are based upon the Global Fishing Watch anchorages
          dataset, a global database of anchorage locations where vessels congregate.
        </Trans>
      </p>
    </Modal>
  )
}

export default EventFiltersHelp
