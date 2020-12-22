import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { isUserLogged } from 'features/user/user.slice'
import { WORKSPACE } from 'routes/routes'
import { selectLocationCategory } from 'routes/routes.selectors'
import { fetchWorkspacesThunk, selectWorkspaces } from './workspaces-list.slice'

function WorkspacesList() {
  const userLogged = useSelector(isUserLogged)
  const workspaces = useSelector(selectWorkspaces)
  const dispatch = useDispatch()
  const locationCategory = useSelector(selectLocationCategory)
  useEffect(() => {
    if (userLogged) {
      dispatch(fetchWorkspacesThunk(locationCategory))
    }
  }, [dispatch, locationCategory, userLogged])
  return (
    <Fragment>
      <h2>Workspaces list</h2>
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
    </Fragment>
  )
}
export default WorkspacesList
