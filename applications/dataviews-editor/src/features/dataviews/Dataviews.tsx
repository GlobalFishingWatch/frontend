import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { selectAddedDataviews } from './dataviews.selectors'
import ListItem from 'common/ListItem'
import { selectDataviews } from './dataviews.slice'
import Section from 'common/Section'
import AddButton from 'common/AddButton'

const Dataviews = () => {
  const addedDataviews = useSelector(selectAddedDataviews)
  const dataviews = useSelector(selectDataviews)
  return <Fragment>
    <Section>
      <ul>
        {addedDataviews.map((dataview) => 
          <ListItem
            key={dataview.id}
            title={dataview.id}
            checked={dataview.added}
            editing={dataview.editing}
            dirty={dataview.dirty}
            showActions={dataview.editing}
          />
        )}
      </ul>
    </Section>
    <Section>
      <ul>
        {dataviews.map((dataview) =>
          <ListItem
            key={dataview.id}
            title={dataview.id}
            checked={dataview.added}
            editing={dataview.editing}
            dirty={dataview.dirty}
          />
        )}
      </ul>
      <AddButton />
    </Section>
  </Fragment>
}

export default Dataviews
