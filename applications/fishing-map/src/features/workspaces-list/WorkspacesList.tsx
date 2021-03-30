import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { DEFAULT_WORKSPACE_KEY } from 'data/workspaces'
import styles from './WorkspacesList.module.css'
import { selectCurrentHighlightedWorkspaces } from './workspaces-list.selectors'
import { selectHighlightedWorkspacesStatus } from './workspaces-list.slice'

function WorkspacesList() {
  const { t } = useTranslation()
  const locationCategory = useSelector(selectLocationCategory)
  const userFriendlyCategory = locationCategory.replace('-', ' ')
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const validCategory = useSelector(isValidLocationCategory)

  if (highlightedWorkspacesStatus === AsyncReducerStatus.Finished && !validCategory) {
    return (
      <div className={styles.placeholder}>
        <h2>{t('errors.pageNotFound', 'Page not found')}</h2>
        <p>🙈</p>
        <Link className={styles.linkButton} to={{ type: HOME, replaceQuery: true }}>
          {t('common.seeDefault', 'See default view')}
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <label>{userFriendlyCategory}</label>
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspaces?.map((highlightedWorkspace) => {
            const active = highlightedWorkspace?.id !== undefined
            const linkTo =
              highlightedWorkspace.id === DEFAULT_WORKSPACE_KEY
                ? {
                    type: HOME,
                    payload: {},
                    query: {},
                  }
                : {
                    type: WORKSPACE,
                    payload: {
                      category: locationCategory,
                      workspaceId: highlightedWorkspace.id,
                    },
                    query: {},
                  }
            return (
              <li key={highlightedWorkspace.name}>
                <div className={cx(styles.workspace, { [styles.disabled]: !active })}>
                  <img
                    className={styles.image}
                    alt={highlightedWorkspace.name}
                    src={highlightedWorkspace.img}
                  />
                  <div className={styles.info}>
                    <h3 className={styles.title}>{highlightedWorkspace.name}</h3>
                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{ __html: highlightedWorkspace.description }}
                    ></p>
                    <Link to={linkTo} className={styles.link}>
                      {highlightedWorkspace.cta}
                    </Link>
                  </div>
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
