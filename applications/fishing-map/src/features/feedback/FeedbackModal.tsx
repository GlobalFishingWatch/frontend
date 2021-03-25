import React, { ChangeEvent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Button, InputText, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { FEEDBACK_ROLE_OPTIONS } from 'data/config'
import { selectActiveDataviews } from 'features/workspace/workspace.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import { GUEST_USER_TYPE, selectUserData } from 'features/user/user.slice'
import { validateEmail } from 'utils/shared'
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

const FEEDBACK_SPREADSHEET_ID = process.env.REACT_APP_FEEDBACK_SPREADSHEET_ID || ''
const FEEDBACK_SHEET_ID = process.env.REACT_APP_FEEDBACK_SHEET_ID || ''
const FEEDBACK_CLIENT_EMAIL = process.env.REACT_APP_FEEDBACK_CLIENT_EMAIL || ''
const FEEDBACK_PRIVATE_KEY = process.env.REACT_APP_FEEDBACK_PRIVATE_KEY || ''

function FeedbackModal({ isOpen = false, onClose }: FeedbackModalProps) {
  const { t } = useTranslation()
  const doc = new GoogleSpreadsheet(FEEDBACK_SPREADSHEET_ID)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    url: window.location.href,
    date: new Date().toString(),
  })
  const activeDataviews = useSelector(selectActiveDataviews)
  const userData = useSelector(selectUserData)
  const datasetOptions = activeDataviews.flatMap((dataview) => {
    if (dataview.config?.type === Generators.Type.HeatmapAnimated) {
      return getSourcesSelectedInDataview(dataview)
    } else {
      return {
        id: dataview.id,
        label: t(`datasets:${dataview.datasets?.[0].id.split(':')[0]}.name` as any),
      }
    }
  })

  const onNameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({ ...feedbackData, name: target.value })
  }

  const onEmailChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({ ...feedbackData, email: target.value })
  }

  useEffect(() => {
    const name = userData ? `${userData.firstName} ${userData.lastName || ''}` : ''
    setFeedbackData({
      ...feedbackData,
      userId: userData?.id || GUEST_USER_TYPE,
      email: userData?.email || '',
      name: name,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  const onInstitutionChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({ ...feedbackData, institution: target.value })
  }

  const onSelectRole = (option: SelectOption) => {
    setFeedbackData({ ...feedbackData, role: option.label })
  }

  const onRemoveRole = (option: SelectOption) => {
    setFeedbackData({ ...feedbackData, role: '' })
  }

  const onSelectDataset = (option: SelectOption) => {
    setFeedbackData({ ...feedbackData, dataset: option.label })
  }

  const onRemoveDataset = (option: SelectOption) => {
    setFeedbackData({ ...feedbackData, dataset: '' })
  }

  // const [description, setDescription] = useState('')
  const onDescriptionChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackData({ ...feedbackData, description: target.value })
  }

  useEffect(() => {
    const { description, name, email } = feedbackData
    const hasMandatoryData =
      description !== undefined &&
      description !== '' &&
      name !== undefined &&
      name !== '' &&
      validateEmail(email || '')
    setSuficientData(hasMandatoryData)
  }, [feedbackData, userData])

  const sendFeedback = async () => {
    try {
      setLoading(true)
      await doc.useServiceAccountAuth({
        client_email: FEEDBACK_CLIENT_EMAIL,
        private_key: FEEDBACK_PRIVATE_KEY,
      })
      // loads document properties and worksheets
      await doc.loadInfo()
      const sheet = doc.sheetsById[FEEDBACK_SHEET_ID]
      await sheet.addRow(feedbackData)
      setLoading(false)
      setFeedbackData({})
      onClose()
    } catch (e) {
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
              onChange={onNameChange}
              value={feedbackData.name || ''}
              label={t('common.name', 'Name')}
              placeholder={t('common.name', 'Name')}
            />
            <InputText
              onChange={onEmailChange}
              value={feedbackData.email || ''}
              label={t('feedback.email', 'E-mail address')}
              placeholder={t('feedback.email', 'E-mail address')}
            />
            <InputText
              onChange={onInstitutionChange}
              value={feedbackData.institution || ''}
              label={`${t('feedback.institution', '---')} (${t('feedback.optional', 'Optional')})`}
              placeholder={t('feedback.institution', '---')}
            />
            <Select
              label={`${t('feedback.role', '---')} (${t('feedback.optional', 'Optional')})`}
              options={FEEDBACK_ROLE_OPTIONS}
              selectedOption={FEEDBACK_ROLE_OPTIONS.find(
                (option) => option.label === feedbackData.role
              )}
              onSelect={onSelectRole}
              onRemove={onRemoveRole}
            />
          </div>
          <div className={styles.column}>
            <Select
              label={t('feedback.dataset', '---')}
              options={datasetOptions}
              selectedOption={datasetOptions.find(
                (option) => option.label === feedbackData.dataset
              )}
              onSelect={onSelectDataset}
              onRemove={onRemoveDataset}
            />
            <label>{t('feedback.issue', '---')}</label>
            <textarea
              onChange={onDescriptionChange}
              value={feedbackData.description || ''}
              className={styles.textarea}
              placeholder={t('common.description', '---')}
            ></textarea>
          </div>
        </div>

        <p className={styles.intro}>{t('feedback.intro', '---')}</p>
        <div className={styles.footer}>
          <Button
            tooltip={!suficientData ? t('feedback.insuficientData', '---') : ''}
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
