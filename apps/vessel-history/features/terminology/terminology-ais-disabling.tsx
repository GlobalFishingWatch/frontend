import { Trans } from 'react-i18next'
import styles from './terminology.module.css'

/* eslint-disable-next-line */
export interface TerminologyAisDisablingProps {}

export function TerminologyAisDisabling(props: TerminologyAisDisablingProps) {
  return (
    <p className={styles.container}>
      <Trans i18nKey="risk.aisDisablingDescription">TBD</Trans>
    </p>
  )
}

export default TerminologyAisDisabling
