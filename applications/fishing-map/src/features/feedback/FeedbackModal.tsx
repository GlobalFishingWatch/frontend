import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Button, InputText, Select } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectActiveDataviews } from 'features/dataviews/dataviews.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import { GUEST_USER_TYPE, selectUserData } from 'features/user/user.slice'
import { validateEmail } from 'utils/shared'
import { selectLocationType } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { loadSpreadsheetDoc } from 'utils/spreadsheet'
import styles from './FeedbackModal.module.css'

type FeedbackModalProps = {
  isOpen?: boolean
  onClose: () => void
}

type FeedbackData = {
  userId?: number | string
  name?: string
  email?: string
  institution?: string
  role?: string
  dataset?: string
  description?: string
  date?: string
  url?: string
}

const FEEDBACK_SHEET_TITLE = 'new feedback'
const FEEDBACK_SPREADSHEET_ID = process.env.REACT_APP_FEEDBACK_SPREADSHEET_ID || ''

export const FEEDBACK_ROLE_IDS = [
  'watch',
  'analyst',
  'navy',
  'fisheries',
  'ngo',
  'scientist',
  'journalist',
  'student',
  'general',
  'GFW',
  'other',
]

function FeedbackModal({ isOpen = false, onClose }: FeedbackModalProps) {
  const { t } = useTranslation()
  const activeDataviews = useSelector(selectActiveDataviews)
  const locationType = useSelector(selectLocationType)
  const userData = useSelector(selectUserData)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)

  const initialFeedbackState = {
    url: window.location.href,
    date: new Date().toString(),
  }

  const [feedbackData, setFeedbackData] = useState<FeedbackData>(initialFeedbackState)

  useEffect(() => {
    const name =
      userData && userData.type !== GUEST_USER_TYPE
        ? `${userData.firstName} ${userData.lastName || ''}`
        : ''
    setFeedbackData({
      ...feedbackData,
      userId: userData?.id || GUEST_USER_TYPE,
      email: userData?.email || '',
      name: name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  useEffect(() => {
    const { description, name, email } = feedbackData
    const hasMandatoryData =
      description !== undefined &&
      description !== '' &&
      name !== undefined &&
      name !== '' &&
      validateEmail(email || '')
    setSuficientData(hasMandatoryData)
  }, [feedbackData])

  const datasetOptions = activeDataviews.flatMap((dataview) => {
    if (dataview.config?.type === Generators.Type.HeatmapAnimated) {
      const sourcesInDataview = getSourcesSelectedInDataview(dataview)
      return sourcesInDataview.map((source) => {
        return {
          id: source.id,
          label: t(`datasets:${source.id.split(':')[0]}.name` as any),
        }
      })
    } else {
      return {
        id: dataview.id,
        label: t(`datasets:${dataview.datasets?.[0]?.id.split(':')[0]}.name` as any),
      }
    }
  })

  const roleOptions = FEEDBACK_ROLE_IDS.map((roleId) => ({
    id: roleId,
    label: t(`feedback.roles.${roleId}` as any),
  }))

  const onFieldChange = (field: keyof FeedbackData, value: string) => {
    setFeedbackData({ ...feedbackData, [field]: value })
  }

  const sendFeedback = async () => {
    setLoading(true)
    try {
      const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(FEEDBACK_SPREADSHEET_ID)
      // loads document properties and worksheets
      const sheet = feedbackSpreadsheetDoc.sheetsByTitle[FEEDBACK_SHEET_TITLE]
      setFeedbackData({
        ...feedbackData,
        url: window.location.href,
        date: new Date().toString(),
      })
      await sheet.addRow(feedbackData)
      setLoading(false)
      setFeedbackData(initialFeedbackState)
      onClose()
    } catch (e) {
      setLoading(false)
      console.error('Error: ', e)
    }
  }

  return (
    <Modal
      title={t('common.feedback', 'Feedback')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.column}>
            <InputText
              onChange={({ target }) => onFieldChange('name', target.value)}
              value={feedbackData.name || ''}
              label={t('common.name', 'Name')}
              placeholder={t('common.name', 'Name')}
            />
            <InputText
              onChange={({ target }) => onFieldChange('email', target.value)}
              value={feedbackData.email || ''}
              label={t('feedback.email', 'E-mail address')}
              placeholder={t('feedback.email', 'E-mail address')}
            />
            <Select
              label={`${t('feedback.role', 'Role')} (${t('feedback.optional', 'Optional')})`}
              options={roleOptions}
              selectedOption={roleOptions.find((option) => option.label === feedbackData.role)}
              onSelect={(option) => onFieldChange('role', option.label)}
              onRemove={() => onFieldChange('role', '')}
            />
            <InputText
              onChange={({ target }) => onFieldChange('institution', target.value)}
              value={feedbackData.institution || ''}
              label={`${t('feedback.institution', 'Institution/Organization')} (${t(
                'feedback.optional',
                'Optional'
              )})`}
              placeholder={t('feedback.institution', 'Institution/Organization')}
            />
          </div>
          <div className={styles.column}>
            {locationType === WORKSPACE ||
              (locationType === HOME && (
                <Select
                  label={t('feedback.dataset', 'Dataset you are providing feedback for')}
                  options={datasetOptions}
                  selectedOption={datasetOptions.find(
                    (option) => option.label === feedbackData.dataset
                  )}
                  onSelect={(option) => onFieldChange('dataset', option.label)}
                  onRemove={() => onFieldChange('dataset', '')}
                />
              ))}
            <label>{t('feedback.issue', 'What issue are you having?')}</label>
            <textarea
              onChange={({ target }) => onFieldChange('description', target.value)}
              value={feedbackData.description || ''}
              className={styles.textarea}
              placeholder={t('common.description', 'Description')}
            ></textarea>
          </div>
        </div>

        <p className={styles.intro}>
          {t(
            'feedback.intro',
            'Global Fishing Watch is constantly working to improve our data. With billions of positions and hundreds of thousands of vessel to review, and an entire ocean of activity, we will inevitably have some vessels and activities misclassified. Feedback from you can help us identify where we most need to improve our data. We will endeavour to address your feedback.'
          )}
        </p>
        <div className={styles.footer}>
          <Button
            tooltip={
              !suficientData
                ? t('feedback.insuficientData', 'Please fill in all mandatory fields')
                : ''
            }
            disabled={loading || !suficientData}
            onClick={sendFeedback}
            loading={loading}
          >
            {t('feedback.send', 'Send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
