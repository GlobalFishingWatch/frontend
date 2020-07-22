import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import { selectDatasetSources } from 'features/datasets/datasets.selectors'
import styles from './NewDataview.module.css'

function NewDataview(): React.ReactElement {
  const [selectedSource, setSelectedSource] = useState<SelectOption | undefined>()
  const [selectedDataset, setSelectedDataset] = useState<SelectOption | undefined>()
  const datasetsOptions = useSelector(selectDatasetSources)
  const onSourceSelect: SelectOnChange = (option) => {
    setSelectedSource(option)
  }
  const onSourceClean: SelectOnRemove = () => {
    setSelectedSource(undefined)
  }
  const onSourceRemove: SelectOnChange = () => {
    setSelectedSource(undefined)
  }
  const onDatasetSelect: SelectOnChange = (option) => {
    setSelectedDataset(option)
  }
  const onDatasetClean: SelectOnRemove = () => {
    setSelectedDataset(undefined)
  }
  const onDatasetRemove: SelectOnChange = () => {
    setSelectedDataset(undefined)
  }
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">New Dataview</h1>
      <Select
        label="Sources"
        options={[{ id: 'gfw', label: 'Global Fishing Watch' }]}
        selectedOption={selectedSource}
        className={styles.input}
        onSelect={onSourceSelect}
        onRemove={onSourceRemove}
        onCleanClick={onSourceClean}
      ></Select>
      <Select
        label="Datasets"
        options={selectedSource?.id === 'gfw' ? datasetsOptions : []}
        selectedOption={selectedDataset}
        className={styles.input}
        onSelect={onDatasetSelect}
        onRemove={onDatasetRemove}
        onCleanClick={onDatasetClean}
      ></Select>
    </div>
  )
}

export default NewDataview
