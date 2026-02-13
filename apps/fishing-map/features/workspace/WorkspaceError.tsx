import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import { isAuthError } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components'

import { selectWorkspaceVesselGroupsError } from 'features/vessel-groups/vessel-groups.slice'
import { selectWorkspace, selectWorkspaceError } from 'features/workspace/workspace.selectors'
import { selectWorkspaceId } from 'router/routes.selectors'

import ErrorPlaceholder from './ErrorPlaceholder'
import { isPrivateWorkspaceNotAllowed } from './workspace.utils'
import WorkspaceLoginError from './WorkspaceLoginError'

export default function WorkspaceError() {
  const error = useSelector(selectWorkspaceError)
  const vesselGroupsError = useSelector(selectWorkspaceVesselGroupsError)
  const { t } = useTranslation()
  const workspaceId = useSelector(selectWorkspaceId)
  const workspace = useSelector(selectWorkspace)

  if (
    isAuthError(error) ||
    isAuthError(vesselGroupsError) ||
    isPrivateWorkspaceNotAllowed(workspace)
  ) {
    return (
      <WorkspaceLoginError
        title={t((t) => t.errors.privateView)}
        emailSubject={`Requesting access for ${workspaceId} view`}
      />
    )
  }

  if (error.status === 404) {
    return (
      <ErrorPlaceholder title={t((t) => t.errors.workspaceNotFound)}>
        <Link to="/" search={{}} replace>
          <Button>{t((t) => t.errors.loadDefaultWorkspace)}</Button>
        </Link>
      </ErrorPlaceholder>
    )
  }

  return <ErrorPlaceholder title={t((t) => t.errors.workspaceLoad)} />
}
