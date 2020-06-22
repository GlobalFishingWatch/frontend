import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './ShareWorkspace.module.css'

function ShareWorkspace(): React.ReactElement {
  const { hideModal } = useModalConnect()
  const editors = [
    { id: 'editor-1', email: 'editor1@gmail.com' },
    { id: 'editor-2', email: 'editor2@gmail.com' },
    { id: 'editor-3', email: 'editor3@gmail.com' },
  ]
  return (
    <div className={styles.container}>
      <h1 className="sr-only">Workspace sharing options</h1>
      <label>Current editors</label>
      {editors.map((editor) => (
        <div className={styles.listItem} key={editor.id}>
          {editor.email}
          <IconButton icon="delete" type="warning" tooltip="Remove editor" />
        </div>
      ))}
      <div className={styles.newEditorWrapper}>
        <InputText label="New editor" type="email" placeholder="Email direction" />
        <Button onClick={hideModal}>Add new editor</Button>
      </div>
    </div>
  )
}

export default ShareWorkspace
