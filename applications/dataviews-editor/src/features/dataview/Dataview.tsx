import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Generators } from '@globalfishingwatch/layer-composer'
import AddButton from 'common/AddButton'
import Field from 'common/Field'
import fieldStyles from 'common/Field.module.css'
import Section from 'common/Section'
import { selectCurrentDataview } from 'features/dataviews/dataviews.selectors'

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

const ResolvedViewParams = ({ params }: any) => {
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
    <Fragment>
      {Object.entries(params).map(([fieldkey, value]: [string, unknown]) => (
        <Field key={fieldkey} fieldkey={fieldkey} value={value as string} />
      ))}
    </Fragment>
  )
}

const Dataview = () => {
  const dataview = useSelector(selectCurrentDataview)
  if (!dataview) return null

  return (
    <Fragment>
      <Section>
        <h2>meta</h2>
        <Field fieldkey="name" value={dataview.name} />
        <Field fieldkey="description" value={dataview.description} />
      </Section>
      <Section>
        <h2>datasets</h2>
        <button className={cx('large', 'done')}>load endpoints data</button>
        {dataview.datasetIds &&
          dataview.datasetIds?.map((datasetId) => (
            <input type="text" key={datasetId} value={datasetId} />
          ))}
        <AddButton />
      </Section>
      <Section>
        <h2>defaultDatasetParams</h2>
        {dataview.datasetsParams?.map((resolvedDatasetParams, index) => (
          <ResolvedDatasetParams key={index} params={resolvedDatasetParams} />
        ))}
      </Section>
      <Section>
        <h2>defaultViewParams</h2>
        <ResolvedViewParams params={dataview.viewParams} />
        <AddButton />
      </Section>
    </Fragment>
  )
}

export default Dataview
