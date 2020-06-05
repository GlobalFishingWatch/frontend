import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import AddButton from 'common/AddButton'
import ListItem from 'common/ListItem'
import Section from 'common/Section'
import { toggleDataview } from 'features/workspace/workspace.slice'
import { selectAddedDataviews, selectEditorDataviews } from './dataviews.selectors'
import { EditorDataview, setEditing, setMeta } from './dataviews.slice'

const Dataviews = () => {
  const dispatch = useDispatch()
  const addedDataviews = useSelector(selectAddedDataviews)
  const dataviews = useSelector(selectEditorDataviews)
  return (
    <Fragment>
      <Section>
        <h2>current dataviews</h2>
        <ul>
          {addedDataviews.map((dataview) => (
            <ListItem
              key={dataview.id}
              title={dataview.name}
              editing={dataview.editing}
              dirty={dataview.dirty}
              showActions={dataview.editing}
              checked
              onToggle={(toggle) => {
                dispatch(toggleDataview({ id: dataview.id, added: toggle }))
              }}
              onClick={() => {
                dispatch(setEditing(dataview.id))
              }}
              onChange={(value) => {
                dispatch(setMeta({ id: dataview.id, field: 'name', value }))
              }}
            />
          ))}
        </ul>
      </Section>
      <Section>
        <h2>all dataviews</h2>
        <ul>
          {dataviews.map((dataview: EditorDataview) => (
            <ListItem
              key={dataview.id}
              title={dataview.name}
              editing={dataview.editing}
              dirty={dataview.dirty}
              checked={dataview.added}
              onToggle={(toggle) => {
                dispatch(toggleDataview({ id: dataview.id, added: toggle }))
              }}
            />
          ))}
        </ul>
        <AddButton />
      </Section>
    </Fragment>
  )
}

export default Dataviews
