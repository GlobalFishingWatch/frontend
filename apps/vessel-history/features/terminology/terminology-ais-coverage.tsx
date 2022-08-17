import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyAISCoverageProps { }

export function TerminologyAISCoverage(props: TerminologyAISCoverageProps) {
  return (
    <p>
      <Trans i18nKey="events.aisCoverageDescription">
        The coverage metric is an estimate of how well a vessel's activities,
        i.e. where it traveled and what it did, can be captured by AIS data.
        To calculate it, all voyages linked to a vessel in the last year (i.e. 12 months)
        are segmented into one hour blocks and the total number of blocks
        with at least one AIS transmission are counted.
        The coverage metric is a percentage representing the proportion
        of one hour blocks a vessel is in a voyage and has at least one AIS transmission.
        <a
          href="https://drive.google.com/file/d/1N4YRJ_yxAObEIWbaYM8l-YDPHS0bKe2N/view"
          rel="noopener noreferrer"
          target="_blank"
        >
          All Data caveats can be found in the FAQ here.
        </a>
      </Trans>
    </p>
  )
}

export default TerminologyAISCoverage
