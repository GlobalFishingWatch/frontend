import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useModalConnect } from 'features/modal/modal.hooks'
import { TEST_WORSPACE_DATAVIEWS } from 'data/data'
import DataviewGraphMini from 'features/dataviews/DataviewGraphMini'
import styles from './ResumeColumn.module.css'

export default function ResumeColumn(): React.ReactElement | null {
  const { showModal } = useModalConnect()

  return (
    <ul className={styles.container}>
      <li className={styles.current} key="info">
        <IconButton icon="info" />
      </li>
      {TEST_WORSPACE_DATAVIEWS.map((dataview) => (
        <li key={dataview.id}>
          <DataviewGraphMini dataview={dataview} />
        </li>
      ))}
      <li key="add-dataview">
        <IconButton icon="plus" onClick={() => showModal('newDataview')} />
      </li>
    </ul>
  )
}
