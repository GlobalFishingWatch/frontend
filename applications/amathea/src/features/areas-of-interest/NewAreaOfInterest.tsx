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
  const [selectedSource, setSelectedOption] = useState<SelectOption | undefined>()
  const onSelect: SelectOnChange = (option) => {
    console.log(option)

    setSelectedOption(option)
  }
  const onClean: SelectOnRemove = () => {
    setSelectedOption(undefined)
  }
  const onRemove: SelectOnChange = () => {
    setSelectedOption(undefined)
  }
  const { hideModal } = useModalConnect()
  const sources = [
    { id: 'static-context-areas', label: 'Marine Protected Areas' },
    { id: 'custom-shape', label: 'Custom Shape' },
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
              onSelect={onSelect}
              onRemove={onRemove}
              onCleanClick={onClean}
            ></Select>
          </div>
          <InputText label="Name" placeholder="Name your Area of Interest" />
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
