import { ChangeEvent, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, Select, SelectOption } from '@globalfishingwatch/ui-components'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
  WorkspaceEditAccessType,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import { saveWorkspaceThunk } from 'features/workspace/workspace.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import { MIN_WORKSPACE_PASSWORD_LENGTH } from '../workspace.utils'
import styles from './WorkspaceSaveModal.module.css'
import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'
import {
  WorkspaceTimeRangeMode,
  getEditAccessOptionsByViewAccess,
  getTimeRangeOptions,
  getUpdateNameWithDynamicTimerange,
  getUpdateNameWithStaticTimerange,
  getViewAccessOptions,
  getWorkspaceTimerangeName,
} from './workspace-access.utils'

export const DEFAULT_DAYS_FROM_LATEST = 30
export const DAYS_FROM_LATEST_MIN = 1
export const DAYS_FROM_LATEST_MAX = 100

type CreateWorkspaceModalProps = {
  title?: string
  onFinish?: (workspace: AppWorkspace) => void
}

function CreateWorkspaceModal({ title, onFinish }: CreateWorkspaceModalProps) {
  const { t, i18n } = useTranslation()
  const [error, setError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useTimerangeConnect()
  const privateDatasets = useSelector(selectPrivateDatasetsInWorkspace)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const containsPrivateDatasets = privateDatasets.length > 0

  const [name, setName] = useState('')
  const [hasWorkspaceNameChanged, setHasWorkspaceNameChanged] = useState(false)
  const [viewAccess, setViewAccess] = useState<WorkspaceViewAccessType>(
    containsPrivateDatasets ? WORKSPACE_PRIVATE_ACCESS : WORKSPACE_PUBLIC_ACCESS
  )
  const [editAccess, setEditAccess] = useState<WorkspaceEditAccessType>(WORKSPACE_PRIVATE_ACCESS)
  const [password, setPassword] = useState<string>('')

  const viewOptions = getViewAccessOptions()
  const editOptions = getEditAccessOptionsByViewAccess(viewAccess)
  const timeRangeOptions = getTimeRangeOptions(timerange.start, timerange.end)
  const [timeRangeOption, setTimeRangeOption] = useState(timeRangeOptions[0].id)
  const [daysFromLatest, setDaysFromLatest] = useState<number>()
  const validDaysFromLatestValue =
    timeRangeOption === 'dynamic'
      ? daysFromLatest !== undefined &&
        daysFromLatest > DAYS_FROM_LATEST_MIN &&
        daysFromLatest < DAYS_FROM_LATEST_MAX
      : true

  const { workspaceModalOpen, dispatchWorkspaceModalOpen } =
    useSaveWorkspaceModalConnect('createWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    if (!hasWorkspaceNameChanged) {
      setHasWorkspaceNameChanged(true)
    }
  }

  const onDaysFromLatestChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newDaysFromLatest = parseInt(event.target.value)
    if (newDaysFromLatest >= DAYS_FROM_LATEST_MIN && newDaysFromLatest <= DAYS_FROM_LATEST_MAX) {
      setDaysFromLatest(newDaysFromLatest)
    } else if (!newDaysFromLatest) {
      setDaysFromLatest('' as any)
    }
    updateNameWithDynamicTimerange({
      name,
      timerange,
      timeRangeOption,
      prevDaysFromLatest: daysFromLatest as number,
      newDaysFromLatest,
    })
  }

  const setDefaultWorkspaceName = async () => {
    let workspaceName = workspace?.name
    if (!workspaceName) {
      const areaName = await getOceanAreaName(viewport, {
        locale: i18n.language as OceanAreaLocale,
      })
      const workspaceTimerangeName = getWorkspaceTimerangeName(timeRangeOption, {
        timerange,
        daysFromLatest,
      })

      if (workspaceTimerangeName) {
        workspaceName = `${workspaceTimerangeName} ${areaName ? `near ${areaName}` : ''}`
      } else {
        workspaceName = areaName
      }
    }
    if (workspaceName) {
      setName(workspaceName)
    }
  }

  const updateNameWithDynamicTimerange = ({
    name,
    timerange,
    timeRangeOption,
    prevDaysFromLatest,
    newDaysFromLatest,
  }: {
    name: string
    timerange: { start: string; end: string }
    timeRangeOption: WorkspaceTimeRangeMode
    prevDaysFromLatest: number
    newDaysFromLatest: number
  }) => {
    const newName = getUpdateNameWithDynamicTimerange({
      name,
      timerange,
      timeRangeOption,
      prevDaysFromLatest,
      newDaysFromLatest,
    })
    setName(newName)
  }

  const updateNameWithStaticTimerange = ({
    name,
    timeRangeOption,
    daysFromLatest,
    timerange,
  }: {
    name: string
    timeRangeOption: WorkspaceTimeRangeMode
    daysFromLatest?: number
    timerange: { start: string; end: string }
  }) => {
    const newName = getUpdateNameWithStaticTimerange({
      name,
      timeRangeOption,
      daysFromLatest,
      timerange,
    })
    setName(newName)
  }

  useEffect(() => {
    if (containsPrivateDatasets) {
      setViewAccess(WORKSPACE_PRIVATE_ACCESS)
    }
  }, [containsPrivateDatasets])

  useEffect(() => {
    if (workspaceModalOpen) {
      setDefaultWorkspaceName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceModalOpen])

  const getWorkspaceError = () => {
    if (!name) {
      return t('workspace.nameRequired', 'Workspace name is required')
    }
    if (viewAccess === WORKSPACE_PASSWORD_ACCESS || editAccess === WORKSPACE_PASSWORD_ACCESS) {
      if (!password) {
        return t('workspace.passwordRequired', 'Workspace password is required')
      }
      if (password.length < MIN_WORKSPACE_PASSWORD_LENGTH) {
        return t('workspace.passwordMinLength', 'Password must be at least 5 characters')
      }
    }
    return ''
  }

  const createWorkspace = async () => {
    const workspaceError = getWorkspaceError()
    if (workspaceError) {
      setError(workspaceError)
    } else {
      setCreateLoading(true)
      const properties = {
        name,
        description: '',
        daysFromLatest,
        viewAccess,
        editAccess,
        createAsPublic: viewAccess !== WORKSPACE_PRIVATE_ACCESS,
        password,
      }
      const dispatchedAction = await dispatch(saveWorkspaceThunk({ workspace, properties }))
      if (saveWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        const workspace = dispatchedAction.payload as AppWorkspace
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Save current workspace',
          label: workspace?.name ?? 'Unknown',
        })
        setCreateLoading(false)
        if (onFinish) {
          onFinish(workspace)
        }
        onClose()
      } else {
        setCreateLoading(false)
        setError('Error saving workspace')
      }
    }
  }

  const handleSelectTimeRangeOption = (option: SelectOption<WorkspaceTimeRangeMode>) => {
    if (option.id === 'static') {
      setDaysFromLatest(undefined)
      updateNameWithStaticTimerange({ name, timeRangeOption, timerange, daysFromLatest })
    } else if (option.id === 'dynamic') {
      setDaysFromLatest(DEFAULT_DAYS_FROM_LATEST)
      updateNameWithDynamicTimerange({
        name,
        timerange,
        timeRangeOption,
        prevDaysFromLatest: daysFromLatest || 0,
        newDaysFromLatest: DEFAULT_DAYS_FROM_LATEST,
      })
    }
    setTimeRangeOption(option.id)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    createWorkspace()
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t('workspace.save', 'Save the current workspace')}
      isOpen={workspaceModalOpen}
      shouldCloseOnEsc
      className={styles.modalContentWrapper}
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputText
            value={name}
            className={styles.input}
            testId="create-workspace-name"
            label={t('common.name', 'Name')}
            onChange={onNameChange}
            autoFocus
          />
        </div>
        <div className={styles.row}>
          <Select
            options={timeRangeOptions}
            label={t('common.timerange', 'Time range')}
            containerClassName={styles.select}
            onSelect={handleSelectTimeRangeOption}
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
            containerClassName={styles.select}
            onSelect={(option: SelectOption<WorkspaceViewAccessType>) => setViewAccess(option.id)}
            selectedOption={viewOptions.find((o) => o.id === viewAccess) || viewOptions[0]}
          />
          <Select
            options={editOptions}
            direction="top"
            label={t('workspace.editAccess', 'Edit access')}
            placeholder={
              viewAccess === WORKSPACE_PRIVATE_ACCESS
                ? t('common.onlyMe', 'Only me')
                : t('selects.placeholder', 'Select an option')
            }
            infoTooltip={
              viewAccess === WORKSPACE_PRIVATE_ACCESS
                ? t(
                    'workspace.privateEditAcessInfo',
                    'Your current view access permissions do not allow for others to edit this workspace'
                  )
                : ''
            }
            disabled={viewAccess === WORKSPACE_PRIVATE_ACCESS}
            containerClassName={styles.select}
            onSelect={(option: SelectOption<WorkspaceEditAccessType>) => setEditAccess(option.id)}
            selectedOption={editOptions.find((o) => o.id === editAccess) || editOptions[0]}
          />
          {(viewAccess === WORKSPACE_PASSWORD_ACCESS ||
            (viewAccess !== WORKSPACE_PRIVATE_ACCESS &&
              editAccess === WORKSPACE_PASSWORD_ACCESS)) && (
            <InputText
              value={password}
              className={styles.select}
              type="password"
              testId="create-workspace-password"
              label={t('common.setNewPassword', 'Set a new password')}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>
        <div className={styles.footer}>
          {error && <p className={styles.error}>{error}</p>}
          <Button
            loading={createLoading}
            disabled={!name || !validDaysFromLatestValue}
            htmlType="submit"
            testId="create-workspace-button"
          >
            {t('workspace.create', 'Create as new workspace') as string}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateWorkspaceModal
