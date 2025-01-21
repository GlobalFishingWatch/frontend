import { Trans } from 'react-i18next'

import styles from './terminology.module.css'

/* eslint-disable-next-line */
export interface TerminologyIuuProps {}

export function TerminologyIuu(props: TerminologyIuuProps) {
  return (
    <div className={styles.container}>
      <Trans i18nKey="risk.iuuStatusDescription">
        Illegal, unreported and unregulated (IUU) listing status according to official RFMO IUU
        vessel lists. A vessel is defined as “present on an RFMO blacklist” if the vessel is
        currently listed.” For more information, please see the{' '}
        <a href="https://docs.google.com/document/d/1Qq9s_Gp0DrmSczUZdG6D3yktoJVq9EIeuGToKLq1l3Q/edit?usp=sharing">
          FAQs
        </a>
        .
      </Trans>
    </div>
  )
}

export default TerminologyIuu
