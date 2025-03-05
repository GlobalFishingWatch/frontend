import { Trans } from 'react-i18next'

import styles from './terminology.module.css'

/* eslint-disable-next-line */
export interface TerminologyAisDisablingProps { }

export function TerminologyAisDisabling(props: TerminologyAisDisablingProps) {
  return (
    <p className={styles.container}>
      <Trans i18nKey="risk.aisDisablingDescription">
        A likely disabling event is indicated where a vessel may have intentionally turned off its AIS device,
        i.e. where a vessel has 'gone dark.' These events are gaps in AIS transmissions that our models
        predict are the result of intentional disabling rather than poor signal or similar factors.
      </Trans>
    </p>
  )
}

export default TerminologyAisDisabling
