import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Dataset } from '@globalfishingwatch/api-types'
import { useNewDatasetModalConnect } from 'features/datasets/datasets.hook'
import { deleteDatasetThunk, selectDatasetsStatusId } from 'features/datasets/datasets.slice'
import styles from './User.module.css'

function UserDatasets({ datasets }: { datasets: Dataset[] }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { dispatchNewDatasetModal } = useNewDatasetModalConnect()
  const datasetStatusId = useSelector(selectDatasetsStatusId)

  const onDeleteClick = useCallback(
    async (dataset: Dataset) => {
      const confirmation = window.confirm(
        `Are you sure you want to permanently delete this dataset?\n${dataset.name}`
      )
      if (confirmation) {
        dispatch(deleteDatasetThunk(dataset.id))
      }
    },
    [dispatch]
  )

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>Your latest datasets</label>
        <Button onClick={() => dispatchNewDatasetModal(true)}>
          {t('dataset.new', 'New dataset') as string}
        </Button>
      </div>
      <ul>
        {datasets?.map((dataset) => {
          return (
            <li className={styles.dataset} key={dataset.id}>
              {dataset.name}
              <div>
                <IconButton icon="info" tooltip={dataset.description} />
                <IconButton
                  icon="delete"
                  type="warning"
                  loading={dataset.id === datasetStatusId}
                  tooltip="Remove dataset"
                  onClick={() => onDeleteClick(dataset)}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserDatasets
