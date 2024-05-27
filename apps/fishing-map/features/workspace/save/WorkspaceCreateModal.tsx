import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  InputText,
  Button,
  Modal,
  SwitchRow,
  Select,
  SelectOption,
} from '@globalfishingwatch/ui-components'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
  WorkspaceEditAccessType,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import {
  saveWorkspaceThunk,
  updatedCurrentWorkspaceThunk,
} from 'features/workspace/workspace.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectViewport } from 'features/app/selectors/app.viewport.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { PUBLIC_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { selectUserWorkspaceEditPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import {
  selectIsDefaultWorkspace,
  selectIsGFWWorkspace,
} from 'features/workspace/workspace.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/selectors/dataviews.selectors'
import { selectWorkspaceWithCurrentState } from 'features/app/selectors/app.workspace.selectors'
import styles from './WorkspaceSaveModal.module.css'
import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'
import { getEditAccessOptionsByViewAccess, getViewAccessOptions } from './workspace-access.utils'

type CreateWorkspaceModalProps = {
  title?: string
  isOpen: boolean
  onFinish?: (workspace: AppWorkspace) => void
  suggestName?: boolean
}

const formatTimerangeBoundary = (
  boundary: string | undefined,
  dateFormat: Intl.DateTimeFormatOptions
) => {
  if (!boundary) return ''
  return formatI18nDate(boundary, {
    format: dateFormat,
  }).replace(/[.,]/g, '')
}

function CreateWorkspaceModal({
  title,
  isOpen,
  onFinish,
  suggestName = true,
}: CreateWorkspaceModalProps) {
  const { t, i18n } = useTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [viewAccess, setViewAccess] = useState<WorkspaceViewAccessType>(WORKSPACE_PUBLIC_ACCESS)
  const [editAccess, setEditAccess] = useState<WorkspaceEditAccessType>(WORKSPACE_PRIVATE_ACCESS)
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useTimerangeConnect()
  const privateDatasets = useSelector(selectPrivateDatasetsInWorkspace)
  const workspace = useSelector(selectWorkspaceWithCurrentState)
  const containsPrivateDatasets = privateDatasets.length > 0

  const viewOptions = getViewAccessOptions()
  const editOptions = getEditAccessOptionsByViewAccess(viewAccess)
  const { dispatchWorkspaceModalOpen } = useSaveWorkspaceModalConnect('createWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  const [createAsPublic, setCreateAsPublic] = useState(!containsPrivateDatasets)

  useEffect(() => {
    const updateWorkspaceName = async () => {
      let workspaceName = workspace?.name
      if (!workspaceName && suggestName) {
        const areaName = await getOceanAreaName(viewport, {
          locale: i18n.language as OceanAreaLocale,
        })
        if (timerange.start && timerange.end) {
          const dateFormat = pickDateFormatByRange(
            timerange.start as string,
            timerange.end as string
          )
          const start = formatTimerangeBoundary(timerange.start, dateFormat)
          const end = formatTimerangeBoundary(timerange.end, dateFormat)
          workspaceName = `From ${start} to ${end} ${areaName ? `near ${areaName}` : ''}`
        } else {
          workspaceName = areaName
        }
      }
      if (workspaceName) {
        setName(workspaceName)
      }
    }
    if (isOpen) {
      updateWorkspaceName()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const getWorkspaceError = () => {
    if (!name) {
      return t('workspace.nameRequired', 'Workspace name is required')
    }
    if (viewAccess === WORKSPACE_PASSWORD_ACCESS || editAccess === WORKSPACE_PASSWORD_ACCESS) {
      if (!password) {
        return t('workspace.passwordRequired', 'Workspace password is required')
      }
      if (password.length < 5) {
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
        description,
        viewAccess,
        editAccess,
        createAsPublic,
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
          dispatchWorkspaceModalOpen(false)
          onFinish(workspace)
        }
      } else {
        setCreateLoading(false)
        setError('Error saving workspace')
      }
    }
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={title || t('workspace.save', 'Save the current workspace')}
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <InputText
        value={name}
        className={styles.input}
        testId="create-workspace-name"
        label={t('common.name', 'Name')}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <InputText
        value={description}
        className={styles.input}
        testId="create-workspace-input"
        label={t('common.description', 'Description')}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.row}>
        <Select
          options={viewOptions}
          direction="top"
          label={t('workspace.viewAccess', 'View access')}
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
              ? t('workspace.private', 'Private')
              : t('selects.placeholder', 'Select an option')
          }
          infoTooltip={
            viewAccess === WORKSPACE_PRIVATE_ACCESS
              ? t('workspace.privateEditAcessInfo', 'Private view workspace does not allow editing')
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
            label={t('common.password', 'password')}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>
      <SwitchRow
        label={t('workspace.uploadPublic', 'Allow other users to see this workspace')}
        active={createAsPublic}
        disabled={containsPrivateDatasets}
        tooltip={
          containsPrivateDatasets
            ? `${t(
                'workspace.uploadPublicDisabled',
                "This workspace can't be shared publicly because it contains private datasets"
              )}: ${privateDatasets.join(', ')}`
            : ''
        }
        onClick={() => setCreateAsPublic(!createAsPublic)}
      />
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          loading={createLoading}
          disabled={!name}
          onClick={createWorkspace}
          testId="create-workspace-button"
        >
          {t('workspace.create', 'Create as new workspace') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default CreateWorkspaceModal
