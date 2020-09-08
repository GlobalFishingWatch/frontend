import React, { useState } from 'react'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './NewDataset.module.css'
import { useDraftDatasetConnect, useDatasetsAPI } from './datasets.hook'

function EditDataset(): React.ReactElement {
  const [loading, setLoading] = useState(false)

  const { hideModal } = useModalConnect()
  const { updateDataset } = useDatasetsAPI()
  const {
    draftDataset,
    dispatchDraftDatasetData,
    dispatchResetDraftDataset,
  } = useDraftDatasetConnect()

  const onEditClick = async () => {
    setLoading(true)
    await updateDataset(draftDataset)
    setLoading(false)
    dispatchResetDraftDataset()
    hideModal()
  }

  return (
    <div className={styles.container}>
      <InputText
        label="Name"
        placeholder="Name your dataset"
        className={styles.input}
        value={draftDataset?.name}
        onChange={(e) => dispatchDraftDatasetData({ name: e.target.value })}
      />
      <InputText
        label="Description"
        placeholder="Descript your dataset"
        className={styles.input}
        value={draftDataset?.description}
        onChange={(e) => dispatchDraftDatasetData({ description: e.target.value })}
      />
      <Button
        onClick={() => onEditClick()}
        disabled={!draftDataset?.name || !draftDataset?.description}
        loading={loading}
        className={styles.saveBtn}
      >
        Confirm
      </Button>
    </div>
  )
}

export default EditDataset
