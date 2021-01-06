import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectLocationCategory } from 'routes/routes.selectors'
import { WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'types'
import styles from './WorkspacesList.module.css'
import { selectCurrentHighlightedWorkspaces } from './workspaces-list.selectors'
import {
  fetchHighlightWorkspacesThunk,
  selectHighlightedWorkspacesStatus,
} from './workspaces-list.slice'

function WorkspacesList() {
  const dispatch = useDispatch()
  const locationCategory = useSelector(selectLocationCategory)
  const userFriendlyCategory = locationCategory.replace('-', ' ')
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

  useEffect(() => {
    if (highlightedWorkspacesStatus !== AsyncReducerStatus.Finished) {
      dispatch(fetchHighlightWorkspacesThunk())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.container}>
      <label>{userFriendlyCategory}</label>
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspaces?.map((highlightedWorkspace) => {
            return (
              <li key={highlightedWorkspace.name}>
                <Link
                  className={styles.workspace}
                  to={{
                    type: WORKSPACE,
                    payload: {
                      category: locationCategory,
                      workspaceId: highlightedWorkspace.id,
                    },
                    query: {},
                  }}
                >
                  <img
                    className={styles.image}
                    alt={highlightedWorkspace.name}
                    src={highlightedWorkspace.img}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.title}>{highlightedWorkspace.name}</h3>
                    <p className={styles.description}>{highlightedWorkspace.description}</p>
                    <span className={styles.link}>{highlightedWorkspace.cta}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default WorkspacesList
