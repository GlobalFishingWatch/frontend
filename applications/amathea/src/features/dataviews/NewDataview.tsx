import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import Button from '@globalfishingwatch/ui-components/dist/button'
import ColorBar, { ColorBarIds } from '@globalfishingwatch/ui-components/dist/color-bar'
import { DATASET_SOURCE_OPTIONS } from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import { useCurrentWorkspaceConnect, useWorkspacesAPI } from 'features/workspaces/workspaces.hook'
import styles from './NewDataview.module.css'
import { selectDatasetOptionsBySource } from './dataviews.selectors'
import { useDraftDataviewConnect, useDataviewsAPI } from './dataviews.hook'
import { DataviewDraftDataset } from './dataviews.slice'

function NewDataview(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const { hideModal } = useModalConnect()
  const { workspace } = useCurrentWorkspaceConnect()
  const { updateWorkspace } = useWorkspacesAPI()
  const { draftDataview, setDraftDataview, resetDraftDataview } = useDraftDataviewConnect()
  const { createDataview } = useDataviewsAPI()
  const { source, dataset } = draftDataview || {}
  const datasetsOptions = useSelector(selectDatasetOptionsBySource)

  const onSelect = (property: string, option: SelectOption | DataviewDraftDataset | number) => {
    setDraftDataview({ [property]: option })
  }
  const onDatasetSelect = (dataset: any) => {
    if (dataset.dataviewId) {
      onSelect('id', dataset.dataviewId)
    }
    onSelect('dataset', dataset)
  }
  const onCleanClick = (property: 'dataset' | 'source' | 'flagFilter') => {
    setDraftDataview({ [property]: undefined })
  }
  const onCreateClick = async () => {
    setLoading(true)
    if (draftDataview) {
      let dataview
      if (draftDataview.source?.id === 'user' && !draftDataview.id) {
        dataview = await createDataview(draftDataview)
      }
      const dataviewId = draftDataview.id || dataview?.id
      if (dataviewId && workspace?.id) {
        await updateWorkspace({
          id: workspace.id,
          dataviews: [...(new Set([...workspace.dataviews.map((d) => d.id), dataviewId]) as any)],
          dataviewsConfig: {
            ...workspace.dataviewsConfig,
            [dataviewId]: {
              config: { color: draftDataview.color, colorRamp: draftDataview.colorRamp },
              datasetsConfig: {
                datasetId: {
                  query: [{ id: 'flag', value: draftDataview.flagFilter }],
                },
              },
            },
          },
        })
      }
      setLoading(false)
      resetDraftDataview()
      hideModal()
    }
  }

  // const isFishingEffortLayer = dataset?.id === 'dgg_fishing_galapagos'
  // const selectedFlagFilter = FLAG_FILTERS.find((flag) => flag.id === draftDataview?.flagFilter)
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">{draftDataview?.id ? 'Update Dataset' : 'New Dataset'}</h1>
      <Select
        label="Source"
        options={DATASET_SOURCE_OPTIONS}
        selectedOption={source}
        className={styles.input}
        onSelect={(option) => onSelect('source', option)}
        onRemove={() => onCleanClick('source')}
        onCleanClick={() => onCleanClick('source')}
      ></Select>
      {source && source.id && (
        <Select
          label="Dataset"
          options={datasetsOptions}
          selectedOption={dataset}
          className={styles.input}
          onSelect={onDatasetSelect}
          onRemove={() => onCleanClick('dataset')}
          onCleanClick={() => onCleanClick('dataset')}
        ></Select>
      )}
      {dataset && dataset.id && (
        <div className={styles.input}>
          <label>Color</label>
          <ColorBar
            selectedColor={draftDataview?.color as ColorBarIds}
            onColorClick={(color) => setDraftDataview({ color: color.value, colorRamp: color.id })}
          />
        </div>
      )}
      {/* {isFishingEffortLayer && (
        <Select
          label="Filter by flag"
          options={FLAG_FILTERS}
          selectedOption={selectedFlagFilter}
          className={styles.input}
          onSelect={(option) => setDraftDataview({ flagFilter: option.id as string })}
          onRemove={() => onCleanClick('flagFilter')}
          onCleanClick={() => onCleanClick('flagFilter')}
        ></Select>
      )} */}
      <Button onClick={onCreateClick} className={styles.saveBtn} loading={loading}>
        Confirm
      </Button>
    </div>
  )
}

export default NewDataview
