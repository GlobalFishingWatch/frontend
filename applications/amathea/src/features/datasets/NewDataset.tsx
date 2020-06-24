import React, { useState, Fragment } from 'react'
import cx from 'classnames'
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

type Steps = 'info' | 'data' | 'parameters'

type DatasetTypes = 'context_areas' | 'track' | '4wings' | undefined
type DatasetInfo = {
  name: string | undefined
  type: DatasetTypes
}

function NewDataset(): React.ReactElement {
  const { hideModal } = useModalConnect()
  const [step, setStep] = useState<Steps>('info')
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo>({
    name: '',
    type: undefined,
  })

  return (
    <div className={styles.container}>
      <h1 className="sr-only">New Dataset</h1>
      <div className={styles.steps}>
        <button
          onClick={() => setStep('info')}
          className={cx({ [styles.currentStep]: step === 'info' })}
        >
          1. INFO
        </button>
        <button
          onClick={() => setStep('data')}
          className={cx({ [styles.currentStep]: step === 'data' })}
        >
          2. DATA
        </button>
        <button
          onClick={() => setStep('parameters')}
          className={cx({ [styles.currentStep]: step === 'parameters' })}
        >
          3. PARAMETERS
        </button>
      </div>
      {step === 'info' && (
        <InfoFields
          datasetInfo={datasetInfo}
          onContinue={(info: DatasetInfo) => {
            setDatasetInfo(info)
            setStep('data')
          }}
        />
      )}
      {step === 'data' && (
        <DataFields
          datasetInfo={datasetInfo}
          onContinue={() => {
            setStep('parameters')
          }}
        />
      )}
      {step === 'parameters' && (
        <ParameterFields datasetInfo={datasetInfo} onContinue={hideModal} />
      )}
    </div>
  )
}

interface InfoFieldsProps {
  datasetInfo?: DatasetInfo
  onContinue: (info: DatasetInfo) => void
}

const InfoFields: React.FC<InfoFieldsProps> = (props) => {
  const { datasetInfo, onContinue } = props

  const [datasetName, setDatasetName] = useState<string | undefined>(datasetInfo?.name)
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
        value={datasetName}
        onChange={(e) => setDatasetName(e.target.value)}
      />
      <div className={styles.typeWrapper}>
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
        onClick={() => onContinue({ name: datasetName, type: datasetType })}
        className={styles.saveBtn}
      >
        CONTINUE
      </Button>
    </Fragment>
  )
}

interface DataFieldsProps {
  datasetInfo?: DatasetInfo
  onContinue: () => void
}

const DataFields: React.FC<DataFieldsProps> = (props) => {
  const { datasetInfo, onContinue } = props

  return (
    <Fragment>
      {datasetInfo?.type === 'context_areas' && (
        <div className={styles.dropFiles}>
          <CustomShapeFormats />
          Drop a shapefile or geojson here
          <br />
          or select it from a folder
        </div>
      )}
      <Button onClick={onContinue} className={styles.saveBtn}>
        CONTINUE
      </Button>
    </Fragment>
  )
}

interface ParameterFieldsProps {
  datasetInfo?: DatasetInfo
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
      {datasetInfo?.type === 'context_areas' && (
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

export default NewDataset
