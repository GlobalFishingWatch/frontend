import React, { useEffect } from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Spinner from '@globalfishingwatch/ui-components/dist/spinner'
import { useLocationConnect } from 'routes/routes.hook'
import {
  useWorkspacesAPI,
  useCurrentWorkspaceConnect,
  useWorkspaceDataviewsConnect,
  useWorkspacesConnect,
} from 'features/workspaces/workspaces.hook'
import { useModalConnect } from 'features/modal/modal.hooks'
import { useDataviewsAPI, useDataviewsConnect } from 'features/dataviews/dataviews.hook'
import DataviewGraphPanel from 'features/dataviews/DataviewGraphPanel'
import ResumeColumn from './ResumeColumn'
import styles from './WorkspaceEditor.module.css'

export default function WorkspaceEditor(): React.ReactElement | null {
  const { dataviewsStatus } = useDataviewsConnect()
  const { workspaceStatus } = useWorkspacesConnect()
  const { workspace } = useCurrentWorkspaceConnect()
  const { fetchDataviews } = useDataviewsAPI()
  const { fetchWorkspaceById } = useWorkspacesAPI()
  const { dataviews } = useWorkspaceDataviewsConnect()
  const { showModal } = useModalConnect()
  const { payload } = useLocationConnect()

  useEffect(() => {
    if (payload && payload.workspaceId) {
      fetchWorkspaceById(payload.workspaceId)
    }
    fetchDataviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (workspaceStatus === 'loading.item' || dataviewsStatus === 'loading') {
    return <Spinner />
  }

  return (
    <div className={styles.container}>
      <ResumeColumn />
      <div className={styles.content}>
        <div className={styles.infoPanel} id="info">
          <div className={styles.title}>
            <h1>{workspace ? workspace.name : 'loading'}</h1>
            <IconButton
              icon="edit"
              tooltip="Edit workspace information"
              onClick={() => showModal('newWorkspace')}
            />
          </div>
          <div>
            <label>Area</label>
            <p>
              {workspace?.aoi?.area
                ? Math.round(workspace?.aoi?.area / 1000000).toLocaleString()
                : '---'}{' '}
              km2
            </p>
          </div>
          <div>
            <label>Description</label>
            <p>{workspace ? workspace.description : 'loading'}</p>
          </div>
        </div>
        {dataviews && dataviews.length > 0 && (
          <ul>
            {dataviews.map((dataview) => (
              <li key={dataview.id} className={styles.dataviewContainer}>
                <DataviewGraphPanel dataview={dataview} />
              </li>
            ))}
          </ul>
        )}
        <div className={styles.footer}>
          {dataviews && dataviews?.length >= 2 && (
            <Button type="secondary" tooltip="Coming soon" tooltipPlacement="top">
              Create Analysis
            </Button>
          )}
          <Button type="secondary" tooltip="Coming soon" tooltipPlacement="top">
            Download data
          </Button>
          <Button onClick={() => showModal('newDataview')}>Add dataset</Button>
        </div>
      </div>
    </div>
  )
}
