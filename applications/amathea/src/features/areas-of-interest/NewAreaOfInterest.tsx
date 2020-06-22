import React, { useState } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import { ReactComponent as CustomShapeFormats } from '../../assets/custom-shape-formats.svg'
import styles from './NewAreaOfInterest.module.css'

function NewAreaOfInterest(): React.ReactElement {
  const [selectedSource, setSelectedSourceOption] = useState<SelectOption | undefined>()
  const [selectedMpa, setSelectedMpaOption] = useState<SelectOption | undefined>()
  const onSelectSource: SelectOnChange = (option) => {
    setSelectedSourceOption(option)
  }
  const onCleanSource: SelectOnRemove = () => {
    setSelectedSourceOption(undefined)
  }
  const onRemoveSource: SelectOnChange = () => {
    setSelectedSourceOption(undefined)
  }
  const onSelectMpa: SelectOnChange = (option) => {
    setSelectedMpaOption(option)
  }
  const onCleanMpa: SelectOnRemove = () => {
    setSelectedMpaOption(undefined)
  }
  const onRemoveMpa: SelectOnChange = () => {
    setSelectedMpaOption(undefined)
  }
  const { hideModal } = useModalConnect()
  const sources = [
    { id: 'mpas', label: 'Marine Protected Areas' },
    { id: 'custom-shape', label: 'Custom Shape' },
  ]
  const mpas = [
    { id: 'mpa1', label: 'Marine Protected Area 1' },
    { id: 'mpa2', label: 'Marine Protected Area 2' },
    { id: 'mpa3', label: 'Marine Protected Area 3' },
    { id: 'mpa4', label: 'Marine Protected Area 4' },
    { id: 'mpa5', label: 'Marine Protected Area 5' },
  ]
  return (
    <div className={styles.verticalContainer}>
      <h1 className="sr-only">New Area of Interest</h1>
      <div className={styles.horizontalContainer}>
        <div className={styles.verticalContainer}>
          <div className={styles.sourceWrapper}>
            <Select
              label="Source"
              options={sources}
              selectedOption={selectedSource}
              onSelect={onSelectSource}
              onRemove={onRemoveSource}
              onCleanClick={onCleanSource}
            ></Select>
          </div>
          {selectedSource?.id === 'mpas' && (
            <div className={styles.sourceWrapper}>
              <Select
                label="Marine Protected Area"
                options={mpas}
                selectedOption={selectedMpa}
                onSelect={onSelectMpa}
                onRemove={onRemoveMpa}
                onCleanClick={onCleanMpa}
              ></Select>
            </div>
          )}
          {selectedSource?.id === 'custom-shape' && (
            <InputText label="Name" placeholder="Name your Area of Interest" />
          )}
        </div>
        {selectedSource?.id === 'custom-shape' && (
          <div className={styles.verticalContainer}>
            <div className={styles.dropFiles}>
              <CustomShapeFormats />
              Drop a shapefile or geojson here
              <br />
              or select it from a folder
            </div>
          </div>
        )}
      </div>
      <Button onClick={hideModal} className={styles.saveBtn}>
        CONTINUE
      </Button>
    </div>
  )
}

export default NewAreaOfInterest
