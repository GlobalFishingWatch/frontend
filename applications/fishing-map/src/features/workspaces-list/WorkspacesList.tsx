import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { Spinner } from '@globalfishingwatch/ui-components'
import { isUserLogged } from 'features/user/user.slice'
import { WORKSPACE } from 'routes/routes'
import { selectLocationCategory } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'types'
import { fetchWorkspacesThunk, selectWorkspaceListStatus } from './workspaces-list.slice'
import { selectWorkspaceByCategory } from './workspaces-list.selectors'

function WorkspacesList() {
  const userLogged = useSelector(isUserLogged)
  const locationCategory = useSelector(selectLocationCategory)
  const workspaces = useSelector(selectWorkspaceByCategory(locationCategory))
  const workspacesStatus = useSelector(selectWorkspaceListStatus)

  const dispatch = useDispatch()
  useEffect(() => {
    if (userLogged) {
      dispatch(fetchWorkspacesThunk(locationCategory))
    }
  }, [dispatch, locationCategory, userLogged])

  return (
    <Fragment>
      <h2>Workspaces list</h2>
      {workspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner />
      ) : (
        <ul>
          {workspaces.map((workspace) => {
            return (
              <li key={workspace.id}>
                <Link
                  to={{
                    type: WORKSPACE,
                    payload: {
                      category: locationCategory,
                      workspaceId: workspace.id,
                    },
                    query: {},
                  }}
                >
                  {workspace.name}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </Fragment>
  )
}
export default WorkspacesList
