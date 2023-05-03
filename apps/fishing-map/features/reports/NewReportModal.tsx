import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, SwitchRow } from '@globalfishingwatch/ui-components'
import { Report } from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportAreaIds } from 'features/reports/reports.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { createReportThunk, updateReportThunk } from 'features/reports/reports.slice'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/dataviews.selectors'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { selectWorkspaceWithCurrentState } from 'features/app/app.selectors'
import { AsyncError } from 'utils/async-slice'
import styles from './NewReportModal.module.css'

type NewReportModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  onFinish?: (report: Report) => void
  report?: Report
}

function NewReportModal({ title, isOpen, onClose, onFinish, report }: NewReportModalProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const privateDatasets = useSelector(selectPrivateDatasetsInWorkspace)

  const [name, setName] = useState(report?.name || reportArea?.name || '')
  const [error, setError] = useState('')
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const [loading, setLoading] = useState(false)

  const containsPrivateDatasets = privateDatasets.length > 0
  const isEditing = report?.id !== undefined

  const updateReport = async () => {
    if (report) {
      setLoading(true)
      const dispatchedAction = await dispatch(updateReportThunk({ ...report, name, workspace }))
      if (updateReportThunk.fulfilled.match(dispatchedAction)) {
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Edit current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setLoading(false)
        if (onFinish) {
          onFinish(dispatchedAction.payload)
        }
      } else {
        setLoading(false)
        setError('Error updating workspace')
      }
    }
  }

  const createReport = async () => {
    if (name) {
      setLoading(true)
      const { ownerId, createdAt, ownerType, ...workspaceProperties } = workspace
      const dispatchedAction = await dispatch(
        createReportThunk({
          name,
          description: '',
          datasetId: reportAreaIds?.datasetId,
          areaId: reportAreaIds?.areaId?.toString(),
          workspace: workspaceProperties,
          public: createAsPublic,
        })
      )
      if (createReportThunk.fulfilled.match(dispatchedAction)) {
        const report = dispatchedAction.payload as Report
        trackEvent({
          category: TrackCategory.Analysis,
          action: 'Save current report',
          label: name || 'Unknown',
        })
        setLoading(false)
        if (onFinish) {
          onFinish(report)
        }
      } else {
        const error = dispatchedAction.payload || ({} as AsyncError)
        setLoading(false)
        setError(
          error.status === 422 && error.message?.includes('duplicated')
            ? t('analysis.errorDuplicatedName', 'There is already a report with the same name')
            : t('analysis.errorMessage', 'Something went wrong')
        )
      }
    }
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t('analysis.saveTitle', 'Save the current report')}
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <InputText
        inputSize="small"
        value={name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      {!report?.id && (
        <SwitchRow
          label={t('analysis.savePublic', 'Allow other users to see this report')}
          active={createAsPublic}
          disabled={containsPrivateDatasets}
          tooltip={
            containsPrivateDatasets
              ? `${t(
                  'analysis.savePublicDisabled',
                  "This workspace can't be shared publicly because it contains private datasets"
                )}: ${privateDatasets.join(', ')}`
              : ''
          }
          onClick={() => setCreateAsPublic(!createAsPublic)}
        />
      )}
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          loading={loading}
          disabled={!name}
          onClick={isEditing ? updateReport : createReport}
        >
          {isEditing ? t('common.update', 'Update') : t('common.save', 'Save')}
        </Button>
      </div>
    </Modal>
  )
}

export default NewReportModal
