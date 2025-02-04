import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Report, Workspace, WorkspaceViewAccessType } from '@globalfishingwatch/api-types'
import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
} from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Button, InputText, Modal, Select } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { selectDatasetAreaDetail } from 'features/areas/areas.slice'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportAreaIds } from 'features/reports/report-area/area-reports.selectors'
import { createReportThunk, updateReportThunk } from 'features/reports/reports.slice'
import { useSaveWorkspaceTimerange } from 'features/workspace/save/workspace-save.hooks'
import type { WorkspaceTimeRangeMode } from 'features/workspace/save/workspace-save.utils'
import {
  DAYS_FROM_LATEST_MAX,
  DAYS_FROM_LATEST_MIN,
  getViewAccessOptions,
} from 'features/workspace/save/workspace-save.utils'
import type { WorkspaceState } from 'types'
import type { AsyncError } from 'utils/async-slice'

import styles from './NewAreaReportModal.module.css'

export function getWorkspaceReport(workspace: Workspace<WorkspaceState>, daysFromLatest?: number) {
  const { ownerId, createdAt, ownerType, viewAccess, editAccess, state, ...workspaceProperties } =
    workspace

  return { ...workspaceProperties, state: { ...state, daysFromLatest } }
}

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
  const containsPrivateDatasets = privateDatasets.length > 0

  const [name, setName] = useState(report?.name || reportArea?.name || '')
  const [description, setDescription] = useState(report?.description || '')
  const [error, setError] = useState('')

  const viewOptions = getViewAccessOptions().filter((o) => o.id !== WORKSPACE_PASSWORD_ACCESS)
  const [viewAccess, setViewAccess] = useState<WorkspaceViewAccessType>(
    containsPrivateDatasets ? WORKSPACE_PRIVATE_ACCESS : WORKSPACE_PUBLIC_ACCESS
  )
  const {
    timeRangeOptions,
    timeRangeOption,
    daysFromLatest,
    handleDaysFromLatestChange,
    handleTimeRangeChange,
  } = useSaveWorkspaceTimerange(workspace)
  const [loading, setLoading] = useState(false)

  const isEditing = report?.id !== undefined

  const updateReport = async (event: any) => {
    event.preventDefault()
    if (report) {
      setLoading(true)
      const workspaceReport = getWorkspaceReport(
        workspace,
        timeRangeOption === 'dynamic' ? daysFromLatest : undefined
      )
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

  const createReport = async (event: any) => {
    event.preventDefault()
    if (name) {
      setLoading(true)
      const workspaceReport = getWorkspaceReport(
        workspace,
        timeRangeOption === 'dynamic' ? daysFromLatest : undefined
      )
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

  const onDaysFromLatestChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newName = handleDaysFromLatestChange(event, name)
    if (newName !== name) {
      setName(newName)
    }
  }

  const onSelectTimeRangeChange = (option: SelectOption<WorkspaceTimeRangeMode>) => {
    const newName = handleTimeRangeChange(option, name)
    if (newName !== name) {
      setName(newName)
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
      <form onSubmit={isEditing ? updateReport : createReport}>
        <div className={styles.row}>
          <InputText
            value={name}
            label={t('common.name', 'Name')}
            className={styles.input}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.row}>
          <InputText
            value={description}
            label={t('common.description', 'Description')}
            className={styles.input}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <Select
            options={timeRangeOptions}
            label={t('common.timerange', 'Time range')}
            direction="top"
            containerClassName={styles.select}
            onSelect={onSelectTimeRangeChange}
            selectedOption={
              timeRangeOptions.find((o) => o.id === timeRangeOption) || timeRangeOptions[0]
            }
          />
          {timeRangeOption === 'dynamic' && (
            <InputText
              value={daysFromLatest}
              type="number"
              className={styles.select}
              label={t('common.timerangeDaysFromLatest', 'Days from latest data update (1-100)')}
              onChange={onDaysFromLatestChange}
              min={DAYS_FROM_LATEST_MIN}
              max={DAYS_FROM_LATEST_MAX}
            />
          )}
        </div>
        {!report?.id && (
          <div className={styles.row}>
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
          </div>
        )}
        <div className={styles.footer}>
          {error && <p className={styles.error}>{error}</p>}
          <Button loading={loading} disabled={!name} htmlType="submit">
            {isEditing ? t('common.update', 'Update') : t('common.save', 'Save')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default NewReportModal
