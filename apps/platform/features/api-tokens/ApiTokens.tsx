import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '@globalfishingwatch/ui-components/button'
import { ROUTE_PATHS } from '@platform/config/routes'

import { selectHasUserApplicationCreatePermission } from 'features/_user/selectors/user.permissions.selectors'

import { useReloadApiTokens } from './api-tokens.hooks'
import ApiTokenCreateModal from './ApiTokenCreateModal'
import ApiTokenList from './ApiTokenList'
import ApiTokensHeader from './ApiTokensHeader'

import styles from './ApiTokens.module.css'

function ApiTokens() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const canCreate = useSelector(selectHasUserApplicationCreatePermission)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const reloadApiTokens = useReloadApiTokens()

  return (
    <>
      <ApiTokensHeader
        description={
          <Trans i18nKey={(t) => t.apiTokens.intro}>
            {'You need an access token to call Global Fishing Watch API endpoints. Read more in '}
            <a
              href="https://globalfishingwatch.org/our-apis/documentation/docs/authentication"
              target="_blank"
              rel="noreferrer"
            >
              our documentation
            </a>
          </Trans>
        }
      />
      <ApiTokenList />
      {canCreate && (
        <div className={styles.actions}>
          <Button onClick={() => setIsCreateOpen(true)}>{t((t) => t.apiTokens.createToken)}</Button>
        </div>
      )}
      {isCreateOpen && (
        <ApiTokenCreateModal
          onClose={() => setIsCreateOpen(false)}
          onSaved={async ({ id }) => {
            await reloadApiTokens()
            setIsCreateOpen(false)
            navigate({ to: ROUTE_PATHS.API_TOKEN, params: { tokenId: String(id) } })
          }}
        />
      )}
    </>
  )
}

export default ApiTokens
