import React, { useState, useCallback, Fragment } from 'react'
import type { FeatureCollectionWithFilename } from 'shpjs'
import { useTranslation } from 'react-i18next'
// import { parse as parseCSV } from 'papaparse'
import { Feature } from 'geojson'
import {
  Modal,
  Button,
  Select,
  SelectOption,
  InputText,
  TextArea,
} from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT, SUPPORT_EMAIL } from 'data/config'
import styles from './VesselGroupModal.module.css'

export type CSV = Record<string, any>[]

function VesselGroupModal(): React.ReactElement {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | undefined>()
  const [fileData, setFileData] = useState<
    Feature | FeatureCollectionWithFilename | CSV | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onClose = useCallback(() => {
    console.log('close')
  }, [])

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={t('vesselGroup.vesselGroup', 'Vessel group')}
      isOpen={true}
      //   isOpen={datasetModal === 'new'}
      contentClassName={styles.modalContainer}
      onClose={onClose}
      fullScreen={true}
    >
      <div className={styles.modalContent}>
        <div className={styles.parameters}>
          <InputText
            id="groupName"
            label={t('vesselGroup.groupName', 'Group name')}
            type={'text'}
            value={'Long Xing'}
            onChange={(e) => console.log(e)}
          />
          <Select
            key="source"
            label={t('vesselGroup.source', 'Source')}
            options={[{ id: 'ais', label: 'ais' }]}
            selectedOption={{ id: 'ais', label: 'ais' }}
            onSelect={(e) => console.log(e)}
          />
          <Select
            key="IDfield"
            label={t('vesselGroup.idField', 'ID field')}
            options={[{ id: 'MMSI', label: 'MMSI' }]}
            selectedOption={{ id: 'MMSI', label: 'MMSI' }}
            onSelect={(e) => console.log(e)}
          />
        </div>
        <div className={styles.vesselGroup}>
          <div className={styles.ids}>
            <TextArea
              content={'1234567, 123242432, 2312321'}
              label={t('vesselGroup.ids', 'IDs')}
              //   label={t('vesselGroup.idsWithCount', 'IDs ({{count}})', {
              //     count: 123,
              //   })}
              placeholder={t(
                'vesselGroup.idsPlaceholder',
                'Type here or paste a list of IDs separated by commas, spaces or line breaks'
              )}
            />
          </div>
          <div>drag n drop or vessel list here</div>
        </div>
        {/* <Fragment>

          file here
          <DatasetFile onFileLoaded={onFileLoaded} type={datasetGeometryType} />
            {fileData && metadata && (
              <DatasetConfig
                fileData={fileData as FeatureCollectionWithFilename}
                metadata={metadata}
                datasetCategory={datasetCategory}
                // eslint-disable-next-line
                datasetGeometryType={datasetGeometryType!}
                onDatasetFieldChange={onDatasetFieldChange}
              />
            )}
        </Fragment> */}
      </div>
      <div className={styles.modalFooter}>
        <div className={styles.footerMsg}>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <span className={styles.hint}>
            <a
              href="https://globalfishingwatch.org/article-categories/reference-layers/"
              target="_blank"
              rel="noreferrer"
            >
              {t('dataset.hint', 'Find out more about the supported formats')}
            </a>
          </span>
        </div>

        <Button
          disabled={true}
          // onClick={onConfirmClick}
          loading={loading}
        >
          {t('common.save', 'Save')}
        </Button>
      </div>
    </Modal>
  )
}

export default VesselGroupModal
