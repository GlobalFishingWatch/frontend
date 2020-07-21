import React, { useEffect, Fragment } from 'react'
import Link from 'redux-first-router-link'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { useLocationConnect } from 'routes/routes.hook'
import { WORKSPACES } from 'routes/routes'
import { useWorkspaceEditorConnect } from './workspace-editor.hook'

export default function Login(): React.ReactElement | null {
  const { workspace, fetchWorkspaceById } = useWorkspaceEditorConnect()
  const { payload } = useLocationConnect()

  useEffect(() => {
    if (payload && payload.workspaceId) {
      fetchWorkspaceById(payload.workspaceId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <h1>Workspace Editor</h1>
      {workspace && <p>Workspace Label: {workspace.description}</p>}
      <Link to={{ type: WORKSPACES }}>
        <Button>BACK</Button>
      </Link>
    </Fragment>
  )
}
