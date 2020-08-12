import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select, { SelectOnChange } from '@globalfishingwatch/ui-components/dist/select'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { DATASET_SOURCE_OPTIONS } from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './NewDataview.module.css'
import {
  setDraftDataview,
  selectDrafDataviewSource,
  selectDrafDataviewDataset,
} from './dataviews.slice'
import { selectDatasetOptionsBySource } from './dataviews.selectors'

function NewDataview(): React.ReactElement {
  const dispatch = useDispatch()
  const { hideModal } = useModalConnect()
  const selectedSource = useSelector(selectDrafDataviewSource)
  const selectedDataset = useSelector(selectDrafDataviewDataset)
  const datasetsOptions = useSelector(selectDatasetOptionsBySource)
  const onSourceSelect: SelectOnChange = (option) => {
    dispatch(setDraftDataview({ source: option }))
  }
  const onSourceClean = () => {
    dispatch(setDraftDataview({ source: undefined }))
  }
  const onDatasetSelect: SelectOnChange = (option) => {
    dispatch(setDraftDataview({ dataset: option }))
  }
  const onDatasetClean = () => {
    dispatch(setDraftDataview({ dataset: undefined }))
  }
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">New Dataview</h1>
      <Select
        label="Sources"
        options={DATASET_SOURCE_OPTIONS}
        selectedOption={selectedSource}
        className={styles.input}
        onSelect={onSourceSelect}
        onRemove={onSourceClean}
        onCleanClick={onSourceClean}
      ></Select>
      <Select
        label="Datasets"
        options={datasetsOptions}
        selectedOption={selectedDataset}
        className={styles.input}
        onSelect={onDatasetSelect}
        onRemove={onDatasetClean}
        onCleanClick={onDatasetClean}
      ></Select>

      <Button onClick={hideModal} className={styles.saveBtn}>
        ADD NEW DATAVIEW
      </Button>
    </div>
  )
}

export default NewDataview
