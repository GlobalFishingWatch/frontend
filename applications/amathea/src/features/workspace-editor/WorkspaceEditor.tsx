import React, { useEffect } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useLocationConnect } from 'routes/routes.hook'
import {
  useWorkspacesConnect,
  useWorkspaceDataviewsConnect,
} from 'features/workspaces/workspaces.hook'
import { useModalConnect } from 'features/modal/modal.hooks'
import DataviewGraphPanel from 'features/dataviews/DataviewGraphPanel'
import ResumeColumn from './ResumeColumn'
import styles from './WorkspaceEditor.module.css'

export default function WorkspaceEditor(): React.ReactElement | null {
  const { workspace, fetchWorkspaceById } = useWorkspacesConnect()
  const { dataviews } = useWorkspaceDataviewsConnect()
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
        <div className={styles.infoPanel} id="info">
          <div className={styles.title}>
            <h1>{workspace ? workspace.label : 'loading'}</h1>
            <IconButton icon="edit" tooltip="Edit workspace information" />
          </div>
          <div>
            <label>Area</label>
            <p>{workspace?.aoi?.area ? Math.round(workspace?.aoi?.area / 1000000) : '---'} km2</p>
          </div>
          <div>
            <label>Description</label>
            <p>{workspace ? workspace.description : 'loading'}</p>
          </div>
        </div>
        {dataviews?.length > 0 && (
          <ul>
            {dataviews.map((dataview) => (
              <li>
                <DataviewGraphPanel
                  dataview={dataview}
                  graphConfig={{ unit: 'm', color: 'red' }}
                  key={dataview.id}
                />
              </li>
            ))}
          </ul>
        )}
        <div className={styles.footer}>
          {dataviews.length >= 2 && (
            <Button type="secondary" tooltip="Coming soon" tooltipPlacement="top">
              Create Analysis
            </Button>
          )}
          <Button type="secondary" tooltip="Coming soon" tooltipPlacement="top">
            Download data
          </Button>
          <Button onClick={() => showModal('newDataview')}>Add new dataview</Button>
        </div>
      </div>
    </div>
  )
}
