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
  const [currentPosition, setCurrentPosition] = useState<string>(window.location.hash || '#info')

  return (
    <ul className={styles.container}>
      <li className={cx(styles.list, { [styles.current]: currentPosition === '#info' })} key="info">
        <a className={styles.link} href="#info" onClick={() => setCurrentPosition('#info')}>
          <IconButton icon="info" />
        </a>
      </li>
      {dataviews &&
        dataviews.map((dataview) => {
          const color = dataview.config?.color as string
          return (
            <li
              key={dataview.id}
              className={cx(styles.list, {
                [styles.current]: currentPosition === `#${dataview.id}`,
              })}
            >
              <a
                className={styles.link}
                href={`#${dataview.id}`}
                onClick={() => setCurrentPosition(`#${dataview.id}`)}
              >
                {dataview.datasets?.length &&
                dataview.datasets[0]?.type === 'user-context-layer:v1' ? (
                  <Circle color={color} />
                ) : (
                  <DataviewGraphMini
                    className={styles.pointer}
                    dataview={dataview}
                    graphColor={color}
                  />
                )}
              </a>
            </li>
          )
        })}
      <li className={styles.list} key="add-dataview">
        <IconButton icon="plus" onClick={() => showModal('newDataview')} />
      </li>
    </ul>
  )
}
