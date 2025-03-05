import { Fragment,useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import type { Workspace } from '@globalfishingwatch/api-types'
import { DataviewType , WORKSPACE_PRIVATE_ACCESS, WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'
import { Button, InputText, Modal, Select } from '@globalfishingwatch/ui-components'

import {
  AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX,
  PATH_BASENAME,
  ROOT_DOM_ELEMENT,
} from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectActiveDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectUserGroupsClean } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser,selectUserData } from 'features/user/selectors/user.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { parseUpsertWorkspace } from 'features/workspace/workspace.utils'
import { createWorkspaceThunk } from 'features/workspaces-list/workspaces-list.slice'

import styles from './FeedbackModal.module.css'

type FeedbackModalProps = {
  isOpen?: boolean
  onClose: () => void
}

type FeedbackData = {
  date: string
  userAgent: string
  resolution: string
  url?: string
  userId?: number | typeof GUEST_USER_TYPE
  name?: string
  email?: string
  organization?: string
  groups?: string
  role?: string
  feedbackType?: string
  issue?: string
  description?: string
}

const FEEDBACK_ROLE_IDS = [
  'analyst',
  'fisheries',
  'general',
  'journalist',
  'navy',
  'ngo',
  'scientist',
  'student',
  'watch',
  'GFW',
  'other',
]

const FEEDBACK_FEATURE_IDS = [
  'activityLayers',
  'vesselTracks',
  'vesselSearch',
  'environmentLayers',
  'referenceLayers',
  'timebar',
  'analysis',
  'other',
]

