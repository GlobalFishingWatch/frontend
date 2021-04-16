import React, { useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import useViewport from 'features/map/map-viewport.hooks'
import { Locale } from 'types'
import styles from './WorkspacesList.module.css'
import {
  HighlightedWorkspaceMerged,
  selectCurrentHighlightedWorkspaces,
} from './workspaces-list.selectors'
import { HighlightedWorkspace, selectHighlightedWorkspacesStatus } from './workspaces-list.slice'

function WorkspacesList() {
  const { t, i18n } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const locationCategory = useSelector(selectLocationCategory)
  const userFriendlyCategory = locationCategory.replace('-', ' ')
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const validCategory = useSelector(isValidLocationCategory)

  const onWorkspaceClick = useCallback(
    (workspace: HighlightedWorkspaceMerged) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

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
            const { name, cta, description, img } = highlightedWorkspace
            const i18nName = highlightedWorkspace[
              `name_${i18n.language as Locale}` as keyof HighlightedWorkspace
            ] as string
            const i18nDescription = highlightedWorkspace[
              `description_${i18n.language as Locale}` as keyof HighlightedWorkspace
            ] as string
            const i18nCta = highlightedWorkspace[
              `cta_${i18n.language as Locale}` as keyof HighlightedWorkspace
            ] as string
            const active = highlightedWorkspace?.id !== undefined
            const linkTo =
              highlightedWorkspace.id === DEFAULT_WORKSPACE_ID
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
              <li key={highlightedWorkspace.id || highlightedWorkspace.name}>
                <div className={cx(styles.workspace, { [styles.disabled]: !active })}>
                  <Link to={linkTo} onClick={() => onWorkspaceClick(highlightedWorkspace)}>
                    <img className={styles.image} alt={name} src={img} />
                  </Link>
                  <div className={styles.info}>
                    <Link to={linkTo} onClick={() => onWorkspaceClick(highlightedWorkspace)}>
                      <h3 className={styles.title}>{i18nName || name}</h3>
                    </Link>
                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: i18nDescription || description,
                      }}
                    ></p>
                    <Link
                      to={linkTo}
                      className={styles.link}
                      onClick={() => onWorkspaceClick(highlightedWorkspace)}
                    >
                      {i18nCta || cta}
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
