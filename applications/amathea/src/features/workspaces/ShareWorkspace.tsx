import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { Editor } from 'types'
import { useModalConnect } from 'features/modal/modal.hooks'
import { USER_DATA } from 'data/user-data'
import styles from './ShareWorkspace.module.css'

function ShareWorkspace(): React.ReactElement {
  const { hideModal } = useModalConnect()
  const editors: Editor[] | undefined = USER_DATA.workspaces.user.find(
    (w) => w.id === 'workspace-1'
  )?.editors
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspace sharing options</h1>
      {editors && editors.length >= 1 && (
        <ul className={styles.currentEditors}>
          <label>Current editors</label>
          {editors.map((editor) => (
            <li className={styles.listItem} key={editor.id}>
              {editor.email}
              <IconButton icon="delete" type="warning" tooltip="Remove editor" />
            </li>
          ))}
        </ul>
      )}
      <div className={styles.newEditors}>
        <InputText label="New editor" type="email" placeholder="Email direction" />
        <Button onClick={hideModal}>Add new editor</Button>
      </div>
    </div>
  )
}

export default ShareWorkspace
