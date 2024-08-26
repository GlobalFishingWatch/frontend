import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, Select, SelectOption } from '@globalfishingwatch/ui-components'
import {
  Report,
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
  Workspace,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectReportAreaIds } from 'features/area-report/reports.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { createReportThunk, updateReportThunk } from 'features/area-report/reports.slice'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { AsyncError } from 'utils/async-slice'
import { getViewAccessOptions } from 'features/workspace/save/workspace-save.utils'
import styles from './NewReportModal.module.css'

type NewReportModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  onFinish?: (report: Report) => void
  report?: Report
}

function getWorkspaceReport(workspace: Workspace) {
  const { ownerId, createdAt, ownerType, viewAccess, editAccess, ...workspaceProperties } =
    workspace
  return workspaceProperties
}

function NewReportModal({ title, isOpen, onClose, onFinish, report }: NewReportModalProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reportAreaIds = useSelector(selectReportAreaIds)
  const reportArea = useSelector(selectDatasetAreaDetail(reportAreaIds))
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const privateDatasets = useSelector(selectPrivateDatasetsInWorkspace)
  const containsPrivateDatasets = privateDatasets.length > 0

  const [name, setName] = useState(report?.name || reportArea?.name || '')
  const [description, setDescription] = useState(report?.description || '')
  const [error, setError] = useState('')

  const viewOptions = getViewAccessOptions().filter((o) => o.id !== WORKSPACE_PASSWORD_ACCESS)
  const [viewAccess, setViewAccess] = useState<WorkspaceViewAccessType>(
    containsPrivateDatasets ? WORKSPACE_PRIVATE_ACCESS : WORKSPACE_PUBLIC_ACCESS
  )
  const [loading, setLoading] = useState(false)

  const isEditing = report?.id !== undefined

  const updateReport = async () => {
    if (report) {
      setLoading(true)
      const workspaceReport = getWorkspaceReport(workspace)
      const dispatchedAction = await dispatch(
        updateReportThunk({ ...report, name, description, workspace: workspaceReport })
      )
      if (updateReportThunk.fulfilled.match(dispatchedAction)) {
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Edit current report',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setLoading(false)
        if (onFinish) {
          onFinish(dispatchedAction.payload)
        }
      } else {
        setLoading(false)
        setError('Error updating report')
      }
    }
  }

  const createReport = async () => {
    if (name) {
      setLoading(true)
      const workspaceReport = getWorkspaceReport(workspace)
      const dispatchedAction = await dispatch(
        createReportThunk({
          name,
          description,
          datasetId: reportAreaIds?.datasetId,
          areaId: reportAreaIds?.areaId?.toString(),
          workspace: workspaceReport,
          public: viewAccess === WORKSPACE_PUBLIC_ACCESS,
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
      title={
        report?.id
          ? t('analysis.editTitle', 'Edit report')
          : t('analysis.saveTitle', 'Save the current report')
      }
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <InputText
        value={name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <InputText
        value={description}
        label={t('common.description', 'Description')}
        className={styles.input}
        onChange={(e) => setDescription(e.target.value)}
      />
      {!report?.id && (
        <Select
          options={viewOptions}
          direction="top"
          label={t('workspace.viewAccess', 'View access')}
          disabled={containsPrivateDatasets}
          infoTooltip={
            containsPrivateDatasets
              ? `${t(
                  'workspace.uploadPublicDisabled',
                  "This workspace can't be shared publicly because it contains private datasets"
                )}: ${privateDatasets.join(', ')}`
              : ''
          }
          containerClassName={styles.input}
          onSelect={(option: SelectOption<WorkspaceViewAccessType>) => setViewAccess(option.id)}
          selectedOption={viewOptions.find((o) => o.id === viewAccess) || viewOptions[0]}
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
