import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { Generators } from '@globalfishingwatch/layer-composer'
import { ViewParams } from '@globalfishingwatch/dataviews-client/dist/types'
import AddButton from 'common/AddButton'
import Field from 'common/Field'
import fieldStyles from 'common/Field.module.css'
import Section from 'common/Section'
import { selectCurrentDataview } from 'features/dataviews/dataviews.selectors'
import { setMeta, fetchResources } from 'features/dataviews/dataviews.slice'
import { selectResourcesLoaded } from 'features/dataviews/resources.selectors'

const DataviewTypeDropdown = () => {
  return (
    <div className={fieldStyles.field}>
      <span className={fieldStyles.fieldkey}>type</span>
      <select className={fieldStyles.value}>
        {Object.entries(Generators.Type).map(([t, v]: [string, string]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

const ResolvedViewParams = ({ id, params }: { id: number; params?: ViewParams }) => {
  if (!params) return null
  return (
    <Fragment>
      {Object.entries(params).map(([fieldkey, value]: [string, unknown]) =>
        fieldkey === 'type' ? (
          <DataviewTypeDropdown key={fieldkey} />
        ) : (
          <Field key={fieldkey} keyEditable fieldkey={fieldkey} value={value as string} />
        )
      )}
    </Fragment>
  )
}

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
  const dataview = useSelector(selectCurrentDataview)
  const loaded = useSelector(selectResourcesLoaded)
  if (!dataview) return null

  return (
    <Fragment>
      <Section>
        <h2>meta</h2>
        <Field
          fieldkey="name"
          value={dataview.name}
          onValueChange={(value) => {
            dispatch(setMeta({ id: dataview.id, field: 'name', value }))
          }}
        />
        <Field
          fieldkey="description"
          value={dataview.description}
          onValueChange={(value) => {
            dispatch(setMeta({ id: dataview.id, field: 'description', value }))
          }}
        />
      </Section>
      <Section>
        <h2>datasets</h2>
        <button
          onClick={() => {
            dispatch(fetchResources([dataview]))
          }}
          className={cx('large', { done: loaded, dirty: !loaded })}
          disabled={!loaded}
        >
          load endpoints data
        </button>
        {dataview.datasets &&
          dataview.datasets?.map((dataset) => (
            <input type="text" key={dataset.id} value={dataset.id} />
          ))}
        <AddButton />
      </Section>
      <Section>
        <h2>defaultDatasetParams</h2>
        {/* // TODO defaultViewParams -> viewParams when we have the hook */}
        {dataview.defaultDatasetsParams?.map(
          (resolvedDatasetParams: Record<string, unknown>, index: number) => (
            <ResolvedDatasetParams key={index} params={resolvedDatasetParams} />
          )
        )}
      </Section>
      <Section>
        <h2>defaultViewParams</h2>
        {/* // TODO defaultViewParams -> viewParams when we have the hook */}
        <ResolvedViewParams id={dataview.id} params={dataview.defaultViewParams} />
        <AddButton />
      </Section>
    </Fragment>
  )
}

export default Dataview
