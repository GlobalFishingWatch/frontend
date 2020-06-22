import React, { useState } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './NewDataset.module.css'

function NewDataset(): React.ReactElement {
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
  const datasetTypes = [
    { id: 'static-context-areas', label: 'Static Context Areas' },
    { id: 'spatiotemporal-tracks', label: 'Spatiotemporal Tracks' },
    { id: 'spatiotemporal-grid', label: 'Spatiotemporal Grid' },
  ]
  return (
    <div className={styles.container}>
      <h1 className="sr-only">New Dataset</h1>
      <div className={styles.steps}>
        <button className={styles.currentStep}>1. INFO</button>
        <button>2. DATA</button>
        <button>3. PARAMETERS</button>
      </div>
      <InputText label="Name" placeholder="Name your dataset" />
      <div className={styles.typeWrapper}>
        <Select
          label="Type"
          options={datasetTypes}
          selectedOption={selectedOption}
          onSelect={onSelect}
          onRemove={onRemove}
          onCleanClick={onClean}
        ></Select>
      </div>
      <Button onClick={hideModal} className={styles.saveBtn}>
        CONTINUE
      </Button>
    </div>
  )
}

export default NewDataset
