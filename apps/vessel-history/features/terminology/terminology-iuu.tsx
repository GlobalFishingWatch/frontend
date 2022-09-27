import { Trans } from 'react-i18next'
import styles from './terminology.module.css'

/* eslint-disable-next-line */
export interface TerminologyIuuProps {}

export function TerminologyIuu(props: TerminologyIuuProps) {
  return (
    <div className={styles.container}>
      <Trans i18nKey="risk.iuuStatusDescription">
        Illegal, unreported and unregulated (IUU) listing status according to official RFMO IUU
        vessel lists. There are two statuses:{' '}
        <ol>
          <li>vessel is currently listed: when a vessel is currently listed on an RFMO IUU list</li>
          <li>
            vessel is not currently listed: when a vessel is not currently listed on an RFMO IUU
            list. This includes if a vessel was previously on an RFMO IUU list but has since been
            removed.
          </li>
        </ol>
      </Trans>
    </div>
  )
}

export default TerminologyIuu
