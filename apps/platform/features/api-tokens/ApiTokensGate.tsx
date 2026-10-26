import { Trans } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Outlet } from '@tanstack/react-router'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

import LoginLink from 'features/_user/LoginLink'
import { selectHasUserApplicationReadPermission } from 'features/_user/selectors/user.permissions.selectors'
import {
  selectIsUserApiInfoCompleted,
  selectUserData,
  selectUserLogged,
} from 'features/_user/selectors/user.selectors'

import ApiTokensHeader from './ApiTokensHeader'
import ApiTokensSignup from './ApiTokensSignup'

import styles from './ApiTokens.module.css'

function ApiTokensGate() {
  const userLogged = useSelector(selectUserLogged)
  const userData = useSelector(selectUserData)
  const hasReadPermission = useSelector(selectHasUserApplicationReadPermission)
  const isInfoCompleted = useSelector(selectIsUserApiInfoCompleted)
  const isGuest = !userLogged || !userData || userData.type === GUEST_USER_TYPE

  if (!isGuest && hasReadPermission) {
    return (
      <div className={styles.container}>{isInfoCompleted ? <Outlet /> : <ApiTokensSignup />}</div>
    )
  }

  return (
    <div className={styles.container}>
      <ApiTokensHeader />
      <p>
        {isGuest ? (
          <Trans i18nKey={(t) => t.apiTokens.loginRequired}>
            {'Register or '}
            <LoginLink className={styles.link} loginSource="api-tokens">
              login
            </LoginLink>
            {' to manage your API access tokens'}
          </Trans>
        ) : (
          <Trans i18nKey={(t) => t.apiTokens.notAuthorized}>
            {"You don't have enough permissions to perform this action, please "}
            <a
              href={`mailto:support@globalfishingwatch.org?${new URLSearchParams({
                subject: 'Not authorized',
                body: `Not enough permissions to access API tokens\nUser: ${userData.email}`,
              })}`}
            >
              contact us
            </a>
            .
          </Trans>
        )}
      </p>
    </div>
  )
}

export default ApiTokensGate
