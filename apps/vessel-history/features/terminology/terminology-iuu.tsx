import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyIuuProps {}

export function TerminologyIuu(props: TerminologyIuuProps) {
  return (
    <p>
      <Trans i18nKey="vessel.iuuStatusDescription">
        Illegal, unreported and unregulated (IUU) listing status according to official RFMO IUU
        vessel lists - vessel is currently listed, was previously listed or has never been listed
      </Trans>
    </p>
  )
}

export default TerminologyIuu
