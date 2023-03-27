import { Trans } from 'react-i18next'

/* eslint-disable-next-line */
export interface TerminologyRiskIdentityProps {}

export function TerminologyRiskIdentity(props: TerminologyRiskIdentityProps) {
  return (
    <p>
      <Trans i18nKey="risk.identitySectionDescription">
        Identity refers to identifiers, based on available information, of who the vessel is. It
        includes characteristics such as type, size and authorizations, and other information about
        the individuals who own or operate them. Vessel identifiers are based on an amalgamation of
        key sources, including registry data, AIS transmissions, and other key sources. Identity
        also includes information related to aspects of the vessel identity, such as the vessel
        flag's presence on the Paris and/or Tokyo MOU list.
      </Trans>
    </p>
  )
}

export default TerminologyRiskIdentity
