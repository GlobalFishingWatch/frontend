import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import AddButton from 'common/AddButton'
import Field from 'common/Field'
import Section from 'common/Section'
import { setMeta, fetchResources } from 'features/dataviews/dataviews.slice'
import { selectResourcesLoaded } from 'features/dataviews/resources.selectors'
import { selectCurrentDataview } from './dataview.selectors'
import ViewParams from './EditorViewParams'

const ResolvedDatasetParams = ({ params }: any) => {
  if (!params) return null
  return (
    <Section>
      {Object.entries(params).map(([fieldkey, value]: [string, unknown]) => (
        <Field key={fieldkey} fieldkey={fieldkey} value={value as string} />
      ))}
    </Section>
  )
}

const Dataview = () => {
  const dispatch = useDispatch()
  const currentDataview = useSelector(selectCurrentDataview)
  const loaded = useSelector(selectResourcesLoaded)
  if (!currentDataview) return null

  return (
    <Fragment>
      <Section>
        <h2>meta</h2>
        <Field
          fieldkey="name"
          value={currentDataview.name}
          onValueChange={(value) => {
            dispatch(setMeta({ editorId: currentDataview.editorId, field: 'name', value }))
          }}
        />
        <Field
          fieldkey="description"
          value={currentDataview.description}
          onValueChange={(value) => {
            dispatch(setMeta({ editorId: currentDataview.editorId, field: 'description', value }))
          }}
        />
      </Section>
      <Section>
        <h2>datasets</h2>
        {currentDataview.datasets &&
          currentDataview.datasets?.map((dataset) => (
            <input type="text" key={dataset.id} value={dataset.id} readOnly />
          ))}
        <button>load datasets fields</button>
        <AddButton />
      </Section>
      <Section>
        <h2>defaultDatasetParams</h2>
        {currentDataview.defaultDatasetsParams?.map(
          (resolvedDatasetParams: Record<string, unknown>, index: number) => (
            <ResolvedDatasetParams key={index} params={resolvedDatasetParams} />
          )
        )}
        <button
          onClick={() => {
            dispatch(fetchResources([currentDataview]))
          }}
          className={cx('large', { done: loaded, dirty: !loaded })}
          disabled={!loaded}
        >
          load endpoints data
        </button>
      </Section>
      <Section>
        <h2>defaultView</h2>
        <ViewParams />
      </Section>
    </Fragment>
  )
}

export default Dataview
