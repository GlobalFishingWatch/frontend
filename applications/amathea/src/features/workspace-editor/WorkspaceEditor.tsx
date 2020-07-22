import React, { useEffect } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useLocationConnect } from 'routes/routes.hook'
import { useWorkspacesConnect } from 'features/workspaces/workspaces.hook'
import { useModalConnect } from 'features/modal/modal.hooks'
import ResumeColumn from './ResumeColumn'
import styles from './WorkspaceEditor.module.css'

export default function WorkspaceEditor(): React.ReactElement | null {
  const { workspace, fetchWorkspaceById } = useWorkspacesConnect()
  const { showModal } = useModalConnect()
  const { payload } = useLocationConnect()

  useEffect(() => {
    if (payload && payload.workspaceId) {
      fetchWorkspaceById(payload.workspaceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <ResumeColumn />
      <div className={styles.content}>
        <h1>Workspace Editor</h1>
        <p>Label: {workspace ? workspace.description : 'loading'}</p>
        <div className={styles.footer}>
          <Button onClick={() => showModal('newDataview')}>Add new dataview</Button>
        </div>
      </div>
    </div>
  )
}
