import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useDatasetsAPI, useDatasetModalConnect } from './datasets.hook'
import styles from './NewDataset.module.css'
import { selectDatasetById } from './datasets.slice'

export type EditDatasetMetadata = {
  name?: string
  description?: string
}

function EditDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { editingDatasetId, datasetModal, dispatchDatasetModal } = useDatasetModalConnect()
  const dataset = useSelector(selectDatasetById(editingDatasetId as string))
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<EditDatasetMetadata | undefined>({
    name: dataset?.name,
    description: dataset?.description,
  })

  const { dispatchUpdateDataset } = useDatasetsAPI()

  const onDatasetFieldChange = (field: any) => {
    setMetadata({ ...metadata, ...field })
  }

  const onUpdateClick = async () => {
    if (metadata) {
      setLoading(true)
      await dispatchUpdateDataset({ id: editingDatasetId, ...metadata })
      onClose()
    }
  }

  const onClose = async () => {
    setLoading(false)
    setMetadata(undefined)
    dispatchDatasetModal(undefined)
  }

  const allowUpdate =
    (metadata?.name && metadata?.name !== dataset?.name) ||
    (metadata?.description && metadata?.description !== dataset?.description)

  return (
    <Modal
      title={t('dataset.edit', 'Edit dataset')}
      isOpen={datasetModal === 'edit'}
      contentClassName={styles.modalContainer}
      onClose={onClose}
    >
      <div className={styles.datasetConfig}>
        <InputText
          inputSize="small"
          value={metadata?.name !== undefined ? metadata.name : dataset?.name}
          label={t('common.name', 'Name')}
          className={styles.input}
          onChange={(e) => onDatasetFieldChange({ name: e.target.value })}
        />
        <InputText
          value={metadata?.description !== undefined ? metadata.description : dataset?.description}
          inputSize="small"
          label={t('common.description', 'Description')}
          className={styles.input}
          onChange={(e) => onDatasetFieldChange({ description: e.target.value })}
        />
      </div>
      <div className={styles.modalFooter}>
        <Button
          disabled={!allowUpdate}
          className={styles.saveBtn}
          onClick={onUpdateClick}
          loading={loading}
        >
          {t('common.update', 'Update') as string}
        </Button>
      </div>
    </Modal>
  )
}

export default EditDataset
