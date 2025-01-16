import { Trans } from 'react-i18next'

import { t } from 'features/i18n/i18n'

/* eslint-disable-next-line */
export interface TerminologyFishingEventsProps { }

export function TerminologyFishingEvents(props: TerminologyFishingEventsProps) {
  return (
    <p>
      <Trans i18nKey="events.fishingEventsDescription">
        When there is a consistent series of AIS points estimated as indicating apparent fishing
        activity the points are grouped into 'Fishing Events'. <br />
        We analyze the automatic identification system (AIS) data collected from vessels that our
        research has identified as known or possible commercial fishing vessels, and apply a fishing
        detection algorithm to determine “apparent fishing activity” based on changes in vessel
        speed and direction.
        <br />
        The algorithm classifies each AIS broadcast data point for these vessels as either
        “apparently fishing” or “not fishing” and shows the former on our fishing activity heat map.
        You can find more detail in our Technology page:{' '}
        <a
          href="https://globalfishingwatch.org/our-technology/"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://globalfishingwatch.org/our-technology/
        </a>{' '}
        and Dataset page:{' '}
        <a
          href="https://globalfishingwatch.org/datasets-and-code/"
          rel="noopener noreferrer"
          target="_blank"
        >
          https://globalfishingwatch.org/datasets-and-code/
        </a>
        and FAQs:
        <a
          href={t('events.fishingEventsFaqsLink')}
          rel="noopener noreferrer"
          target="_blank"
        >
          https://drive.google.com/file/d/1N4YRJ_yxAObEIWbaYM8l-YDPHS0bKe2N/view?usp=sharing/
        </a>
      </Trans>
    </p>
  )
}

export default TerminologyFishingEvents
