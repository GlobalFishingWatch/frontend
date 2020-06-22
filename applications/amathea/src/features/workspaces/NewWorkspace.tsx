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
import styles from './NewWorkspace.module.css'

function NewWorkspace(): React.ReactElement {
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
  const { showModal, hideModal } = useModalConnect()
  const aois = [
    { id: 'user-id-plus-hash-1', label: 'Area of Interest Name 1' },
    { id: 'user-id-plus-hash-2', label: 'Area of Interest Name 2' },
    { id: 'user-id-plus-hash-3', label: 'Area of Interest Name 3' },
  ]
  return (
    <div className={styles.container}>
      <h1 className="sr-only">New Workspace</h1>
      <InputText label="Name" placeholder="Name your workspace" />
      <div className={styles.AOIWrapper}>
        <Select
          label="Area of interest"
          options={aois}
          selectedOption={selectedOption}
          onSelect={onSelect}
          onRemove={onRemove}
          onCleanClick={onClean}
        ></Select>
        <IconButton
          icon="plus"
          type="border"
          tooltip="Create new area of interest"
          onClick={() => {
            showModal('newAOI')
          }}
        />
      </div>
      <Button onClick={hideModal} className={styles.saveBtn}>
        Save workspace
      </Button>
    </div>
  )
}

export default NewWorkspace
