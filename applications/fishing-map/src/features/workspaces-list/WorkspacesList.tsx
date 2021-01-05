import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectLocationCategory } from 'routes/routes.selectors'
import { WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'types'
import styles from './WorkspacesList.module.css'
import { selectHighlightedWorkspacesMerged } from './workspaces-list.selectors'
import {
  fetchHighlightWorkspacesThunk,
  selectHighlightedWorkspacesStatus,
} from './workspaces-list.slice'

function WorkspacesList() {
  const dispatch = useDispatch()
  const locationCategory = useSelector(selectLocationCategory)
  const userFriendlyCategory = locationCategory.replace('-', ' ')
  const highlightedWorkspaces = useSelector(selectHighlightedWorkspacesMerged)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)

  useEffect(() => {
    dispatch(fetchHighlightWorkspacesThunk(locationCategory))
  }, [dispatch, locationCategory])

  return (
    <div className={styles.container}>
      <label>{userFriendlyCategory}</label>
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspaces?.map((highlightedWorkspace) => {
            return (
              <li className={styles.workspace} key={highlightedWorkspace.name}>
                <img
                  className={styles.image}
                  alt={highlightedWorkspace.name}
                  src={highlightedWorkspace.img}
                />
                <div className={styles.info}>
                  <h3 className={styles.title}>{highlightedWorkspace.name}</h3>
                  <p className={styles.description}>{highlightedWorkspace.description}</p>
                  <Link
                    className={styles.link}
                    to={{
                      type: WORKSPACE,
                      payload: {
                        category: locationCategory,
                        workspaceId: highlightedWorkspace.id,
                      },
                      query: {},
                    }}
                  >
                    {highlightedWorkspace.cta}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default WorkspacesList
