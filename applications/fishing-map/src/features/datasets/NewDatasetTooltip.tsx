import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Spinner } from '@globalfishingwatch/ui-components'
import { AsyncReducerStatus } from 'types'
import { useDatasetModalConnect } from './datasets.hook'
import { selectUserDatasets } from './datasets.selectors'
import { selectDatasetsStatus } from './datasets.slice'
import styles from './NewDatasetTooltip.module.css'

function NewDatasetTooltip(): React.ReactElement {
  const { t } = useTranslation()
  const { dispatchDatasetModal } = useDatasetModalConnect()
  const datasets = useSelector(selectUserDatasets)
  const datasetsStatus = useSelector(selectDatasetsStatus)

  // TODO: review if request all datasets is needed as by default
  // only the ones used in the workspace are available
  // useEffect(() => {
  //   if (datasetsStatus !== AsyncReducerStatus.Finished) {
  //     dispatch(fetchDatasetsByIdsThunk([]))
  //   }
  // }, [datasetsStatus, dispatch])

  const onAddNewClick = async () => {
    dispatchDatasetModal('new')
  }

  const onSelectClick = async (dataset: any) => {
    console.log(dataset)
  }

  return (
    <div className={styles.container}>
      <ul>
        <li className={styles.create} onClick={onAddNewClick}>
          {t('dataset.uploadNew', 'Upload new dataset')}
        </li>
        {datasetsStatus === AsyncReducerStatus.Loading ? (
          <Spinner />
        ) : (
          datasets.map((dataset) => (
            <li key={dataset.id} onClick={() => onSelectClick(dataset)}>
              {dataset.name}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default NewDatasetTooltip
