import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { Button } from '@globalfishingwatch/ui-components'
import UserGuideLink from 'features/help/UserGuideLink'
import { DatasetMetadata, NewDatasetProps } from 'features/datasets/upload/NewDataset'
import styles from './NewDataset.module.css'

function NewPointDataset({ onConfirm }: NewDatasetProps): React.ReactElement {
  const { t } = useTranslation()

  const onConfirmClick = useCallback(() => {
    onTheFlyGeoJSONFile = getFileFromGeojson(fileData as Feature)
  }, [])
  return (
    <div>
      <div className={styles.content}>Points dataset configuration here</div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {/* {error && <span className={styles.errorMsg}>{error}</span>} */}
          {/* // TODO update sections by categoreies */}
          <UserGuideLink section="uploadReference" />
        </div>
        <Button
          className={styles.saveBtn}
          onClick={onConfirmClick}
          // disabled={!file || !metadata?.name}
          // loading={loading}
        >
          {t('common.confirm', 'Confirm') as string}
        </Button>
      </div>
    </div>
  )
}

export default NewPointDataset
