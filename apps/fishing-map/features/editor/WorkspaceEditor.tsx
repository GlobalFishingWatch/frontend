import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy } from 'es-toolkit'

import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton,Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { addDataviewEntity } from 'features/dataviews/dataviews.slice'
import { getDataviewInstanceFromDataview } from 'features/dataviews/dataviews.utils'
import { selectDataviewInstancesMergedOrdered } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import type { AsyncError } from 'utils/async-slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import {
  fetchEditorDataviewsThunk,
  selectEditorDataviews,
  selectEditorDataviewsStatus,
} from './editor.slice'

import styles from './EditorMenu.module.css'

type WorkspaceEditorProps = {
  onEditClick: (dataview: Dataview) => void
}

const WorkspaceEditor = ({ onEditClick }: WorkspaceEditorProps) => {
  const dispatch = useAppDispatch()
  const [loadingId, setLoadingId] = useState<number | undefined>()
  const [error, setError] = useState<string | undefined>()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const editorDataviewsStatus = useSelector(selectEditorDataviewsStatus)
  const editorDataviews = useSelector(selectEditorDataviews)
  const workspaceDataviewInstances = useSelector(selectDataviewInstancesMergedOrdered) || []
  const { addNewDataviewInstances, deleteDataviewInstance } = useDataviewInstancesConnect()

  useEffect(() => {
    dispatch(fetchEditorDataviewsThunk())
  }, [dispatch])

  if (
    editorDataviewsStatus === AsyncReducerStatus.Idle ||
    editorDataviewsStatus === AsyncReducerStatus.Loading ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return <Spinner className={styles.loading} />
  }

  if (error || editorDataviewsStatus === AsyncReducerStatus.Error) {
    return <p>{error || 'There was an error requesting data'}</p>
  }

  if (!editorDataviews) {
    return <p>There are no dataviews yet</p>
  }

  const isDataviewAdded = (dataviewId: string) => {
    return workspaceDataviewInstances.find(
      (dataviewInstance) => dataviewId === dataviewInstance.dataviewId && !dataviewInstance.deleted
    )
  }

  const addDataviewToWorkspace = async (dataview: Dataview) => {
    setLoadingId(dataview.id)
    const dataviewInstance = getDataviewInstanceFromDataview(dataview)
    const datasets = dataview.datasetsConfig?.map(({ datasetId }) => datasetId)
    if (datasets && datasets?.length) {
      const action = await dispatch(fetchDatasetsByIdsThunk({ ids: datasets }))
      if (!fetchDatasetsByIdsThunk.fulfilled.match(action)) {
        setError((action.payload as AsyncError).message)
      }
    }
    dispatch(addDataviewEntity(dataview))
    addNewDataviewInstances([dataviewInstance])
    setLoadingId(undefined)
  }

  const onDataviewClick = (dataview: Dataview) => {
    const alreadyInWorkspace = isDataviewAdded(dataview.slug)
    if (alreadyInWorkspace) {
      const dataviewInstance = workspaceDataviewInstances.find(
        (dataviewInstance) => dataviewInstance.dataviewId === dataview.slug
      )
      if (dataviewInstance) {
        deleteDataviewInstance(dataviewInstance.id)
      } else {
        console.warn('No dataview instance found to delete for dataview:', dataview)
      }
    } else {
      addDataviewToWorkspace(dataview)
    }
  }

  const groupedDataviews = groupBy(editorDataviews, (d) => d.category || '')
  return (
    <div className={styles.content}>
      <ul className={styles.dataviewsList}>
        {Object.entries(groupedDataviews)
          .sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB))
          .map(([category, dataviews]) => {
            const sortDataviews = (dataviews || []).sort((a, b) => a.name.localeCompare(b.name))
            return (
              <li key={category}>
                <label>{category}</label>
                <ul>
                  {sortDataviews.length > 0 &&
                    sortDataviews.map((dataview) => {
                      const alreadyInWorkspace = isDataviewAdded(dataview.slug)
                      return (
                        <li
                          key={dataview.id}
                          className={cx(styles.row, { [styles.rowHighlight]: alreadyInWorkspace })}
                        >
                          {dataview.name} (id: {dataview.id})
                          {dataview.category === DataviewCategory.Environment && (
                            <IconButton
                              icon="edit"
                              size="small"
                              type="border"
                              className={styles.addButton}
                              onClick={() => onEditClick(dataview)}
                            />
                          )}
                          <IconButton
                            loading={dataview.id === loadingId}
                            icon={alreadyInWorkspace ? 'delete' : 'plus'}
                            tooltip={
                              alreadyInWorkspace ? 'Remove from workspace' : 'Add to workspace'
                            }
                            size="small"
                            type="border"
                            className={styles.addButton}
                            onClick={() => onDataviewClick(dataview)}
                          />
                        </li>
                      )
                    })}
                </ul>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
export default WorkspaceEditor
