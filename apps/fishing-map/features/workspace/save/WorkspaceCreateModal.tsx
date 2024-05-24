import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { InputText, Button, Modal, SwitchRow, Select } from '@globalfishingwatch/ui-components'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
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
import styles from './WorkspaceSaveModal.module.css'
import { useSaveWorkspaceModalConnect } from './workspace-save.hooks'

type CreateWorkspaceModalProps = {
  title?: string
  isOpen: boolean
  onFinish?: (workspace: AppWorkspace) => void
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

function CreateWorkspaceModal({
  title,
  isOpen,
  onFinish,
  workspace,
  suggestName = true,
}: CreateWorkspaceModalProps) {
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
  const isDefaultWorkspace = useSelector(selectIsDefaultWorkspace)
  const containsPrivateDatasets = privateDatasets.length > 0

  const { dispatchWorkspaceModalOpen } = useSaveWorkspaceModalConnect('createWorkspace')

  const onClose = () => {
    dispatchWorkspaceModalOpen(false)
  }

  const isPublicWorkspace = workspace?.id?.includes(PUBLIC_SUFIX)
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const hasWorkspaceDefined =
    workspace !== null && urlWorkspaceId !== undefined && !isDefaultWorkspace
  const allowUpdate =
    !isGFWWorkspace &&
    hasWorkspaceDefined &&
    (isOwnerWorkspace || hasEditPermission) &&
    (isPublicWorkspace ? !containsPrivateDatasets : true)
  const initialCreateAsPublic = allowUpdate
    ? workspace?.id.includes(PUBLIC_SUFIX) || false
    : !containsPrivateDatasets
  const [createAsPublic, setCreateAsPublic] = useState(initialCreateAsPublic)

  useEffect(() => {
    const updateWorkspaceName = async () => {
      let workspaceName = workspace?.name
      if ((!hasWorkspaceDefined || !workspaceName) && suggestName) {
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

  const createWorkspace = async () => {
    // if (name) {
    //   setCreateLoading(true)
    //   const dispatchedAction = await dispatch(
    //     saveWorkspaceThunk({ workspace, name, createAsPublic })
    //   )
    //   if (saveWorkspaceThunk.fulfilled.match(dispatchedAction)) {
    //     const workspace = dispatchedAction.payload as AppWorkspace
    //     trackEvent({
    //       category: TrackCategory.WorkspaceManagement,
    //       action: 'Save current workspace',
    //       label: workspace?.name ?? 'Unknown',
    //     })
    //     setCreateLoading(false)
    //     if (onFinish) {
    //       onFinish(workspace)
    //     }
    //   } else {
    //     setCreateLoading(false)
    //     setError('Error saving workspace')
    //   }
    // }
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
        testId="create-workspace-input"
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <div>TODO: viewAcces + editAccess + password</div>
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
