import React, { useState } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/dist/select'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import { AOI_SOURCES, MPAS } from 'data/data'
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

  return (
    <div className={styles.verticalContainer}>
      <h1 className="sr-only">New Area of Interest</h1>
      <div className={styles.horizontalContainer}>
        <div className={styles.verticalContainer}>
          <div className={styles.sourceWrapper}>
            <Select
              label="Source"
              options={AOI_SOURCES}
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
                options={MPAS}
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
