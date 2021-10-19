import React, { useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { InputText, Modal, Button } from '@globalfishingwatch/ui-components'
import {
  Dataset,
  DatasetCategory,
  EnviromentalDatasetConfiguration,
} from '@globalfishingwatch/api-types'
import { useDatasetsAPI, useDatasetModalConnect } from './datasets.hook'
import styles from './NewDataset.module.css'
import { selectDatasetById } from './datasets.slice'

export type EditDatasetMetadata = Pick<
  EnviromentalDatasetConfiguration,
  'propertyToInclude' | 'propertyToIncludeRange'
> & {
  name?: string
  description?: string
}

const checkChanges = (metadata: EditDatasetMetadata | undefined, dataset: Dataset | undefined) => {
  const hasChangedName = metadata?.name && metadata?.name !== dataset?.name
  const hasChangedDescription =
    metadata?.description && metadata?.description !== dataset?.description
  const hasChangedPropertyToInclude =
    metadata?.propertyToInclude &&
    metadata?.propertyToInclude !==
      (dataset?.configuration as EnviromentalDatasetConfiguration)?.propertyToInclude
  const hasChangedPropertyToIncludeRange =
    metadata?.propertyToIncludeRange &&
    metadata?.propertyToIncludeRange !==
      (dataset?.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange

  return (
    hasChangedName ||
    hasChangedDescription ||
    hasChangedPropertyToInclude ||
    hasChangedPropertyToIncludeRange
  )
}

function EditDataset(): React.ReactElement {
  const { t } = useTranslation()
  const { datasetCategory, datasetModal, editingDatasetId, dispatchDatasetModal } =
    useDatasetModalConnect()
  const dataset = useSelector(selectDatasetById(editingDatasetId as string))
  const [loading, setLoading] = useState(false)
  const [metadata, setMetadata] = useState<EditDatasetMetadata | undefined>({
    name: dataset?.name,
    description: dataset?.description,
    propertyToInclude: (dataset?.configuration as EnviromentalDatasetConfiguration)
      ?.propertyToInclude,
    propertyToIncludeRange: (dataset?.configuration as EnviromentalDatasetConfiguration)
      ?.propertyToIncludeRange,
  })

  const { dispatchUpdateDataset } = useDatasetsAPI()

  const onDatasetFieldChange = (field: any) => {
    setMetadata({ ...metadata, ...field })
  }

  const onUpdateClick = async () => {
    if (metadata) {
      setLoading(true)
      const updatedDataset = {
        id: editingDatasetId,
        name: metadata.name,
        description: metadata.description,
        configuration: {
          ...dataset?.configuration,
          propertyToInclude: metadata.propertyToInclude,
          propertyToIncludeRange: metadata.propertyToIncludeRange,
        },
      }
      await dispatchUpdateDataset(updatedDataset)
      onClose()
    }
  }

  const onClose = async () => {
    setLoading(false)
    setMetadata(undefined)
    dispatchDatasetModal(undefined)
  }

  const allowUpdate = checkChanges(metadata, dataset)

  const showEnvironmentalFields =
    datasetCategory === DatasetCategory.Environment &&
    dataset?.configuration?.geometryType !== 'tracks'

  const { min, max } = metadata?.propertyToIncludeRange || {}

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
        {showEnvironmentalFields && (
          <div className={styles.row}>
            <InputText
              value={metadata?.propertyToInclude}
              inputSize="small"
              label={t('dataset.colorByValue', 'Color features by value')}
              className={cx(styles.input, styles.inputFullWidth)}
              onChange={(e) => onDatasetFieldChange({ propertyToInclude: e.target.value })}
            />
            <InputText
              inputSize="small"
              type="number"
              step="0.1"
              value={min}
              label={t('common.min', 'Min')}
              placeholder={t('common.min', 'Min')}
              className={styles.mediumInput}
              onChange={(e) =>
                onDatasetFieldChange({
                  propertyToIncludeRange: {
                    min: e.target.value && parseFloat(e.target.value),
                    max: metadata?.propertyToIncludeRange?.max,
                  },
                })
              }
            />
            <InputText
              inputSize="small"
              type="number"
              step="0.1"
              label={t('common.max', 'Max')}
              placeholder={t('common.max', 'Max')}
              value={max}
              className={styles.mediumInput}
              onChange={(e) =>
                onDatasetFieldChange({
                  propertyToIncludeRange: {
                    min: metadata?.propertyToIncludeRange?.min,
                    max: e.target.value && parseFloat(e.target.value),
                  },
                })
              }
            />
          </div>
        )}
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
