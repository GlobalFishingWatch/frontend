import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { groupBy } from 'lodash'
import { Dataview } from '@globalfishingwatch/api-types/dist'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { AsyncError, AsyncReducerStatus } from 'utils/async-slice'
import { selectWorkspaceDataviewInstancesMergedDataviewIds } from 'features/dataviews/dataviews.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { addDataviewEntity } from 'features/dataviews/dataviews.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk } from 'features/datasets/datasets.slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import {
  fetchEditorDataviewsThunk,
  selectEditorDataviews,
  selectEditorDataviewsStatus,
} from './editor.slice'
import styles from './EditorMenu.module.css'

const EditorMenu: React.FC = () => {
  const dispatch = useAppDispatch()
  const [loadingId, setLoadingId] = useState<number | undefined>()
  const [error, setError] = useState<string | undefined>()
  const editorDataviewsStatus = useSelector(selectEditorDataviewsStatus)
  const editorDataviews = useSelector(selectEditorDataviews)
  const { addNewDataviewInstances } = useDataviewInstancesConnect()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const workspaceDataviewIds = useSelector(selectWorkspaceDataviewInstancesMergedDataviewIds) || []

  useEffect(() => {
    dispatch(fetchEditorDataviewsThunk())
  }, [dispatch])

  if (
    editorDataviewsStatus === AsyncReducerStatus.Idle ||
    editorDataviewsStatus === AsyncReducerStatus.Loading ||
    workspaceStatus === AsyncReducerStatus.Loading
  ) {
    return <Spinner />
  }

  if (error || editorDataviewsStatus === AsyncReducerStatus.Error) {
    return <p>{error || 'There was an error requesting data'}</p>
  }

  if (!editorDataviews) {
    return <p>There are no dataviews yet</p>
  }

  const groupedDataviews = groupBy(editorDataviews, 'category')

  const onDataviewClick = async (dataview: Dataview) => {
    setLoadingId(dataview.id)
    const dataviewInstance = {
      id: `${dataview.name}-${Date.now()}`,
      dataviewId: dataview.id,
    }
    const datasets = dataview.datasetsConfig?.map(({ datasetId }) => datasetId)
    if (datasets && datasets?.length) {
      const action = await dispatch(fetchDatasetsByIdsThunk(datasets))
      if (!fetchDatasetsByIdsThunk.fulfilled.match(action)) {
        setError((action.payload as AsyncError).message)
      }
    }
    dispatch(addDataviewEntity(dataview))
    addNewDataviewInstances([dataviewInstance])
    setLoadingId(undefined)
  }

  return (
    <div className={styles.row}>
      <ul className={styles.dataviewsList}>
        {Object.entries(groupedDataviews).map(([category, dataviews]) => {
          const sortDataviews = (dataviews || []).sort((a, b) => a.name.localeCompare(b.name))
          return (
            <li key={category}>
              <label>{category}</label>
              <ul>
                {sortDataviews.length > 0 &&
                  sortDataviews.map((dataview) => {
                    const alreadyInWorkspace = workspaceDataviewIds.includes(dataview.id)
                    return (
                      <li
                        key={dataview.id}
                        className={cx(styles.row, { [styles.rowSecondary]: alreadyInWorkspace })}
                      >
                        {dataview.name}{' '}
                        <IconButton
                          loading={dataview.id === loadingId}
                          icon={alreadyInWorkspace ? 'tick' : 'plus'}
                          disabled={alreadyInWorkspace}
                          tooltip={alreadyInWorkspace ? 'Already added' : 'Add to workspace'}
                          size="small"
                          type="border"
                          className={styles.button}
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

export default EditorMenu
