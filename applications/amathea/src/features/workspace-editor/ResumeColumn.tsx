import React, { useState } from 'react'
import cx from 'classnames'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useModalConnect } from 'features/modal/modal.hooks'
import DataviewGraphMini from 'features/dataviews/DataviewGraphMini'
import { useWorkspaceDataviewsConnect } from 'features/workspaces/workspaces.hook'
import Circle from 'common/Circle'
import styles from './ResumeColumn.module.css'

export default function ResumeColumn(): React.ReactElement | null {
  const { showModal } = useModalConnect()
  const { dataviews } = useWorkspaceDataviewsConnect()
  const [currentPosition, setCurrentPosition] = useState<string>(window.location.hash)

  return (
    <ul className={styles.container}>
      <li className={cx({ [styles.current]: currentPosition === '#info' })} key="info">
        <a href="#info" onClick={() => setCurrentPosition('#info')}>
          <IconButton icon="info" />
        </a>
      </li>
      {dataviews.map((dataview) => (
        <li
          key={dataview.id}
          className={cx({ [styles.current]: currentPosition === `#${dataview.id}` })}
        >
          <a href={`#${dataview.id}`} onClick={() => setCurrentPosition(`#${dataview.id}`)}>
            {dataview.datasets?.length && dataview.datasets[0]?.type === 'user-context-layer:v1' ? (
              <Circle />
            ) : (
              <DataviewGraphMini dataview={dataview} graphConfig={{ color: 'red' }} />
            )}
          </a>
        </li>
      ))}
      <li key="add-dataview">
        <IconButton icon="plus" onClick={() => showModal('newDataview')} />
      </li>
    </ul>
  )
}
