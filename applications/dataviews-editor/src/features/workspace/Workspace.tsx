import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ListItem from 'common/ListItem'
import Section from 'common/Section'
import { selectWorkspaceId, selectWorkspaces, setWorkspaceId } from './workspace.slice'

const Workspaces = () => {
  const dispatch = useDispatch()
  const worspaces = useSelector(selectWorkspaces)
  const workspaceId = useSelector(selectWorkspaceId)
  // const dataviews = useSelector(selectWorkspaceDataviews)

  return (
    <Fragment>
      <Section>
        <h2>Workspaces list</h2>
        <ul>
          {worspaces?.map((workspace) => (
            <ListItem
              key={workspace.id}
              checked={workspace.id === workspaceId}
              title={workspace.description || workspace.id.toString()}
              onClick={() => dispatch(setWorkspaceId({ id: workspace.id }))}
            />
          ))}
        </ul>
      </Section>
      {/* <Section>
        <h2>current workspace</h2>
        <ListItem
          title={workspaceId}
          onChange={(value) => {
            dispatch(setWorkspaceId({ id: value }))
          }}
        />
        <button
          onClick={() => {
            dispatch(fetchWorkspace({ id: workspaceId }))
          }}
          className={cx('large', {
            done: !!dataviews?.length,
          })}
        >
          load workspace data
        </button>
        <ul>
          {dataviews.map((dataview) => (
            <ListItem key={dataview.editorId} title={dataview.editorId.toString()} />
          ))}
        </ul>
      </Section> */}
    </Fragment>
  )
}

export default Workspaces
