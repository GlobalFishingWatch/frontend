import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
// import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { Dataset } from '@globalfishingwatch/api-types'
import { useNewDatasetModalConnect } from 'features/datasets/datasets.hook'
import styles from './User.module.css'

function UserDatasets({ datasets }: { datasets: Dataset[] }) {
  const { t } = useTranslation()
  const { dispatchNewDatasetModal } = useNewDatasetModalConnect()
  return (
    <div className={styles.views}>
      <label>Your latest datasets</label>
      <Button onClick={() => dispatchNewDatasetModal(true)}>
        {t('datasets.new', 'New dataset') as string}
      </Button>
      <ul>
        {datasets?.map((dataset) => {
          return (
            <li className={styles.workspace} key={dataset.id}>
              {dataset.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default UserDatasets
