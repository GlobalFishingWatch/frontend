import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyPortVisitEventsProps {}

export function TerminologyPortVisitEvents(props: TerminologyPortVisitEventsProps) {
  return (
    <p>
      <Trans i18nKey="events.portVisitEventsDescription">
        A port visit occurs when a vessel has a port Entry, Stop or Gap, and Exit event. This means
        the vessel is within 3 km of an anchorage (Port Entry), and is moving between 0.5 and 0.2
        knots (Port Stop), or within an anchorage but has aa gap in AIS transmission for at least 4
        hours (Port Gap), and then the vesselt transits more than 4 km outside of the anchorage
        point (Port Exit). Ports are based upon the Global Fishing Watch anchorages dataset, a
        global database of anchorage locations where vessels congregate.
      </Trans>
    </p>
  )
}

export default TerminologyPortVisitEvents
