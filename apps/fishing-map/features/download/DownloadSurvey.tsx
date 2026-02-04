import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Choice, Spinner, TextArea } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import {
  selectIsDownloadActivityFinished,
  selectIsDownloadActivityLoading,
} from 'features/download/downloadActivity.slice'
import ActivityDownloadError from 'features/download/DownloadActivityError'
import { selectUserGroupsClean } from 'features/user/selectors/user.permissions.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import type { ContactConsent, FeedbackFormData } from 'pages/api/downloadSurvey'

import styles from './DownloadSurvey.module.css'

export const DISABLE_DOWNLOAD_SURVEY = 'disableDownloadSurvey'

function DownloadSurvey({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const isDownloadLoading = useSelector(selectIsDownloadActivityLoading)
  const isDownloadFinished = useSelector(selectIsDownloadActivityFinished)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [usageIntent, setUsageIntent] = useState('')
  const [disableDownloadSurvey, setDisableDownloadSurvey] = useLocalStorage(
    DISABLE_DOWNLOAD_SURVEY,
    false
  )
  const [contactConsent, setContactConsent] = useState<ContactConsent>('yes')

  const contactConsentOptions: ChoiceOption[] = useMemo(
    () => [
      { id: 'yes', label: t((t) => t.download.survey.contactPermissionYes) },
      { id: 'no', label: t((t) => t.download.survey.contactPermissionNo) },
    ],
    [t]
  )

  useEffect(() => {
    if (sent && isDownloadFinished) {
      onClose()
    }
  }, [sent, isDownloadFinished, onClose])

  const onConfirm = useCallback(async () => {
    setLoading(true)
    const { firstName, lastName, email, organization } = userData || {}
    const surveyAnswer: FeedbackFormData = {
      date: new Date().toISOString(),
      name: `${firstName} ${lastName}`,
      email: email as string,
      groups: (userGroups || []).join(', '),
      organization: organization || '',
      usageIntent,
      contactConsent,
    }
    const response = await fetch(`${PATH_BASENAME}/api/downloadSurvey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyAnswer),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }
    setLoading(false)
    setSent(true)
    if (isDownloadFinished) {
      onClose()
    }
  }, [contactConsent, isDownloadFinished, onClose, usageIntent, userData, userGroups])

  const toggleDontShowAgain = () => {
    setDisableDownloadSurvey(!disableDownloadSurvey)
  }

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>{t((t) => t.download.survey.title)}</h2>
        <p className={styles.description}>{t((t) => t.download.survey.description)}</p>
      </div>
      <div>
        <p className={styles.fieldLabel}>{t((t) => t.download.survey.intentLabel)}</p>
        <TextArea
          content={usageIntent}
          className={styles.textArea}
          placeholder={t((t) => t.download.survey.intentPlaceholder)}
          onChange={(e) => {
            setUsageIntent(e.target.value)
          }}
        />
      </div>
      <div>
        <p className={styles.fieldLabel}>{t((t) => t.download.survey.contactPermissionLabel)}</p>
        <Choice
          options={contactConsentOptions}
          onSelect={(o) => setContactConsent(o.id)}
          activeOption={contactConsent}
          size="medium"
        />
      </div>
      <div className={styles.footer}>
        {sent ? (
          <ActivityDownloadError />
        ) : (
          <div className={styles.disableSection}>
            <input
              id={DISABLE_DOWNLOAD_SURVEY}
              type="checkbox"
              onChange={toggleDontShowAgain}
              className={styles.disableCheckbox}
              checked={disableDownloadSurvey}
            />
            <label className={styles.disableLabel} htmlFor={DISABLE_DOWNLOAD_SURVEY}>
              {t((t) => t.common.welcomePopupDisable)}
            </label>
          </div>
        )}
        <Button
          onClick={isDownloadLoading ? undefined : onClose}
          type="secondary"
          className={cx(styles.downloadBtn, { [styles.nonInteractive]: isDownloadLoading })}
        >
          {isDownloadLoading ? (
            <p className={styles.flex}>
              <Spinner size="small" />
              {t((t) => t.download.downloading)}
            </p>
          ) : (
            t((t) => t.common.dismiss)
          )}
        </Button>
        {!sent && (
          <Button
            onClick={onConfirm}
            className={styles.downloadBtn}
            disabled={usageIntent === ''}
            loading={loading}
          >
            {t((t) => t.common.confirm)}
          </Button>
        )}
      </div>
    </div>
  )
}

export default DownloadSurvey
