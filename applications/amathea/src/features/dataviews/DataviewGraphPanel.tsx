import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import TagList from '@globalfishingwatch/ui-components/dist/tag-list'
import { Dataview } from '@globalfishingwatch/api-types'
import { DATASET_SOURCE_OPTIONS, FLAG_FILTERS } from 'data/data'
import { useModalConnect } from 'features/modal/modal.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import Circle from 'common/Circle'
import { useLocationConnect } from 'routes/routes.hook'
import { selectHiddenDataviews } from 'routes/routes.selectors'
import { useCurrentWorkspaceConnect, useWorkspacesAPI } from 'features/workspaces/workspaces.hook'
import styles from './DataviewGraphPanel.module.css'
import DataviewGraph from './DataviewGraph'
import { useDataviewsAPI, useDraftDataviewConnect } from './dataviews.hook'
import { DataviewDraft } from './dataviews.slice'

interface DataviewGraphPanelProps {
  dataview: Dataview
}

const DataviewGraphPanel: React.FC<DataviewGraphPanelProps> = ({ dataview }) => {
  const [dataviewLoadingId, setDataviewLoadingId] = useState<number | undefined>()
  const { workspace } = useCurrentWorkspaceConnect()
  const { updateWorkspace } = useWorkspacesAPI()
  const { showModal } = useModalConnect()
  const { setDraftDataview } = useDraftDataviewConnect()
  const { deleteDataview } = useDataviewsAPI()
  const { dispatchQueryParams } = useLocationConnect()
  const hiddenDataviews = useSelector(selectHiddenDataviews)
  const datasetId = dataview.datasetsConfig?.length ? dataview.datasetsConfig[0].datasetId : ''
  const dataset = useSelector(selectDatasetById(datasetId))
  const color = dataview.config?.color as string
  const unit = dataset?.unit
  const flagFilter = dataview.config.flagFilter
  const onEditClick = useCallback(() => {
    if (dataset) {
      // TODO USE REAL DATASET ID WHEN SUPPORTING MULTIPLE
      const sourceLabel = DATASET_SOURCE_OPTIONS.find((d) => d.id === dataset.source)?.label || ''
      const draftDataview: DataviewDraft = {
        id: dataview.id,
        name: dataview.name,
        color: color as string,
        colorRamp: dataview.config?.colorRamp,
        steps: dataview.config.steps as number[],
        source: { id: dataset.source as string, label: sourceLabel },
        flagFilter,
        dataset: {
          id: dataset?.id,
          label: dataset?.name,
          type: dataset?.type,
          description: dataset?.description,
          category: dataset?.category,
        },
      }
      setDraftDataview(draftDataview)
      showModal('newDataview')
    }
  }, [color, flagFilter, dataset, dataview, setDraftDataview, showModal])

  const onDeleteClick = useCallback(
    async (dataview: Dataview) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this dataview?\n${dataview.name}`
      )
      if (confirmation && workspace?.dataviews) {
        setDataviewLoadingId(dataview.id)
        await updateWorkspace({
          id: workspace.id,
          dataviews: workspace.dataviews
            .filter((d) => d.id !== dataview.id)
            .map(({ id }) => id) as any,
          dataviewInstances: workspace.dataviewInstances.filter(
            (d) => d.dataviewId !== dataview.id
          ),
        })
        if (dataview.config.dataset === 'marine-reserve-user') {
          await deleteDataview(dataview.id)
        }
        setDataviewLoadingId(undefined)
      }
    },
    [deleteDataview, updateWorkspace, workspace]
  )

  const isDataviewHidden = hiddenDataviews.includes(dataview.id)
  const onToggleMapClick = useCallback(
    (dataview: Dataview) => {
      dispatchQueryParams({
        hiddenDataviews: isDataviewHidden
          ? hiddenDataviews.filter((d) => d !== dataview.id)
          : [...hiddenDataviews, dataview.id],
      })
    },
    [dispatchQueryParams, hiddenDataviews, isDataviewHidden]
  )
  const isUserContextLayer = dataset?.type === 'user-context-layer:v1'

  const selectedFlagFilter = FLAG_FILTERS.find((flag) => flag.id === flagFilter)
  return (
    dataview && (
      <div className={styles.container} id={dataview.id.toString()}>
        <div className={styles.header}>
          {isUserContextLayer && <Circle className={styles.circleMargin} color={color} />}
          <p className={styles.title}>
            {dataview.name}
            {!isUserContextLayer && unit && <span className={styles.unit}> ({unit})</span>}
          </p>
          <IconButton icon="info" tooltip={dataview.description} />
          <IconButton icon="edit" tooltip="Edit dataset" onClick={onEditClick} />
          {!isUserContextLayer && (
            <IconButton icon="download" tooltip="Download time series data (Coming soon)" />
          )}
          <IconButton
            icon="delete"
            type="warning"
            tooltip="Remove dataset"
            loading={dataviewLoadingId === dataview.id}
            onClick={() => onDeleteClick(dataview)}
          />
          {dataset?.status === 'error' && (
            <IconButton icon="warning" tooltip={dataset.importLogs} />
          )}
          {dataset?.status === 'importing' && (
            <IconButton loading tooltip="Your dataset is being imported, try reloading the page" />
          )}
          {dataset?.status !== 'error' && dataset?.status !== 'importing' && (
            <IconButton
              icon={isDataviewHidden ? 'view-on-map' : 'remove-from-map'}
              tooltip={isDataviewHidden ? 'Show on map' : 'Remove from map'}
              onClick={() => onToggleMapClick(dataview)}
            />
          )}
        </div>
        {selectedFlagFilter && (
          <div>
            <label>Flag filter</label>
            <TagList tags={[selectedFlagFilter]} color={color} />
          </div>
        )}
        {!isUserContextLayer && (
          <div className={styles.graph}>
            <DataviewGraph dataview={dataview} graphColor={color} graphUnit={unit} />
          </div>
        )}
      </div>
    )
  )
}

export default DataviewGraphPanel
