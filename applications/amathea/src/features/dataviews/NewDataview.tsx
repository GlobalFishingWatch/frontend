import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select, { SelectOnChange } from '@globalfishingwatch/ui-components/dist/select'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { DATASET_SOURCE_OPTIONS } from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import { updateWorkspaceThunk } from 'features/workspaces/workspaces.slice'
import { useWorkspacesConnect } from 'features/workspaces/workspaces.hook'
import styles from './NewDataview.module.css'
import { selectDatasetOptionsBySource } from './dataviews.selectors'
import { useDataviewsConnect, useDraftDataviewConnect } from './dataviews.hook'
import { DataviewDraftDataset } from './dataviews.slice'

function NewDataview(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { hideModal } = useModalConnect()
  const { workspace } = useWorkspacesConnect()
  const { draftDataview, setDraftDataview } = useDraftDataviewConnect()
  const { createDataview } = useDataviewsConnect()
  const { source, dataset } = draftDataview || {}
  const datasetsOptions = useSelector(selectDatasetOptionsBySource)
  const onSourceSelect: SelectOnChange = (option) => {
    setDraftDataview({ source: option })
  }
  const onSourceClean = () => {
    setDraftDataview({ source: undefined })
  }
  const onDatasetSelect = (option: DataviewDraftDataset) => {
    setDraftDataview({ dataset: option })
  }
  const onDatasetClean = () => {
    setDraftDataview({ dataset: undefined })
  }
  const onCreateClick = async () => {
    setLoading(true)
    const dataview = await createDataview(draftDataview)
    await dispatch(
      updateWorkspaceThunk({ id: workspace?.id, dataviews: [{ id: dataview.id }] as any })
    )
    setLoading(false)
    hideModal()
  }
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">New Dataview</h1>
      <Select
        label="Sources"
        options={DATASET_SOURCE_OPTIONS}
        selectedOption={source}
        className={styles.input}
        onSelect={onSourceSelect}
        onRemove={onSourceClean}
        onCleanClick={onSourceClean}
      ></Select>
      <Select
        label="Datasets"
        options={datasetsOptions}
        selectedOption={dataset}
        className={styles.input}
        onSelect={onDatasetSelect as SelectOnChange}
        onRemove={onDatasetClean}
        onCleanClick={onDatasetClean}
      ></Select>

      <Button onClick={onCreateClick} className={styles.saveBtn}>
        {loading ? 'LOADING' : 'ADD NEW DATAVIEW'}
      </Button>
    </div>
  )
}

export default NewDataview
