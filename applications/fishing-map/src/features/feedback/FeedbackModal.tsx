import React, { ChangeEvent, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Button, InputText, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { Generators } from '@globalfishingwatch/layer-composer'
import { selectActiveDataviews } from 'features/workspace/workspace.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import { GUEST_USER_TYPE, selectUserData } from 'features/user/user.slice'
import { validateEmail } from 'utils/shared'
import { selectLocationType } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
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
const FEEDBACK_SHEET_ID = '0'
const FEEDBACK_CLIENT_EMAIL = process.env.REACT_APP_FEEDBACK_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.REACT_APP_FEEDBACK_PRIVATE_KEY

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

const feedbackSpreadsheetDoc = new GoogleSpreadsheet(FEEDBACK_SPREADSHEET_ID)

function FeedbackModal({ isOpen = false, onClose }: FeedbackModalProps) {
  const { t } = useTranslation()
  const activeDataviews = useSelector(selectActiveDataviews)
  const locationType = useSelector(selectLocationType)
  const userData = useSelector(selectUserData)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    url: window.location.href,
    date: new Date().toString(),
  })

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
    label: t(`feedback.${roleId}` as any),
  }))

  const onNameChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({ ...feedbackData, name: target.value })
  }

  const onEmailChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setFeedbackData({ ...feedbackData, email: target.value })
  }

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

  const sendFeedback = async () => {
    if (
      FEEDBACK_SPREADSHEET_ID === undefined ||
      FEEDBACK_PRIVATE_KEY === undefined ||
      FEEDBACK_CLIENT_EMAIL === undefined
    ) {
      console.warn('Feedback service account email/key/id missing')
      return
    } else {
      console.log(FEEDBACK_SPREADSHEET_ID, FEEDBACK_PRIVATE_KEY, FEEDBACK_CLIENT_EMAIL)
      try {
        setLoading(true)
        await feedbackSpreadsheetDoc.useServiceAccountAuth({
          client_email: FEEDBACK_CLIENT_EMAIL,
          private_key: FEEDBACK_PRIVATE_KEY,
        })
        // loads document properties and worksheets
        await feedbackSpreadsheetDoc.loadInfo()
        const sheet = feedbackSpreadsheetDoc.sheetsById[FEEDBACK_SHEET_ID]
        const result = await sheet.addRow(feedbackData)
        console.log(result)

        setLoading(false)
        setFeedbackData({})
        onClose()
      } catch (e) {
        console.error('Error: ', e)
      }
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
              options={roleOptions}
              selectedOption={roleOptions.find((option) => option.label === feedbackData.role)}
              onSelect={onSelectRole}
              onRemove={onRemoveRole}
            />
          </div>
          <div className={styles.column}>
            {locationType === WORKSPACE ||
              (locationType === HOME && (
                <Select
                  label={t('feedback.dataset', '---')}
                  options={datasetOptions}
                  selectedOption={datasetOptions.find(
                    (option) => option.label === feedbackData.dataset
                  )}
                  onSelect={onSelectDataset}
                  onRemove={onRemoveDataset}
                />
              ))}
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
