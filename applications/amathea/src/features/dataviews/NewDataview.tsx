import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { scaleLinear } from 'd3-scale'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import Button from '@globalfishingwatch/ui-components/dist/button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import ColorBar, { ColorBarIds } from '@globalfishingwatch/ui-components/dist/color-bar'
import { DATASET_SOURCE_OPTIONS, FLAG_FILTERS, CUSTOM_DATA_SHAPE } from 'data/data'
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
  const { upsertDataview } = useDataviewsAPI()
  const { source, dataset } = draftDataview || {}
  const datasetsOptions = useSelector(selectDatasetOptionsBySource)
  const [minRange, setMinRange] = useState<number>(
    draftDataview?.steps?.length ? draftDataview?.steps[0] : 0
  )
  const [maxRange, setMaxRange] = useState<number>(
    draftDataview?.steps?.length ? draftDataview?.steps[draftDataview?.steps.length - 1] : 0
  )

  const onStepMinRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setMinRange(parseFloat(value))
  }
  const onStepMaxRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setMaxRange(parseFloat(value))
  }

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
    if (draftDataview) {
      setLoading(true)
      let dataview
      if (draftDataview.source?.id === 'user') {
        let steps
        if (maxRange - minRange > 0) {
          const rampScale = scaleLinear().range([minRange, maxRange]).domain([0, 1])
          steps = [0, 0.2, 0.4, 0.6, 0.8, 1].map((value) => parseFloat(rampScale(value).toFixed(1)))
        }
        if (!draftDataview.id || steps) {
          dataview = await upsertDataview({ ...draftDataview, ...(steps && { steps }) })
        }
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

  const isFishingEffortLayer = dataset?.id === 'dgg_fishing_galapagos'
  const isCustomUserDatashape = dataset?.category === CUSTOM_DATA_SHAPE
  const selectedFlagFilter = FLAG_FILTERS.find((flag) => flag.id === draftDataview?.flagFilter)
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
      {isFishingEffortLayer && (
        <Select
          label="Filter by flag"
          options={FLAG_FILTERS}
          selectedOption={selectedFlagFilter}
          className={styles.input}
          onSelect={(option) => setDraftDataview({ flagFilter: option.id as string })}
          onRemove={() => onCleanClick('flagFilter')}
          onCleanClick={() => onCleanClick('flagFilter')}
        ></Select>
      )}
      {isCustomUserDatashape && (
        <div className={styles.containerRow}>
          <InputText
            className={styles.input}
            label="Minimum value"
            type="number"
            value={minRange}
            onChange={onStepMinRangeChange}
          />
          <InputText
            className={styles.input}
            label="Maximum value"
            type="number"
            value={maxRange}
            onChange={onStepMaxRangeChange}
          />
        </div>
      )}
      <Button onClick={onCreateClick} className={styles.saveBtn} loading={loading}>
        Confirm
      </Button>
    </div>
  )
}

export default NewDataview
