import React from 'react'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useModalConnect } from 'features/modal/modal.hooks'
import styles from './Workspaces.module.css'

function Workspaces(): React.ReactElement {
  const { showModal } = useModalConnect()
  const workspaces = {
    user: [
      { id: 'user-id-plus-hash-1', label: 'Worspace Name 1' },
      { id: 'user-id-plus-hash-2', label: 'Worspace Name 2' },
      { id: 'user-id-plus-hash-3', label: 'Worspace Name 3' },
      { id: 'user-id-plus-hash-4', label: 'Worspace Name 4' },
    ],
    shared: [
      { id: 'user-id-plus-hash-5', label: 'Shared Worspace Name 1' },
      { id: 'user-id-plus-hash-6', label: 'Shared Worspace Name 2' },
    ],
  }
  return (
    <div className={styles.container}>
      <h1 className="sr-only">Workspaces</h1>
      <label>Your workspaces</label>
      {workspaces.user.map((workspace) => (
        <div className={styles.listItem} key={workspace.id}>
          <button className={styles.titleLink}>{workspace.label}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
          {/* <IconButton icon="publish" tooltip="Publish workspace" /> */}
          <IconButton
            icon="share"
            tooltip="Share Workspace"
            onClick={() => {
              showModal('shareWorkspace')
            }}
          />
          <IconButton icon="delete" type="warning" tooltip="Delete Workspace" />
        </div>
      ))}
      <Button
        onClick={() => {
          showModal('newWorkspace')
        }}
        className={styles.rightSide}
      >
        Create new workspace
      </Button>
      <label>Workspaces shared with you</label>
      {workspaces.shared.map((workspace) => (
        <div className={styles.listItem} key={workspace.id}>
          <button className={styles.titleLink}>{workspace.label}</button>
          <IconButton icon="edit" tooltip="Edit Workspace" />
        </div>
      ))}
    </div>
  )
}

export default Workspaces
