import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AddButton from 'common/AddButton'
import ListItem from 'common/ListItem'
import Section from 'common/Section'
import { toggleDataview } from 'features/workspace/workspace.slice'
import { selectAddedDataviews, selectEditorDataviews } from './dataviews.selectors'
import {
  setEditing,
  setMeta,
  addDataview,
  startUpdatingDataview,
  startDeletingDataview,
} from './dataviews.slice'
import styles from './Dataviews.module.css'

const Dataviews = () => {
  const dispatch = useDispatch()
  const dataviews = useSelector(selectEditorDataviews)
  const addedDataviews = useSelector(selectAddedDataviews)

  return (
    <Fragment>
      <Section>
        <h2>current dataviews</h2>
        <ul>
          {addedDataviews.map((dataview) => (
            <div className={styles.dataviewContainer}>
              <span className={styles.dataviewId}>{dataview.editorId}</span>
              <ListItem
                key={dataview.editorId}
                title={dataview.name}
                editing={dataview.editing}
                dirty={dataview.dirty}
                showActions={dataview.editing}
                checked
                onToggle={(toggle) => {
                  dispatch(toggleDataview({ editorId: dataview.editorId, added: toggle }))
                }}
                onClick={() => {
                  dispatch(setEditing(dataview.editorId))
                }}
                onChange={(value) => {
                  dispatch(setMeta({ editorId: dataview.editorId, field: 'name', value }))
                }}
                onSave={() => {
                  dispatch(startUpdatingDataview(dataview))
                }}
                onDelete={() => {
                  dispatch(startDeletingDataview(dataview))
                }}
              />
            </div>
          ))}
        </ul>
      </Section>
      <Section>
        <h2>all dataviews</h2>
        <ul>
          {dataviews.map((dataview) => (
            <ListItem
              key={dataview.editorId}
              title={dataview.name}
              editing={dataview.editing}
              dirty={dataview.dirty}
              checked={dataview.added || false}
              onToggle={(toggle) => {
                dispatch(toggleDataview({ editorId: dataview.editorId, added: toggle }))
              }}
            />
          ))}
        </ul>
        <AddButton
          onClick={() => {
            dispatch(addDataview())
          }}
        />
      </Section>
    </Fragment>
  )
}

export default Dataviews
