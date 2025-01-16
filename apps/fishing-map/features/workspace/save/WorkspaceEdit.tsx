import type { ChangeEvent } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import type { WorkspaceEditAccessType } from '@globalfishingwatch/api-types'
import { WORKSPACE_PASSWORD_ACCESS, WORKSPACE_PRIVATE_ACCESS } from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Button, InputText, Select } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { updatedCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { updateWorkspaceThunk } from 'features/workspaces-list/workspaces-list.slice'

import { MIN_WORKSPACE_PASSWORD_LENGTH } from '../workspace.utils'

import { useSaveWorkspaceTimerange } from './workspace-save.hooks'
import type { WorkspaceTimeRangeMode } from './workspace-save.utils'
import { getEditAccessOptionsByViewAccess, isValidDaysFromLatest } from './workspace-save.utils'

import styles from './WorkspaceSaveModal.module.css'

type EditWorkspaceProps = {
  workspace: AppWorkspace
  isWorkspaceList?: boolean
  onFinish?: (workspace: AppWorkspace) => void
}

function EditWorkspace({ workspace, isWorkspaceList = false, onFinish }: EditWorkspaceProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [name, setName] = useState(workspace?.name)
  const [editAccess, setEditAccess] = useState<WorkspaceEditAccessType>(workspace?.editAccess)
  const editOptions = getEditAccessOptionsByViewAccess(workspace?.viewAccess)
  const [editPassword, setEditPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    timeRangeOptions,
    timeRangeOption,
    daysFromLatest,
    handleTimeRangeChange,
    handleDaysFromLatestChange,
  } = useSaveWorkspaceTimerange(workspace)

  const userData = useSelector(selectUserData)
  const isOwnerWorkspace = workspace?.ownerId === userData?.id
  const isPassWordEditAccess = workspace?.editAccess === WORKSPACE_PASSWORD_ACCESS
  const validDaysFromLatestValue =
    timeRangeOption === 'dynamic' ? isValidDaysFromLatest(daysFromLatest) : true

  const updateWorkspace = async () => {
    if (workspace) {
      setLoading(true)
      const updateParams = {
        ...workspace,
        name,
        editAccess,
        state: {
          ...workspace.state,
          daysFromLatest,
        },
        password: editPassword,
        newPassword,
      }
      const dispatchedAction = isWorkspaceList
        ? await dispatch(updateWorkspaceThunk(updateParams))
        : await dispatch(updatedCurrentWorkspaceThunk(updateParams))
      if (
        updateWorkspaceThunk.fulfilled.match(dispatchedAction) ||
        updatedCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)
      ) {
        const workspace = dispatchedAction.payload as AppWorkspace
        if (!workspace?.dataviewInstances.length) {
          setError(t('workspace.passwordIncorrect', 'Invalid password'))
        }
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
        const error = (dispatchedAction.payload as any)?.error as ParsedAPIError
        if (error?.status === 401) {
          setError(t('workspace.passwordIncorrect', 'Invalid password'))
        } else {
          setError('Error updating workspace')
        }
        setLoading(false)
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
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    updateWorkspace()
  }

  const password = isOwnerWorkspace ? newPassword : editPassword
  const passwordDisabled =
    editAccess === WORKSPACE_PASSWORD_ACCESS &&
    editAccess !== workspace?.editAccess &&
    (!password || password.length < MIN_WORKSPACE_PASSWORD_LENGTH)

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.row}>
        <InputText
          value={name}
          className={styles.input}
          testId="create-workspace-name"
          label={t('common.name', 'Name')}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>
      <div className={styles.row}>
        <Select
          options={timeRangeOptions}
          label={t('common.timerange', 'Time range')}
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
            min={1}
            max={100}
          />
        )}
      </div>
      <div className={styles.row}>
        {isOwnerWorkspace && (
          <Select
            options={editOptions}
            direction="top"
            label={t('workspace.editAccess', 'Edit access')}
            placeholder={
              workspace?.viewAccess === WORKSPACE_PRIVATE_ACCESS
                ? t('common.onlyMe', 'Only me')
                : t('selects.placeholder', 'Select an option')
            }
            infoTooltip={
              workspace?.viewAccess === WORKSPACE_PRIVATE_ACCESS
                ? t(
                    'workspace.privateEditAcessInfo',
                    'Private view workspace does not allow editing'
                  )
                : ''
            }
            disabled={workspace?.viewAccess === WORKSPACE_PRIVATE_ACCESS}
            containerClassName={styles.select}
            onSelect={(option: SelectOption<WorkspaceEditAccessType>) => setEditAccess(option.id)}
            selectedOption={editOptions.find((o) => o.id === editAccess) || editOptions[0]}
          />
        )}
        {((isPassWordEditAccess && !isOwnerWorkspace) ||
          editAccess === WORKSPACE_PASSWORD_ACCESS) && (
          <InputText
            value={password}
            className={styles.select}
            type="password"
            testId="create-workspace-password"
            label={
              isOwnerWorkspace
                ? t('common.setNewPassword', 'Set a new password')
                : t('common.password', 'Password')
            }
            onChange={(e) =>
              isOwnerWorkspace ? setNewPassword(e.target.value) : setEditPassword(e.target.value)
            }
          />
        )}
      </div>
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          loading={loading}
          tooltip={
            passwordDisabled
              ? t('workspace.passwordMinLength', 'Password must be at least 5 characters')
              : ''
          }
          disabled={!name || passwordDisabled || !validDaysFromLatestValue}
          onClick={updateWorkspace}
          htmlType="submit"
          testId="create-workspace-button"
        >
          {t('workspace.edit', 'Edit workspace') as string}
        </Button>
      </div>
    </form>
  )
}

export default EditWorkspace
