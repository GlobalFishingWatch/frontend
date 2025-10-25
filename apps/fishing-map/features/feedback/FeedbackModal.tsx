import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'
import type { Report, Workspace } from '@globalfishingwatch/api-types'
import {
  DataviewType,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
} from '@globalfishingwatch/api-types'
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
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import { createReportThunk } from 'features/reports/reports.slice'
import { getWorkspaceReport } from 'features/reports/shared/new-report-modal/NewAreaReportModal'
import { selectUserGroupsClean } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGuestUser, selectUserData } from 'features/user/selectors/user.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { parseUpsertWorkspace } from 'features/workspace/workspace.utils'
import { createWorkspaceThunk } from 'features/workspaces-list/workspaces-list.slice'
import { selectIsAnyAreaReportLocation, selectIsWorkspaceLocation } from 'routes/routes.selectors'

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
  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const reportAreaIds = useSelector(selectReportAreaIds)

  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)

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
    label: t('feedback.issues'),
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
      const name = `${AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX}-${Date.now()}`
      if (!guestUser) {
        let createDispatchedAction
        if (isWorkspaceLocation) {
          createDispatchedAction = await dispatch(
            createWorkspaceThunk({
              ...parseUpsertWorkspace(currentWorkspace),
              name,
              viewAccess: WORKSPACE_PUBLIC_ACCESS,
              editAccess: WORKSPACE_PRIVATE_ACCESS,
            })
          )
        } else if (isAreaReportLocation && reportAreaIds) {
          const workspaceReport = getWorkspaceReport(currentWorkspace)
          createDispatchedAction = await dispatch(
            createReportThunk({
              name,
              datasetId: reportAreaIds?.datasetId,
              areaId: reportAreaIds?.areaId?.toString(),
              workspace: workspaceReport,
              public: true,
            })
          )
        }
        if (
          createDispatchedAction &&
          (createWorkspaceThunk.fulfilled.match(createDispatchedAction) ||
            createReportThunk.fulfilled.match(createDispatchedAction))
        ) {
          const workspace = createDispatchedAction.payload as Workspace | Report['workspace']
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
      title={t('common.feedback')}
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
                  placeholder={t('common.name')}
                  onChange={({ target }) => onFieldChange('name', target.value)}
                />
                <InputText
                  value={feedbackData.email || ''}
                  placeholder={t('feedback.email')}
                  onChange={({ target }) => onFieldChange('email', target.value)}
                />
                <span className={styles.emailDisclaimer}>{t('feedback.emailDisclaimer')}</span>
              </Fragment>
            )}
            <Select
              label={t('feedback.role')}
              placeholder={t('selects.placeholder')}
              options={roleOptions}
              selectedOption={roleOptions.find((option) => option.id === feedbackData.role)}
              onSelect={(option) => onFieldChange('role', option.id)}
              onRemove={() => onFieldChange('role', '')}
            />
            {feedbackData.role && (
              <Select
                label={t('feedback.type')}
                placeholder={t('selects.placeholder')}
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
                label={t('feedback.whatIssue')}
                placeholder={t('selects.placeholder')}
                options={featureOptions}
                selectedOption={featureOptions.find((option) => option.id === feedbackData.issue)}
                onSelect={(option) => onFieldChange('issue', option.id)}
                onRemove={() => onFieldChange('issue', '')}
              />
            )}
          </div>
          {showDescription && (
            <div className={styles.column}>
              <label>{t('common.description')}</label>
              <textarea
                onChange={({ target }) => onFieldChange('description', target.value)}
                value={feedbackData.description || ''}
                className={styles.textarea}
                placeholder={t('feedback.descriptionPlaceholder')}
              ></textarea>
            </div>
          )}
        </div>

        <p className={styles.intro}>{t('feedback.intro')}</p>
        <div className={styles.footer}>
          <Button
            tooltip={!suficientData ? t('feedback.insuficientData') : ''}
            disabled={loading || !suficientData}
            onClick={sendFeedback}
            loading={loading}
            className={styles.cta}
          >
            {t('feedback.send')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default FeedbackModal
