import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@tanstack/react-router'
import cx from 'classnames'

import { GFWAPI } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components/button'
import { Icon } from '@globalfishingwatch/ui-components/icon'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { ROUTE_PATHS } from '@platform/config/routes'

import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { useClipboardNotification } from 'hooks/clipboard.hooks'

import { useApiTokens, useReloadApiTokens } from './api-tokens.hooks'
import ApiTokensHeader from './ApiTokensHeader'

import styles from './ApiTokenDetail.module.css'

function ApiTokenDetail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tokenId } = useParams({
    from: '/_platform/_content/datasets-and-api/api-tokens/$tokenId',
  })
  const entries = useApiTokens()
  const reloadApiTokens = useReloadApiTokens()
  const userApplication = entries?.find(({ id }) => String(id) === tokenId)
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'deleting' | 'error'>('idle')
  const [tokenVisible, setTokenVisible] = useState(false)
  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()

  const onDeleteClick = async () => {
    if (!userApplication || !window.confirm(t((t) => t.apiTokens.deleteConfirmation))) return
    setDeleteStatus('deleting')
    try {
      await GFWAPI.fetch(`/auth/user-applications/${userApplication.id}`, {
        method: 'DELETE',
        responseType: 'default',
      })
      await reloadApiTokens()
      navigate({ to: ROUTE_PATHS.API_TOKENS, replace: true })
    } catch {
      setDeleteStatus('error')
    }
  }

  return (
    <>
      <ApiTokensHeader title={userApplication?.name} description={userApplication?.description} />
      {!entries ? (
        <p>{t((t) => t.errors.genericShort)}</p>
      ) : !userApplication ? (
        <p>{t((t) => t.apiTokens.tokenNotFound)}</p>
      ) : (
        <section>
          <h2 className={styles.label}>{t((t) => t.apiTokens.creationDate)}</h2>
          <p className={styles.field}>{formatI18nDate(userApplication.createdAt)}</p>
          <div className={styles.tokenHeader}>
            <h2 className={styles.label}>{t((t) => t.apiTokens.token)}</h2>
            <IconButton
              icon={tokenVisible ? 'visibility-off' : 'visibility-on'}
              size="small"
              onClick={() => setTokenVisible(!tokenVisible)}
              tooltip={
                tokenVisible ? t((t) => t.apiTokens.hideToken) : t((t) => t.apiTokens.showToken)
              }
            />
          </div>
          <code className={styles.token}>
            <span className={cx({ [styles.hidden]: !tokenVisible })}>{userApplication.token}</span>
          </code>
          <div className={styles.actions}>
            <Button
              type="border-secondary"
              className={cx(styles.buttonWithIcon, styles.deleteButton)}
              onClick={onDeleteClick}
              loading={deleteStatus === 'deleting'}
            >
              <Icon icon="delete" type="default" />
              {t((t) => t.apiTokens.deleteToken)}
            </Button>
            <Button
              className={styles.buttonWithIcon}
              onClick={() => copyToClipboard(userApplication.token)}
              tooltip={showClipboardNotification ? t((t) => t.apiTokens.tokenCopied) : undefined}
            >
              <Icon icon={showClipboardNotification ? 'tick' : 'copy'} type="default" />
              {t((t) => t.apiTokens.copyToken)}
            </Button>
          </div>
          {deleteStatus === 'error' && (
            <p className={styles.error}>{t((t) => t.apiTokens.deleteError)}</p>
          )}
        </section>
      )}
    </>
  )
}

export default ApiTokenDetail
