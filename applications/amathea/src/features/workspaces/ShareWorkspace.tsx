import React from 'react'
import { Editor } from 'types'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './ShareWorkspace.module.css'
// import { useWorkspacesConnect } from './workspaces.hook'

function ShareWorkspace(): React.ReactElement {
  const { hideModal } = useModalConnect()
  // const { workspacesSharedList } = useWorkspacesConnect()
  // TODO: move this to workspace API
  const editors: Editor[] = [
    { id: 'editor-1', email: 'editor1@gmail.com' },
    { id: 'editor-2', email: 'editor2@gmail.com' },
    { id: 'editor-3', email: 'editor3@gmail.com' },
  ]
  return (
    <div className={styles.container}>
      <h1 className="screen-reader-only">Workspace sharing options</h1>
      {editors && editors.length >= 1 && (
        <ul className={styles.currentEditors}>
          <label>Current editors</label>
          {editors.map((editor) => (
            <li className={styles.listItem} key={editor.id}>
              {editor.email}
              <IconButton disabled icon="delete" type="warning" tooltip="Remove editor" />
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
