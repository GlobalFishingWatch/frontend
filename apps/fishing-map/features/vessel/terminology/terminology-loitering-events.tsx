import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyLoiteringEventsProps {}

export function TerminologyLoiteringEvents(props: TerminologyLoiteringEventsProps) {
  return (
    <p>
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
  )
}

export default TerminologyLoiteringEvents
