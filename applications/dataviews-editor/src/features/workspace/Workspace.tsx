import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import ListItem from 'common/ListItem'
import Section from 'common/Section'
import { selectWorkspaceDataviews } from './workspace.slice'

const Dataviews = () => {
  const dataviews = useSelector(selectWorkspaceDataviews)
  console.log('Dataviews -> dataviews', dataviews)

  return (
    <Fragment>
      <Section>
        <h2>current workspaces</h2>
        <ul>
          {dataviews.map((dataview) => (
            <ListItem key={dataview.editorId} title={dataview.editorId.toString()} />
          ))}
        </ul>
      </Section>
    </Fragment>
  )
}

export default Dataviews
