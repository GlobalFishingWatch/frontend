import React, { useState, Fragment } from 'react'
import cx from 'classnames'
import { useDropzone } from 'react-dropzone'
import Select, {
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import Map from 'features/map/Map'
import { useModalConnect } from 'features/modal/modal.hooks'
import { DATASET_TYPE_OPTIONS } from 'data/data'
import { ReactComponent as CustomShapeFormats } from 'assets/custom-shape-formats.svg'
import styles from './NewDataset.module.css'
import { useDraftDatasetConnect, useDatasetsAPI } from './datasets.hook'
import { DatasetDraftData, DatasetTypes } from './datasets.slice'

interface InfoFieldsProps {
  datasetInfo?: DatasetDraftData
  onContinue: (info: DatasetDraftData) => void
}

const InfoFields: React.FC<InfoFieldsProps> = (props) => {
  const { datasetInfo, onContinue } = props

  const [datasetName, setDatasetName] = useState<string | undefined>(datasetInfo?.name || '')
  const [datasetDescription, setDatasetDescription] = useState<string | undefined>(
    datasetInfo?.description || ''
  )
  const [datasetType, setDatasetType] = useState<DatasetTypes | undefined>(datasetInfo?.type)

  const onSelectDatasetType: SelectOnChange = (option) => {
    setDatasetType(option.id as DatasetTypes)
  }
  const onCleanDatasetType: SelectOnRemove = () => {
    setDatasetType(undefined)
  }
  const onRemoveDatasetType: SelectOnChange = () => {
    setDatasetType(undefined)
  }

  return (
    <Fragment>
      <InputText
        label="Name"
        placeholder="Name your dataset"
        className={styles.input}
        value={datasetName}
        onChange={(e) => setDatasetName(e.target.value)}
      />
      <InputText
        label="Description"
        placeholder="Descript your dataset"
        className={styles.input}
        value={datasetDescription}
        onChange={(e) => setDatasetDescription(e.target.value)}
      />
      <div className={styles.input}>
        <Select
          label="Type"
          options={DATASET_TYPE_OPTIONS}
          selectedOption={DATASET_TYPE_OPTIONS.find((o) => o.id === datasetType)}
          onSelect={onSelectDatasetType}
          onRemove={onRemoveDatasetType}
          onCleanClick={onCleanDatasetType}
        ></Select>
      </div>
      <Button
        onClick={() =>
          onContinue({ name: datasetName, description: datasetDescription, type: datasetType })
        }
        disabled={
          !datasetName ||
          !datasetDescription ||
          !datasetType ||
          datasetType !== 'user-context-layer:v1'
        }
        className={styles.saveBtn}
      >
        {!datasetType || datasetType === 'user-context-layer:v1' ? 'CONTINUE' : 'COMING SOON'}
      </Button>
    </Fragment>
  )
}

interface DataFieldsProps {
  datasetInfo?: DatasetDraftData
  onContinue: () => void
}

const DataFields: React.FC<DataFieldsProps> = (props) => {
  const { datasetInfo, onContinue } = props
  const [loading, setLoading] = useState(false)
  const { draftDataset, dispatchResetDraftDataset } = useDraftDatasetConnect()
  const { createDataset } = useDatasetsAPI()
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone()
  const onContinueClick = async () => {
    setLoading(true)
    await createDataset({ dataset: draftDataset, file: acceptedFiles[0] })
    setLoading(false)
    dispatchResetDraftDataset()
    onContinue()
  }
  return (
    <Fragment>
      {datasetInfo?.type === 'user-context-layer:v1' && (
        <div className={styles.dropFiles} {...(getRootProps() as any)}>
          <CustomShapeFormats />
          <input {...getInputProps()} />
          {acceptedFiles.length ? (
            <p>File: {acceptedFiles[0].name}</p>
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drop a shapefile or geojson here
              <br />
              or select it from a folder
            </p>
          )}
        </div>
      )}
      <Button onClick={onContinueClick} className={styles.saveBtn} loading={loading}>
        Confirm
      </Button>
    </Fragment>
  )
}

interface ParameterFieldsProps {
  datasetInfo?: DatasetDraftData
  onContinue: () => void
}

const ParameterFields: React.FC<ParameterFieldsProps> = (props) => {
  const mockDatasetColumns = [
    { id: 'id', label: 'id' },
    { id: 'name', label: 'name' },
    { id: 'area', label: 'area' },
    { id: 'geometry', label: 'geometry' },
  ]

  const { datasetInfo, onContinue } = props
  const [labelsColumn, setLabelsColumn] = useState<string | undefined>()

  const onSelectLabelsColumn: SelectOnChange = (option) => {
    setLabelsColumn(option.id as string)
  }
  const onCleanLabelsColumn: SelectOnRemove = () => {
    setLabelsColumn(undefined)
  }
  const onRemoveLabelsColumn: SelectOnChange = () => {
    setLabelsColumn(undefined)
  }
  return (
    <Fragment>
      {datasetInfo?.type === 'user-context-layer:v1' && (
        <div className={styles.horizontalContainer}>
          <div className={styles.verticalContainer}>
            <Select
              label="Area labels"
              options={mockDatasetColumns}
              selectedOption={mockDatasetColumns.find((o) => o.id === labelsColumn)}
              onSelect={onSelectLabelsColumn}
              onRemove={onRemoveLabelsColumn}
              onCleanClick={onCleanLabelsColumn}
            ></Select>
          </div>
          <div className={styles.verticalContainer}>
            <Map />
          </div>
        </div>
      )}
      <Button onClick={onContinue} className={styles.saveBtn}>
        SAVE
      </Button>
    </Fragment>
  )
}

function NewDataset(): React.ReactElement {
  const { hideModal } = useModalConnect()
  const {
    draftDataset,
    draftDatasetStep,
    dispatchDraftDatasetStep,
    dispatchDraftDatasetData,
  } = useDraftDatasetConnect()

  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">New Dataset</h1>
      <div className={styles.steps}>
        <button
          onClick={() => dispatchDraftDatasetStep('info')}
          className={cx({ [styles.currentStep]: draftDatasetStep === 'info' })}
        >
          1. INFO
        </button>
        <button
          onClick={() => dispatchDraftDatasetStep('data')}
          className={cx({ [styles.currentStep]: draftDatasetStep === 'data' })}
        >
          2. DATA
        </button>
        {/* <button
          onClick={() => dispatchDraftDatasetStep('parameters')}
          className={cx({ [styles.currentStep]: draftDatasetStep === 'parameters' })}
        >
          3. PARAMETERS
        </button> */}
      </div>
      {draftDatasetStep === 'info' && (
        <InfoFields
          datasetInfo={draftDataset}
          onContinue={(info: DatasetDraftData) => {
            dispatchDraftDatasetData(info)
            dispatchDraftDatasetStep('data')
          }}
        />
      )}
      {draftDatasetStep === 'data' && (
        <DataFields datasetInfo={draftDataset} onContinue={hideModal} />
      )}
      {draftDatasetStep === 'parameters' && (
        <ParameterFields datasetInfo={draftDataset} onContinue={hideModal} />
      )}
    </div>
  )
}

export default NewDataset
