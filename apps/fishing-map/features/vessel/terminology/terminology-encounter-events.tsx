import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyEncounterEventsProps {}

export function TerminologyEncounterEvents(props: TerminologyEncounterEventsProps) {
  return (
    <p>
      <Trans i18nKey="events.encounterEventsDescription">
        Encounters may indicate potential transshipment activity between two vessels that both
        appear on AIS. Encounters are estimated using AIS data, including distance between the two
        vessels, vessel speeds, and duration in a given area. <br />
        An encounter is defined as when two vessels, a carrier vessel and encountered fishing
        vessel, are detected on AIS data as within 500 meters for at least two hours and traveling
        at a median speed &lt;2 knots, while at least 10 km from a coastal anchorage.
      </Trans>
    </p>
  )
}

export default TerminologyEncounterEvents
