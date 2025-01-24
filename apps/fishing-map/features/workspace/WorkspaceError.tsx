import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { isAuthError } from '@globalfishingwatch/api-client'
import { Button } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectWorkspaceVesselGroupsError } from 'features/vessel-groups/vessel-groups.slice'
import { selectWorkspace, selectWorkspaceError } from 'features/workspace/workspace.selectors'
import { HOME } from 'routes/routes'
import { updateLocation } from 'routes/routes.actions'
import { selectWorkspaceId } from 'routes/routes.selectors'

import ErrorPlaceholder from './ErrorPlaceholder'
import { isPrivateWorkspaceNotAllowed } from './workspace.utils'
import WorkspaceLoginError from './WorkspaceLoginError'

export default function WorkspaceError() {
  const error = useSelector(selectWorkspaceError)
  const vesselGroupsError = useSelector(selectWorkspaceVesselGroupsError)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectWorkspaceId)
  const workspace = useSelector(selectWorkspace)

  if (
    isAuthError(error) ||
    isAuthError(vesselGroupsError) ||
    isPrivateWorkspaceNotAllowed(workspace)
  ) {
    return (
      <WorkspaceLoginError
        title={t('errors.privateView', 'This is a private view')}
        emailSubject={`Requesting access for ${workspaceId} view`}
      />
    )
  }

  if (error.status === 404) {
    return (
      <ErrorPlaceholder title={t('errors.workspaceNotFound', 'The view you request was not found')}>
        <Button
          onClick={() => {
            dispatch(
              updateLocation(HOME, {
                payload: { workspaceId: undefined },
                query: {},
                replaceQuery: true,
              })
            )
          }}
        >
          {t('errors.loadDefaultWorkspace', 'Load default workspace')}
        </Button>
      </ErrorPlaceholder>
    )
  }

  return (
    <ErrorPlaceholder
      title={t(
        'errors.workspaceLoad',
        'There was an error loading the workspace, please try again later'
      )}
    />
  )
}
