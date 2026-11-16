import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { FetchOptions } from '@globalfishingwatch/api-client'
import { GFWAPI } from '@globalfishingwatch/api-client'
import type { UserApplication } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components/button'
import { InputText } from '@globalfishingwatch/ui-components/input-text'
import { Modal } from '@globalfishingwatch/ui-components/modal'
import { TextArea } from '@globalfishingwatch/ui-components/textarea'

import { selectUserData } from 'features/_user/selectors/user.selectors'

import styles from './ApiTokenCreateModal.module.css'

const DESCRIPTION_MAX_LENGTH = 500

type UserApplicationCreateArguments = Pick<UserApplication, 'name' | 'description'>

type ApiTokenCreateModalProps = {
  onClose: () => void
  onSaved: (userApplication: UserApplication) => void | Promise<void>
}

function ApiTokenCreateModal({ onClose, onSaved }: ApiTokenCreateModalProps) {
  const { t } = useTranslation()
  const userId = useSelector(selectUserData)?.id
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [token, setToken] = useState<UserApplicationCreateArguments>({ name: '', description: '' })

  const errors = [
    token.name.length < 3 && t((t) => t.apiTokens.nameRequired),
    !token.description && t((t) => t.apiTokens.descriptionRequired),
  ].filter(Boolean)
  const valid = errors.length === 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !valid) return
    setStatus('saving')
    try {
      const userApplication = await GFWAPI.fetch<UserApplication>('/auth/user-applications', {
        method: 'POST',
        body: { ...token, userId },
      } as FetchOptions<any>)
      await onSaved(userApplication)
    } catch {
      setStatus('error')
    }
  }

  return (
    <Modal
      title={t((t) => t.apiTokens.newToken)}
      isOpen
      shouldCloseOnEsc
      className={styles.modalContentWrapper}
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputText
            id="application_name"
            label={t((t) => t.apiTokens.applicationName)}
            maxLength={100}
            value={token.name}
            className={styles.input}
            onChange={(e) => setToken({ ...token, name: e.target.value })}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </div>
        <div className={cx(styles.row, styles.textareaRow)}>
          <TextArea
            id="new-token-description"
            label={t((t) => t.apiTokens.description)}
            value={token.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            className={styles.input}
            onChange={(e) => setToken({ ...token, description: e.target.value })}
          />
          <span className={styles.charCount}>
            {token.description.length}/{DESCRIPTION_MAX_LENGTH}
          </span>
        </div>
        <div className={styles.footer}>
          {status === 'error' && <p className={styles.error}>{t((t) => t.errors.genericShort)}</p>}
          <Button
            htmlType="submit"
            loading={status === 'saving'}
            disabled={!valid}
            tooltip={valid ? undefined : errors.join('. ')}
          >
            {t((t) => t.apiTokens.createToken)}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ApiTokenCreateModal