function FeedbackModal({ isOpen = false, onClose }: FeedbackModalProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const activeDataviews = useSelector(selectActiveDataviews)
  const userData = useSelector(selectUserData)
  const [loading, setLoading] = useState(false)
  const [suficientData, setSuficientData] = useState(false)
  const userGroups = useSelector(selectUserGroupsClean)
  const guestUser = useSelector(selectIsGuestUser)
  const currentWorkspace = useSelector(selectWorkspaceWithCurrentState)

  const initialFeedbackState = {
    date: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
    resolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}px` : '',
  }

  const [feedbackData, setFeedbackData] = useState<FeedbackData>(initialFeedbackState)
  const setInitialFeedbackStateWithUserData = () => {
    setFeedbackData({
      ...initialFeedbackState,
      ...(!guestUser &&
        userData && {
          userId: userData.id,
          email: userData.email,
          name: `${userData.firstName} ${userData.lastName}`,
          groups: (userGroups || []).join(', '),
          organization: userData.organization || '',
        }),
    })
  }

  useEffect(() => {
    setInitialFeedbackStateWithUserData()
  }, [userData])

  useEffect(() => {
    const { description } = feedbackData
    const hasSuficientData = description !== undefined && description !== ''
    setSuficientData(hasSuficientData)
  }, [feedbackData])

  const issuesOption = {
    id: 'issues',
    label: t('feedback.issues', 'Platform Issues'),
  }
  const datasetOptions = activeDataviews.flatMap((dataview) => {
    if (dataview.config?.type === DataviewType.HeatmapAnimated) {
      const sourcesInDataview = getSourcesSelectedInDataview(dataview)
      return sourcesInDataview.map((source) => {
        const dataset = { id: source.id, name: source.label }
        return {
          id: `Data: ${source.id}`,
          label: `Data: ${getDatasetLabel(dataset)}`,
        }
      })
    } else {
      const dataset = dataview.datasets?.[0]
      return {
        id: `Data: ${dataview.id}`,
        label: `Data: ${dataset ? getDatasetLabel(dataset) : dataview.name}`,
      }
    }
  })
  const allFeedbackTypeOptions = [issuesOption, ...datasetOptions]

  const roleOptions = FEEDBACK_ROLE_IDS.map((roleId) => ({
    id: roleId,
    label: t(`feedback.roles.${roleId}` as any),
  }))

  const featureOptions = FEEDBACK_FEATURE_IDS.map((featureId) => ({
    id: featureId,
    label: t(`feedback.features.${featureId}` as any),
  }))

  const onFieldChange = (field: keyof FeedbackData, value: string) => {
    const shouldResetType = field === 'feedbackType' && value !== issuesOption.id

    setFeedbackData({
      ...feedbackData,
      [field]: value,
      ...(shouldResetType && { issue: '' }),
    })
  }

  const sendFeedback = async (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      let url = window.location.href

      if (guestUser) {
        const createWorkspaceAction = await dispatch(
          createWorkspaceThunk({
            ...parseUpsertWorkspace(currentWorkspace),
            name: `${AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX}-${Date.now()}`,
            viewAccess: WORKSPACE_PUBLIC_ACCESS,
            editAccess: WORKSPACE_PRIVATE_ACCESS,
          })
        )

        if (createWorkspaceThunk.fulfilled.match(createWorkspaceAction)) {
          const workspace = createWorkspaceAction.payload as Workspace
          url = window.location.origin + PATH_BASENAME + `/${workspace?.category}/${workspace?.id}`
        } else {
          console.error('Error creating feedback workspace, using default url to feedback sheet.')
        }
      }
      const finalFeedbackData = {
        ...feedbackData,
        url,
        userId: feedbackData.userId || GUEST_USER_TYPE,
      }

      const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'feedback', data: finalFeedbackData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
      setLoading(false)
      setInitialFeedbackStateWithUserData()
      onClose()
    } catch (e: any) {
      setLoading(false)
      console.error('Error: ', e)
    }
  }

  const showDescription =
    (feedbackData.feedbackType && feedbackData.feedbackType !== issuesOption.id) ||
    feedbackData.issue

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('common.feedback', 'Feedback')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.column}>
            {guestUser && (
              <Fragment>
                <InputText
                  value={feedbackData.name || ''}
                  placeholder={t('common.name', 'Name')}
                  onChange={({ target }) => onFieldChange('name', target.value)}
                />
                <InputText
                  value={feedbackData.email || ''}
                  placeholder={t('feedback.email', 'E-mail address')}
                  onChange={({ target }) => onFieldChange('email', target.value)}
                />
                <span className={styles.emailDisclaimer}>
                  {t(
                    'feedback.emailDisclaimer',
                    'We will only email you in relation to this feedback'
                  )}
                </span>
              </Fragment>
            )}
            <Select
              label={t('feedback.role', 'Role')}
              placeholder={t('selects.placeholder', 'Select an option')}
              options={roleOptions}
              selectedOption={roleOptions.find((option) => option.id === feedbackData.role)}
              onSelect={(option) => onFieldChange('role', option.id)}
              onRemove={() => onFieldChange('role', '')}
            />
            {feedbackData.role && (
              <Select
                label={t('feedback.type', 'What are you providing feedback for?')}
                placeholder={t('selects.placeholder', 'Select an option')}
                options={allFeedbackTypeOptions}
                selectedOption={allFeedbackTypeOptions.find(
                  (option) => option.id === feedbackData.feedbackType
                )}
                onSelect={(option) => onFieldChange('feedbackType', option.id)}
                onRemove={() => onFieldChange('feedbackType', '')}
              />
            )}
            {feedbackData.feedbackType === issuesOption.id && (
              <Select
                label={t('feedback.whatIssue', 'Where are you having an issue?')}
                placeholder={t('selects.placeholder', 'Select an option')}
                options={featureOptions}
                selectedOption={featureOptions.find((option) => option.id === feedbackData.issue)}
                onSelect={(option) => onFieldChange('issue', option.id)}
                onRemove={() => onFieldChange('issue', '')}
              />
            )}
          </div>
          {showDescription && (
            <div className={styles.column}>
              <label>{t('common.description', 'Description')}</label>
              <textarea
                onChange={({ target }) => onFieldChange('description', target.value)}
                value={feedbackData.description || ''}
                className={styles.textarea}
                placeholder={t(
                  'feedback.descriptionPlaceholder',
                  'Please be as specific as possible.'
                )}
              ></textarea>
            </div>
          )}
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
            className={styles.cta}
          >
            {t('feedback.send', 'Send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
