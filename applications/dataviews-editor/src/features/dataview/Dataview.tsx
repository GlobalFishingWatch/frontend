import React, { Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import { DatasetParams } from '@globalfishingwatch/dataviews-client'
import AddButton from 'common/AddButton'
import Field from 'common/Field'
import Section from 'common/Section'
import {
  setMeta,
  setDatasetEndpoint,
  setDatasetParams,
  fetchResources,
} from 'features/dataviews/dataviews.slice'
import { selectResourcesLoaded } from 'features/dataviews/resources.selectors'
import ListItem from 'common/ListItem'
import { selectCurrentDataview } from './dataview.selectors'
import ViewParams from './EditorViewParams'
import styles from './Dataview.module.css'

// const ResolvedDatasetParams = ({ params }: any) => {
//   if (!params) return null
//   return (
//     <Section>
//       {Object.entries(params).map(([fieldkey, value]: [string, unknown]) => (
//         <Field key={fieldkey} fieldkey={fieldkey} value={value as string} />
//       ))}
//     </Section>
//   )
// }

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
          currentDataview.datasets?.map((dataset) => {
            return (
              <Fragment key={dataset.id}>
                <input type="text" key={dataset.id} value={dataset.id} readOnly />
                <Section>
                  <h3>endpoints</h3>
                  <ul>
                    {dataset.endpoints?.map((endpoint, index) => {
                      const isSelectedEndpoint = endpoint.type === currentDataview.selectedEndpoint
                      return (
                        <Fragment key={index}>
                          <ListItem
                            editable={false}
                            title={endpoint.type}
                            checked={isSelectedEndpoint}
                            onToggle={(toggle) => {
                              dispatch(
                                setDatasetEndpoint({
                                  editorId: currentDataview.editorId,
                                  dataset: dataset.id,
                                  endpoint: toggle ? endpoint.type : '',
                                })
                              )
                            }}
                          />
                        </Fragment>
                      )
                    })}
                  </ul>
                </Section>
              </Fragment>
            )
          })}
        <AddButton />
      </Section>
      <Section>
        <h2>defaultDatasetParams</h2>
        {currentDataview.datasets &&
          currentDataview.datasets?.map((dataset, index) => {
            const selectedEndpoint = dataset.endpoints?.find(
              (endpoint) => endpoint.type === currentDataview.selectedEndpoint
            )
            if (!selectedEndpoint) return null
            return (
              <div className={styles.maxHeight} key={index}>
                <Section>
                  <h2>Params</h2>
                  {selectedEndpoint.params.map((param) => {
                    const defaultDatasetValue =
                      currentDataview.defaultDatasetsParams &&
                      currentDataview.defaultDatasetsParams[index]['params']
                        ? ((currentDataview.defaultDatasetsParams[index][
                            'params'
                          ] as DatasetParams)[param.id] as string)
                        : ''
                    return (
                      <Field
                        key={param.id}
                        fieldkey={param.label}
                        value={defaultDatasetValue || (param.default as string)}
                        onValueChange={(value) =>
                          dispatch(
                            setDatasetParams({
                              editorId: currentDataview.editorId,
                              type: 'params',
                              params: { [param.id]: value },
                            })
                          )
                        }
                      />
                    )
                  })}
                  <h2>Query</h2>
                  {selectedEndpoint.query.map((query) => {
                    const defaultDatasetQueryValue =
                      currentDataview.defaultDatasetsParams &&
                      currentDataview.defaultDatasetsParams[index]['query']
                        ? ((currentDataview.defaultDatasetsParams[index]['query'] as DatasetParams)[
                            query.id
                          ] as string)
                        : ''
                    return (
                      <Field
                        key={query.id}
                        fieldkey={query.label}
                        value={defaultDatasetQueryValue || (query.default as string)}
                        onValueChange={(value) =>
                          dispatch(
                            setDatasetParams({
                              editorId: currentDataview.editorId,
                              type: 'query',
                              params: { [query.id]: value },
                            })
                          )
                        }
                      />
                    )
                  })}
                </Section>
              </div>
            )
          })}
        {currentDataview.selectedEndpoint && (
          <button
            onClick={() => {
              dispatch(fetchResources([currentDataview]))
            }}
            className={cx('large', {
              done: loaded && currentDataview.defaultDatasetsParams?.length,
              dirty: !loaded,
            })}
            disabled={!loaded || !currentDataview.defaultDatasetsParams?.length}
          >
            load endpoints data
          </button>
        )}
      </Section>
      <Section>
        <h2>defaultView</h2>
        <ViewParams />
      </Section>
    </Fragment>
  )
}

export default Dataview
