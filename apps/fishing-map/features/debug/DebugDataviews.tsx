import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import JsonView from '@uiw/react-json-view'
import { darkTheme } from '@uiw/react-json-view/dark'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Icon, IconButton, InputText, Switch } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { debugDatasetsInDataviews, debugRelatedDatasets } from 'features/datasets/datasets.debug'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectAllDataviewInstancesResolved } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectIsGFWDeveloper } from 'features/user/selectors/user.selectors'
import { selectLocationQuery } from 'routes/routes.selectors'

import styles from './DebugMenu.module.css'

const DebugDataviews: React.FC = () => {
  const isGFWDeveloper = useSelector(selectIsGFWDeveloper)
  const locationQuery = useSelector(selectLocationQuery)
  const [datasetId, setDatasetId] = useState<string>('')
  const dataviews = useSelector(selectAllDataviewInstancesResolved) as UrlDataviewInstance[]
  const datasets = useSelector(selectAllDatasets)

  useEffect(() => {
    if (datasetId?.length > 4) {
      debugDatasetsInDataviews(dataviews, datasetId)
      debugRelatedDatasets(datasets, datasetId)
    }
  }, [datasetId, dataviews, datasets])

  return (
    <section className={styles.container}>
      {isGFWDeveloper && (
        <Fragment>
          <div className={styles.header}>
            <label className={styles.labelFull} htmlFor="dataset_relationship">
              Debug dataset relationship{' '}
              <IconButton
                icon="info"
                size="small"
                tooltip="Type the dataset id you want to debug why it is loaded in the workspace and check the console log"
              />
            </label>
            <InputText
              className={styles.input}
              value={datasetId}
              inputSize="small"
              onChange={(e) => setDatasetId(e.target.value)}
            />
          </div>
          <p></p>
        </Fragment>
      )}
      <div className={styles.header}>
        <label>Current URL workspace settings</label>
      </div>
      <div className={styles.editor}>
        <JsonView value={locationQuery} style={darkTheme} />
      </div>
    </section>
  )
}

export default DebugDataviews
