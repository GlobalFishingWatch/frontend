import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Select, { SelectOnChange } from '@globalfishingwatch/ui-components/dist/select'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { DATASET_SOURCE_OPTIONS } from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import { updateWorkspaceThunk } from 'features/workspaces/workspaces.slice'
import { useCurrentWorkspaceConnect } from 'features/workspaces/workspaces.hook'
import styles from './NewDataview.module.css'
import { selectDatasetOptionsBySource } from './dataviews.selectors'
import { useDataviewsConnect, useDraftDataviewConnect } from './dataviews.hook'
import { DataviewDraftDataset, DataviewDraft } from './dataviews.slice'

function NewDataview(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { hideModal } = useModalConnect()
  const { workspace } = useCurrentWorkspaceConnect()
  const { draftDataview, setDraftDataview, resetDraftDataview } = useDraftDataviewConnect()
  const { updateDataview, createDataview } = useDataviewsConnect()
  const { source, dataset } = draftDataview || {}
  const datasetsOptions = useSelector(selectDatasetOptionsBySource)
  const onSourceSelect: SelectOnChange = (option) => {
    setDraftDataview({ source: option })
  }
  const onDatasetSelect = (option: DataviewDraftDataset) => {
    setDraftDataview({ dataset: option })
  }
  const onCleanClick = (property: 'dataset' | 'source') => {
    setDraftDataview({ [property]: undefined })
  }
  const onCreateClick = async () => {
    setLoading(true)
    const dataview = draftDataview?.id
      ? await updateDataview(draftDataview)
      : await createDataview(draftDataview as DataviewDraft)
    if (dataview) {
      await dispatch(
        updateWorkspaceThunk({ id: workspace?.id, dataviews: [{ id: dataview.id }] as any })
      )
    }
    setLoading(false)
    resetDraftDataview()
    hideModal()
  }
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">{draftDataview?.id ? 'Dataview' : 'New Dataview'}</h1>
      <Select
        label="Sources"
        options={DATASET_SOURCE_OPTIONS}
        selectedOption={source}
        className={styles.input}
        onSelect={onSourceSelect}
        onRemove={() => onCleanClick('source')}
        onCleanClick={() => onCleanClick('source')}
      ></Select>
      {source && source.id && (
        <Select
          label="Datasets"
          options={datasetsOptions}
          selectedOption={dataset}
          className={styles.input}
          onSelect={onDatasetSelect as SelectOnChange}
          onRemove={() => onCleanClick('dataset')}
          onCleanClick={() => onCleanClick('dataset')}
        ></Select>
      )}

      <Button onClick={onCreateClick} className={styles.saveBtn}>
        {loading ? 'LOADING' : draftDataview?.id ? 'UPDATE DATAVIEW' : 'ADD NEW DATAVIEW'}
      </Button>
    </div>
  )
}

export default NewDataview
