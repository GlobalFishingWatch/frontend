import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, SwitchRow } from '@globalfishingwatch/ui-components'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import { Workspace } from '@globalfishingwatch/api-types'
import {
  saveWorkspaceThunk,
  updatedCurrentWorkspaceThunk,
} from 'features/workspace/workspace.slice'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectViewport } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { PUBLIC_SUFIX, ROOT_DOM_ELEMENT } from 'data/config'
import { selectUserData } from 'features/user/user.slice'
import { selectUserWorkspaceEditPermissions } from 'features/user/user.selectors'
import { selectWorkspaceId } from 'routes/routes.selectors'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { selectIsGFWWorkspace } from 'features/workspace/workspace.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectPrivateDatasetsInWorkspace } from 'features/dataviews/dataviews.selectors'
import styles from './NewWorkspaceModal.module.css'

type NewWorkspaceModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  onFinish?: (workspace: Workspace) => void
  workspace: AppWorkspace
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

function NewWorkspaceModal({
  title,
  isOpen,
  onClose,
  onFinish,
  workspace,
  suggestName = true,
}: NewWorkspaceModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useTimerangeConnect()
  const userData = useSelector(selectUserData)
  const isGFWWorkspace = useSelector(selectIsGFWWorkspace)
  const urlWorkspaceId = useSelector(selectWorkspaceId)
  const hasEditPermission = useSelector(selectUserWorkspaceEditPermissions)
  const privateDatasets = useSelector(selectPrivateDatasetsInWorkspace)
  const containsPrivateDatasets = privateDatasets.length > 0

  const isDefaultWorkspace = workspace?.id === DEFAULT_WORKSPACE_ID
  const isPublicWorkspace = workspace?.id?.includes(PUBLIC_SUFIX)
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const hasWorkspaceDefined =
    workspace !== null && urlWorkspaceId !== undefined && !isDefaultWorkspace
  const allowUpdate =
    !isGFWWorkspace &&
    hasWorkspaceDefined &&
    (isOwnerWorkspace || hasEditPermission) &&
    (isPublicWorkspace ? !containsPrivateDatasets : true)
  const showOverWriteWarning = hasWorkspaceDefined && !isOwnerWorkspace && hasEditPermission
  const initialCreateAsPublic = allowUpdate
    ? workspace?.id.includes(PUBLIC_SUFIX) || false
    : !containsPrivateDatasets
  const [createAsPublic, setCreateAsPublic] = useState(initialCreateAsPublic)
  const visibilityChanged = allowUpdate ? createAsPublic !== initialCreateAsPublic : false

  useEffect(() => {
    if (isOpen) {
      let workspaceName = workspace?.name
      if ((!hasWorkspaceDefined || !workspaceName) && suggestName) {
        const areaName = getOceanAreaName(viewport, { locale: i18n.language as OceanAreaLocale })
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const updateWorkspace = async () => {
    if (workspace) {
      setUpdateLoading(true)
      const dispatchedAction = await dispatch(updatedCurrentWorkspaceThunk({ ...workspace, name }))
      if (updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Edit current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setUpdateLoading(false)
        if (onFinish) {
          onFinish(dispatchedAction.payload)
        }
      } else {
        setUpdateLoading(false)
        setError('Error updating workspace')
      }
    }
  }

  const createWorkspace = async () => {
    if (name) {
      setCreateLoading(true)
      const dispatchedAction = await dispatch(
        saveWorkspaceThunk({ workspace, name, createAsPublic })
      )
      if (saveWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        const workspace = dispatchedAction.payload as Workspace
        trackEvent({
          category: TrackCategory.WorkspaceManagement,
          action: 'Save current workspace',
          label: workspace?.name ?? 'Unknown',
        })
        setCreateLoading(false)
        if (onFinish) {
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
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      {workspace?.id && (
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
      )}
      {showOverWriteWarning && allowUpdate && (
        <div className={styles.adminWarning}>
          <p>You are not the creator of this workspace and clicking SAVE will overwrite it</p>
          <p>⚠️ With admin power comes admin responsability (B.Parker)</p>
        </div>
      )}
      <div className={styles.footer}>
        {allowUpdate && (
          <Button
            loading={updateLoading}
            disabled={!name || visibilityChanged}
            tooltip={
              visibilityChanged
                ? t(
                    'workspace.createNeeded',
                    'Changing workspace visibility requires creating a new one'
                  )
                : ''
            }
            onClick={updateWorkspace}
          >
            {t('workspace.update', 'Update workspace') as string}
          </Button>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <Button loading={createLoading} disabled={!name} onClick={createWorkspace}>
          {t('workspace.create', 'Create as new workspace') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default NewWorkspaceModal
