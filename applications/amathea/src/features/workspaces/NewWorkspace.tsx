import React, { useState, useCallback } from 'react'
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
import { useWorkspacesConnect } from './workspaces.hook'

function NewWorkspace(): React.ReactElement {
  const [workspaceLabel, setWorkspaceLabel] = useState<string>('')
  const [workspaceDescription, setWorkspaceDescription] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>()
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
  const { createWorkspace } = useWorkspacesConnect()
  const { aoiList } = useAOIConnect()
  const onSaveClick = useCallback(() => {
    if (workspaceLabel && workspaceDescription && selectedOption) {
      const workspace = {
        aoiId: selectedOption.id as number,
        label: workspaceLabel,
        description: workspaceDescription,
      }
      createWorkspace(workspace)
      hideModal()
      setError('')
    } else {
      setError('Fill all fields')
    }
  }, [createWorkspace, hideModal, selectedOption, workspaceDescription, workspaceLabel])
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
      <Button onClick={onSaveClick} className={styles.saveBtn}>
        Save workspace
      </Button>
    </div>
  )
}

export default NewWorkspace
