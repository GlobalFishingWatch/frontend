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
import { setMeta, fetchResources, setViewParams } from 'features/dataviews/dataviews.slice'
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

const ResolvedViewParams = ({ editorId, params }: { editorId: number; params?: ViewParams }) => {
  const dispatch = useDispatch()
  if (!params) return null
  return (
    <Fragment>
      {Object.entries(params).map(([fieldkey, value]: [string, unknown]) =>
        fieldkey === 'type' ? (
          <DataviewTypeDropdown key={fieldkey} />
        ) : (
          <Field
            key={fieldkey}
            keyEditable
            fieldkey={fieldkey}
            value={value as string}
            onValueChange={(value) => {
              const newParams = {
                ...params,
                [fieldkey]: value,
              }
              dispatch(
                setViewParams({
                  editorId,
                  params: newParams,
                })
              )
            }}
          />
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
        <button
          onClick={() => {
            dispatch(fetchResources([currentDataview]))
          }}
          className={cx('large', { done: loaded, dirty: !loaded })}
          disabled={!loaded}
        >
          load endpoints data
        </button>
        {currentDataview.datasets &&
          currentDataview.datasets?.map((dataset) => (
            <input type="text" key={dataset.id} value={dataset.id} />
          ))}
        <AddButton />
      </Section>
      <Section>
        <h2>defaultDatasetParams</h2>
        {/* // TODO defaultViewParams -> viewParams when we have the hook */}
        {currentDataview.defaultDatasetsParams?.map(
          (resolvedDatasetParams: Record<string, unknown>, index: number) => (
            <ResolvedDatasetParams key={index} params={resolvedDatasetParams} />
          )
        )}
      </Section>
      <Section>
        <h2>defaultViewParams</h2>
        {/* // TODO defaultViewParams -> viewParams when we have the hook */}
        <ResolvedViewParams
          editorId={currentDataview.editorId}
          params={currentDataview.defaultViewParams}
        />
        <AddButton />
      </Section>
    </Fragment>
  )
}

export default Dataview
