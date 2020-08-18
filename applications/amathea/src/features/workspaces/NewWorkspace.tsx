import React, { useState } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import { useAOIConnect } from 'features/areas-of-interest/areas-of-interest.hook'
import styles from './NewWorkspace.module.css'
import { useCurrentWorkspaceConnect, useWorkspacesAPI } from './workspaces.hook'

function NewWorkspace(): React.ReactElement {
  const { workspace } = useCurrentWorkspaceConnect()
  const { upsertWorkspace } = useWorkspacesAPI()
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [workspaceLabel, setWorkspaceLabel] = useState<string>(workspace?.label || '')
  const [workspaceDescription, setWorkspaceDescription] = useState<string>(
    workspace?.description || ''
  )
  const defaultSelection = workspace?.aoi
    ? { id: workspace.aoi.id, label: workspace.aoi.label }
    : undefined
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(defaultSelection)
  const onSelect: SelectOnChange = (option) => {
    setSelectedOption(option)
  }
  const onClean: SelectOnRemove = () => {
    setSelectedOption(undefined)
  }
  const onRemove: SelectOnChange = () => {
    setSelectedOption(undefined)
  }
  const { hideModal } = useModalConnect()
  const { aoiList } = useAOIConnect()
  const onSaveClick = async () => {
    if (workspaceLabel && workspaceDescription && selectedOption) {
      setLoading(true)
      const newWorkspace = {
        ...(workspace?.id && { id: workspace.id }),
        aoiId: selectedOption.id as number,
        label: workspaceLabel,
        description: workspaceDescription,
      }
      await upsertWorkspace(newWorkspace)
      setLoading(false)
      hideModal()
      setError('')
    } else {
      setError('Fill all fields')
    }
  }
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">New Workspace</h1>
      <InputText
        label="Name"
        placeholder="Name your workspace"
        value={workspaceLabel}
        className={styles.input}
        onChange={(e) => setWorkspaceLabel(e.target.value)}
      />
      <InputText
        label="Description"
        placeholder="Descript your workspace"
        value={workspaceDescription}
        className={styles.input}
        onChange={(e) => setWorkspaceDescription(e.target.value)}
      />
      <div className={styles.AOIWrapper}>
        <Select
          label="Area of interest"
          options={aoiList}
          selectedOption={selectedOption}
          onSelect={onSelect}
          onRemove={onRemove}
          onCleanClick={onClean}
        ></Select>
        <IconButton icon="plus" type="border" tooltip="Create new area of interest (Coming soon)" />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button onClick={onSaveClick} className={styles.saveBtn} loading={loading}>
        {workspace?.id ? 'Update workspace' : 'Save workspace'}
      </Button>
    </div>
  )
}

export default NewWorkspace
