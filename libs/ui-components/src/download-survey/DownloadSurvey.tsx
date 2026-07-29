import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import cx from 'classnames'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'

import { Button } from '../button'
import type { ChoiceOption } from '../choice'
import { Choice } from '../choice'
import { Spinner } from '../spinner'
import { TextArea } from '../textarea'

import styles from './DownloadSurvey.module.css'

export const DISABLE_DOWNLOAD_SURVEY = 'disableDownloadSurvey'

export type DownloadSurveyContactConsent = 'yes' | 'no'

export type DownloadSurveyAnswer = {
  usageIntent: string
  contactConsent: DownloadSurveyContactConsent
}

export type DownloadSurveyLabels = {
  title: string
  description: string
  intentLabel: string
  intentPlaceholder: string
  contactPermissionLabel: string
  contactPermissionYes: string
  contactPermissionNo: string
  sent: string
  disable: string
  skip: string
  send: string
  downloading: string
  error: string
}

const DEFAULT_LABELS: DownloadSurveyLabels = {
  title: 'We are preparing your file, in the meantime...',
  description:
    'Could you answer two quick questions? It takes less than a minute and helps us improve the platform.',
  intentLabel: 'How do you intend to utilize this data? (optional)',
  intentPlaceholder: 'Type your answer here',
  contactPermissionLabel: 'Would you be open to sharing your story or results later? (optional)',
  contactPermissionYes: 'Yes, I’d be happy to be contacted',
  contactPermissionNo: 'Not right now',
  sent: 'Thanks for helping us improve the platform.',
  disable: "Don't show again",
  skip: 'Skip',
  send: 'Send Feedback',
  downloading: 'Downloading',
  error: 'Something went wrong sending your answer, please try again later.',
}

type DownloadSurveyProps = {
  onConfirm: (answer: DownloadSurveyAnswer) => void | Promise<void>
  onClose: () => void
  onSent?: () => void
  labels?: Partial<DownloadSurveyLabels>
  downloading?: boolean
  showQuestions?: boolean
  notice?: ReactNode
  footerSlot?: ReactNode
  className?: string
}

export function DownloadSurvey({
  onConfirm,
  onClose,
  onSent,
  labels: labelsProp,
  downloading,
  showQuestions = true,
  notice,
  footerSlot,
  className,
}: DownloadSurveyProps) {
  const labels = useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp])
  const [disableDownloadSurvey, setDisableDownloadSurvey] = useLocalStorage(
    DISABLE_DOWNLOAD_SURVEY,
    false
  )
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [usageIntent, setUsageIntent] = useState('')
  const [contactConsent, setContactConsent] = useState<DownloadSurveyContactConsent>('yes')

  const contactConsentOptions: ChoiceOption[] = useMemo(
    () => [
      { id: 'yes', label: labels.contactPermissionYes },
      { id: 'no', label: labels.contactPermissionNo },
    ],
    [labels]
  )

  const onConfirmClick = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      await onConfirm({ usageIntent, contactConsent })
      setSent(true)
      onSent?.()
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [contactConsent, onConfirm, onSent, usageIntent])

  const showForm = showQuestions && !sent

  return (
    <div className={cx(styles.container, className)}>
      <div>
        <h2 className={styles.title}>{labels.title}</h2>
        {notice && <p className={styles.notice}>{notice}</p>}
        {showForm && <p className={styles.description}>{labels.description}</p>}
        {sent && <p className={styles.description}>{labels.sent}</p>}
      </div>
      {showForm && (
        <div className={styles.questions}>
          <div>
            <p className={styles.fieldLabel}>{labels.intentLabel}</p>
            <TextArea
              value={usageIntent}
              className={styles.textArea}
              placeholder={labels.intentPlaceholder}
              onChange={(e) => {
                setUsageIntent(e.target.value)
              }}
            />
          </div>
          <div>
            <p className={styles.fieldLabel}>{labels.contactPermissionLabel}</p>
            <Choice
              options={contactConsentOptions}
              onSelect={(o) => setContactConsent(o.id as DownloadSurveyContactConsent)}
              activeOption={contactConsent}
              size="medium"
            />
          </div>
        </div>
      )}
      <div className={styles.footer}>
        {error && <p className={styles.error}>{labels.error}</p>}
        {!error &&
          (footerSlot ?? (
            <div className={styles.disableSection}>
              <input
                id={DISABLE_DOWNLOAD_SURVEY}
                type="checkbox"
                onChange={() => setDisableDownloadSurvey(!disableDownloadSurvey)}
                className={styles.disableCheckbox}
                checked={disableDownloadSurvey}
              />
              <label className={styles.disableLabel} htmlFor={DISABLE_DOWNLOAD_SURVEY}>
                {labels.disable}
              </label>
            </div>
          ))}
        {showForm && (
          <Button
            onClick={onConfirmClick}
            className={styles.footerBtn}
            disabled={usageIntent === ''}
            loading={loading}
            type="secondary"
          >
            {labels.send}
          </Button>
        )}
        <Button
          onClick={downloading ? undefined : onClose}
          className={cx(styles.footerBtn, { [styles.nonInteractive]: downloading })}
        >
          {downloading ? (
            <div className={styles.flex}>
              <Spinner size="small" />
              {labels.downloading}
            </div>
          ) : (
            labels.skip
          )}
        </Button>
      </div>
    </div>
  )
}
