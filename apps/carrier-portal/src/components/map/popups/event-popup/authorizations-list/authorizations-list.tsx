import React, { Fragment } from 'react'
import cx from 'classnames'
import uniqBy from 'lodash/uniqBy'
import { ReactComponent as AuthYesIcon } from 'assets/icons/auth-yes.svg'
import { ReactComponent as AuthNoIcon } from 'assets/icons/auth-no.svg'
import { EncounterEventAuthorizations } from 'types/api/models'
import styles from './authorizations-list.module.css'

interface AuthorizationsListProps {
  authorizationsList: EncounterEventAuthorizations[] | undefined
}

const AuthorizationsList: React.FC<AuthorizationsListProps> = ({ authorizationsList }) => {
  if (!authorizationsList) return null
  const uniqAuthorizationsList = uniqBy(authorizationsList, 'rfmo')
  return (
    <Fragment>
      {uniqAuthorizationsList.map((authorization) => (
        <span key={authorization.rfmo} className={styles.authLegend}>
          <span
            className={cx(styles.authIcon, {
              [styles.authIconUnmatched]: authorization.authorized === false,
            })}
          >
            {authorization.authorized === true ? <AuthYesIcon /> : <AuthNoIcon />}
          </span>
          {authorization.rfmo}
        </span>
      ))}
    </Fragment>
  )
}

export default AuthorizationsList
