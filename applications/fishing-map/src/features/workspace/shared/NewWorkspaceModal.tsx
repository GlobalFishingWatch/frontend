import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { event as uaEvent } from 'react-ga'
import { useTranslation } from 'react-i18next'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { getOceanAreaName, OceanAreaLocale } from '@globalfishingwatch/ocean-areas'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Radio from '@globalfishingwatch/ui-components/dist/radio'
import { saveCurrentWorkspaceThunk } from 'features/workspace/workspace.slice'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { selectViewport } from 'features/app/app.selectors'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import styles from './NewWorkspaceModal.module.css'

type NewWorkspaceModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreate?: () => void
}

function NewWorkspaceModal({ isOpen, onClose, onCreate }: NewWorkspaceModalProps) {
  const [name, setName] = useState('')
  const [createAsPublic, setCreateAsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const viewport = useSelector(selectViewport)
  const timerange = useTimerangeConnect()
  const workspace = useSelector(selectWorkspace)

  useEffect(() => {
    if (isOpen) {
      const isDefaultWorkspace = workspace?.id === DEFAULT_WORKSPACE_ID
      const areaName = getOceanAreaName(viewport, { locale: i18n.language as OceanAreaLocale })
      const dateFormat = pickDateFormatByRange(timerange.start as string, timerange.end as string)
      const start = formatI18nDate(timerange.start as string, {
        format: dateFormat,
      })
        .replace(',', '')
        .replace('.', '')
      const end = formatI18nDate(timerange.end as string, {
        format: dateFormat,
      })
        .replace(',', '')
        .replace('.', '')

      const defaultName = isDefaultWorkspace
        ? `From ${start} to ${end} ${areaName ? `near ${areaName}` : ''}`
        : workspace?.name

      if (defaultName) {
        setName(defaultName)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const onCreateWorkspaceClick = async () => {
    if (name) {
      setLoading(true)
      const dispatchedAction = await dispatch(saveCurrentWorkspaceThunk({ name, createAsPublic }))
      if (saveCurrentWorkspaceThunk.fulfilled.match(dispatchedAction)) {
        uaEvent({
          category: 'Workspace Management',
          action: 'Save current workspace',
          label: dispatchedAction.payload?.name ?? 'Unknown',
        })
        setLoading(false)
        if (onCreate) {
          onCreate()
        }
      } else {
        console.warn('Error saving workspace', dispatchedAction.payload)
      }
    }
  }

  return (
    <Modal
      title={t('workspace.save', 'Save the current view')}
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
      <Radio
        label={t('workspace.uploadPublic' as any, 'Allow other users to see this workspace')}
        active={createAsPublic}
        onClick={() => {
          setCreateAsPublic(!createAsPublic)
        }}
      />
      <div className={styles.footer}>
        <Button loading={loading} disabled={!name} onClick={onCreateWorkspaceClick}>
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default NewWorkspaceModal
