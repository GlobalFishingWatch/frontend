import { useCallback } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Link, { To } from 'redux-first-router-link'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@globalfishingwatch/ui-components'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'
import { HOME, WORKSPACE } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategories } from 'data/workspaces'
import useViewport from 'features/map/map-viewport.hooks'
import { Locale } from 'types'
import styles from './WorkspacesList.module.css'
import {
  HighlightedWorkspaceMerged,
  selectCurrentHighlightedWorkspaces,
} from './workspaces-list.selectors'
import { selectHighlightedWorkspacesStatus } from './workspaces-list.slice'
import WorkspaceWizard from './WorkspaceWizard'

function WorkspacesList() {
  const { t, i18n } = useTranslation()
  const { setMapCoordinates } = useViewport()
  const locationCategory = useSelector(selectLocationCategory)
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
      {locationCategory === WorkspaceCategories.MarineManager && <WorkspaceWizard />}
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspaces?.map((highlightedWorkspace) => {
            const { name, cta, description, img } = highlightedWorkspace
            const i18nName = (name?.[i18n.language as Locale] as string) || name.en
            const i18nDescription =
              (description?.[i18n.language as Locale] as string) || description.en
            const i18nCta = (cta?.[i18n.language as Locale] as string) || cta.en
            const active = highlightedWorkspace?.id !== undefined && highlightedWorkspace?.id !== ''
            const isExternalLink = highlightedWorkspace.id.includes('http')
            let linkTo: To
            if (isExternalLink) linkTo = highlightedWorkspace.id
            else if (highlightedWorkspace.id === DEFAULT_WORKSPACE_ID) {
              linkTo = {
                type: HOME,
                payload: {},
                query: {},
                replaceQuery: true,
              }
            } else {
              linkTo = {
                type: WORKSPACE,
                payload: {
                  category: locationCategory,
                  workspaceId: highlightedWorkspace.id,
                },
                query: {},
                replaceQuery: true,
              }
            }
            return (
              <li key={highlightedWorkspace.id || i18nName}>
                <div className={cx(styles.workspace, { [styles.disabled]: !active })}>
                  {active ? (
                    isExternalLink ? (
                      <a target="_blank" href={linkTo as string} rel="noreferrer">
                        <img className={styles.image} alt={i18nName} src={img} />
                      </a>
                    ) : (
                      <Link
                        to={linkTo}
                        target="_self"
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      >
                        <img className={styles.image} alt={i18nName} src={img} />
                      </Link>
                    )
                  ) : (
                    <img className={styles.image} alt={i18nName} src={img} />
                  )}
                  <div className={styles.info}>
                    {active ? (
                      isExternalLink ? (
                        <a target="_blank" href={linkTo as string} rel="noreferrer">
                          <h3 className={styles.title}>{i18nName}</h3>
                        </a>
                      ) : (
                        <Link
                          to={linkTo}
                          target="_self"
                          onClick={() => onWorkspaceClick(highlightedWorkspace)}
                        >
                          <h3 className={styles.title}>{i18nName}</h3>
                        </Link>
                      )
                    ) : (
                      <h3 className={styles.title}>{i18nName}</h3>
                    )}
                    {i18nDescription && (
                      <p
                        className={styles.description}
                        dangerouslySetInnerHTML={{
                          __html: i18nDescription,
                        }}
                      ></p>
                    )}
                    {active &&
                      (isExternalLink ? (
                        <a
                          target="_blank"
                          href={linkTo as string}
                          className={styles.link}
                          rel="noreferrer"
                        >
                          {i18nCta}
                        </a>
                      ) : (
                        <Link
                          to={linkTo}
                          target="_self"
                          className={styles.link}
                          onClick={() => onWorkspaceClick(highlightedWorkspace)}
                        >
                          {i18nCta}
                        </Link>
                      ))}
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
