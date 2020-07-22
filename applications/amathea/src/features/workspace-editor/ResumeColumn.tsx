import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './ResumeColumn.module.css'

export default function ResumeColumn(): React.ReactElement | null {
  const { showModal } = useModalConnect()

  return (
    <ul className={styles.container}>
      <li className={styles.current}>
        <IconButton icon="info" />
      </li>
      <li>
        <IconButton icon="plus" onClick={() => showModal('newDataview')} />
      </li>
    </ul>
  )
}
