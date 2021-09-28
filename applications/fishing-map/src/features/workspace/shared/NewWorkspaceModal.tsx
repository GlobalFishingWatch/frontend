import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import InputText from '@globalfishingwatch/ui-components/src/input-text'
import Button from '@globalfishingwatch/ui-components/src/button'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import Modal from '@globalfishingwatch/ui-components/src/modal'
import SwitchRow from '@globalfishingwatch/ui-components/src/switch-row'
import {
  saveCurrentWorkspaceThunk,
  updatedCurrentWorkspaceThunk,
} from 'features/workspace/workspace.slice'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectCustomWorkspace, selectViewport } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import { PRIVATE_SUFIX, PUBLIC_SUFIX } from 'data/config'
import { selectDataviewInstancesMerged } from 'features/dataviews/dataviews.selectors'
import { selectUserData } from 'features/user/user.slice'
import { selectUserWorkspaceEditPermissions } from 'features/user/user.selectors'
import styles from './NewWorkspaceModal.module.css'

type NewWorkspaceModalProps = {
  isOpen: boolean
  onClose: () => void
  onFinish?: () => void
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

function NewWorkspaceModal({ isOpen, onClose, onFinish }: NewWorkspaceModalProps) {
  const [name, setName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useTimerangeConnect()
  const userData = useSelector(selectUserData)
  const workspace = useSelector(selectWorkspace)
  const currentWorkspace = useSelector(selectCustomWorkspace)
  const dataviewsInWorkspace = useSelector(selectDataviewInstancesMerged)
  const hasEditPermission = useSelector(selectUserWorkspaceEditPermissions)
  const workspaceDatasets = getDatasetsInDataviews(dataviewsInWorkspace || [])
  const privateDatasets = workspaceDatasets.filter((d) => d.includes(PRIVATE_SUFIX))
  const containsPrivateDatasets = privateDatasets.length > 0

  const isDefaultWorkspace = workspace?.id === DEFAULT_WORKSPACE_ID
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const hasWorkspaceDefined = workspace !== null && !isDefaultWorkspace
  const allowUpdate = hasWorkspaceDefined && (isOwnerWorkspace || hasEditPermission)
  const showOverWriteWarning = hasWorkspaceDefined && !isOwnerWorkspace && hasEditPermission
  const initialCreateAsPublic = allowUpdate
    ? workspace?.id.includes(PUBLIC_SUFIX) || false
    : !containsPrivateDatasets
  const [createAsPublic, setCreateAsPublic] = useState(initialCreateAsPublic)
  const visibilityChanged = allowUpdate ? createAsPublic !== initialCreateAsPublic : false

  useEffect(() => {
    if (isOpen) {
      let workspaceName = workspace?.name
      if (isDefaultWorkspace || !allowUpdate) {
        const areaName = getOceanAreaName(viewport, { locale: i18n.language as OceanAreaLocale })
        const dateFormat = pickDateFormatByRange(timerange.start as string, timerange.end as string)
        const start = formatTimerangeBoundary(timerange.start, dateFormat)
        const end = formatTimerangeBoundary(timerange.end, dateFormat)
        workspaceName = `From ${start} to ${end} ${areaName ? `near ${areaName}` : ''}`
      }

      if (workspaceName) {
        setName(workspaceName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const updateWorkspace = async () => {
    if (currentWorkspace) {
      setUpdateLoading(true)
      const dispatchedAction = await dispatch(
        updatedCurrentWorkspaceThunk({ ...currentWorkspace, name })
      )
      if (updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        uaEvent({
          category: 'Workspace Management',
          action: 'Edit current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })

        setUpdateLoading(false)
        if (onFinish) {
          onFinish()
        }
      } else {
        console.warn('Error updating workspace', dispatchedAction.payload)
      }
    }
  }

  const createWorkspace = async () => {
    if (name) {
      setCreateLoading(true)
      const dispatchedAction = await dispatch(saveCurrentWorkspaceThunk({ name, createAsPublic }))
      if (saveCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        uaEvent({
          category: 'Workspace Management',
          action: 'Save current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setCreateLoading(false)
        if (onFinish) {
          onFinish()
        }
      } else {
        console.warn('Error saving workspace', dispatchedAction.payload)
      }
    }
  }

  return (
    <Modal
      title={t('workspace.save', 'Save the current workspace')}
      isOpen={isOpen}
      shouldCloseOnEsc={true}
      contentClassName={styles.modal}
      onClose={onClose}
    >
      <InputText
        inputSize="small"
        value={name}
        label={t('common.name', 'Name')}
        className={styles.input}
        onChange={(e) => setName(e.target.value)}
      />
      {workspace?.id && (
        <SwitchRow
          label={t('workspace.uploadPublic' as any, 'Allow other users to see this workspace')}
          active={createAsPublic}
          disabled={containsPrivateDatasets}
          tooltip={
            containsPrivateDatasets
              ? `${t(
                  'workspace.uploadPublicDisabled' as any,
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
        <Button loading={createLoading} disabled={!name} onClick={createWorkspace}>
          {t('workspace.create', 'Create new workspace') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default NewWorkspaceModal
