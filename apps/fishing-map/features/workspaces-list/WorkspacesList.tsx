import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { To } from 'redux-first-router-link'
import Link from 'redux-first-router-link'

import { Spinner } from '@globalfishingwatch/ui-components'

import type { ReportIndexId } from 'data/reports/reports.index'
import { REPORT_IDS } from 'data/reports/reports.index'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { HOME, WORKSPACE, WORKSPACE_REPORT } from 'routes/routes'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import type { HighlightedWorkspace } from './workspaces-list.selectors'
import { selectCurrentHighlightedWorkspaces } from './workspaces-list.selectors'
import { selectHighlightedWorkspacesStatus } from './workspaces-list.slice'
import WorkspaceWizard from './WorkspaceWizard'

import styles from './WorkspacesList.module.css'

function WorkspacesList() {
  const { t } = useTranslation()
  const setMapCoordinates = useSetMapCoordinates()
  const locationCategory = useSelector(selectLocationCategory)
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const highlightedWorkspacesStatus = useSelector(selectHighlightedWorkspacesStatus)
  const validCategory = useSelector(isValidLocationCategory)

  const onWorkspaceClick = useCallback(
    (workspace: HighlightedWorkspace) => {
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
      {locationCategory === WorkspaceCategory.MarineManager && (
        <Fragment>
          <WorkspaceWizard />
          <label className={styles.listTitle}>{t('common.partnerSites', 'Partner sites')}</label>
        </Fragment>
      )}
      {highlightedWorkspacesStatus === AsyncReducerStatus.Loading ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {highlightedWorkspaces?.map((highlightedWorkspace) => {
            const { name, description, cta, reportUrl, img, dataviewInstances } =
              highlightedWorkspace
            const active = highlightedWorkspace?.id !== undefined && highlightedWorkspace?.id !== ''
            const isExternalLink = highlightedWorkspace.id.includes('http')
            const isReportLink = REPORT_IDS.includes(highlightedWorkspace.id as ReportIndexId)
            let linkTo: To
            if (isExternalLink) {
              linkTo = highlightedWorkspace.id
            } else if (highlightedWorkspace.id === DEFAULT_WORKSPACE_ID) {
              linkTo = {
                type: HOME,
                payload: {},
                query: {},
                replaceQuery: true,
              }
            } else if (isReportLink) {
              linkTo = {
                type: WORKSPACE_REPORT,
                payload: {
                  category: WorkspaceCategory.Reports,
                  workspaceId: DEFAULT_WORKSPACE_ID,
                },
                query: {
                  // TODO: debug why this is not working
                  dataviewInstances,
                  latitude: 0,
                  longitude: 0,
                  zoom: 0,
                },
              }
            } else {
              linkTo = {
                type: WORKSPACE,
                payload: {
                  category: locationCategory,
                  workspaceId: highlightedWorkspace.id,
                },
                query: { ...(highlightedWorkspace.viewport || {}) },
                replaceQuery: true,
              }
            }
            return (
              <li
                key={highlightedWorkspace.id || name}
                className={cx(styles.workspace, { [styles.disabled]: !active })}
              >
                {active ? (
                  isExternalLink ? (
                    <a
                      className={styles.imageLink}
                      target="_blank"
                      href={linkTo as string}
                      rel="noreferrer"
                    >
                      <img className={styles.image} alt={name} src={img} />
                    </a>
                  ) : (
                    <Link
                      to={linkTo}
                      target="_self"
                      onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      className={styles.imageLink}
                    >
                      <img className={styles.image} alt={name} src={img} />
                    </Link>
                  )
                ) : (
                  <img className={styles.image} alt={name} src={img} />
                )}
                <div className={styles.info}>
                  {active ? (
                    isExternalLink ? (
                      <a target="_blank" href={linkTo as string} rel="noreferrer">
                        <h3 className={styles.title}>{name}</h3>
                      </a>
                    ) : (
                      <Link
                        to={linkTo}
                        target="_self"
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      >
                        <h3 className={styles.title}>{name}</h3>
                      </Link>
                    )
                  ) : (
                    <h3 className={styles.title}>{name}</h3>
                  )}
                  {description && (
                    <p
                      className={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: description,
                      }}
                    ></p>
                  )}
                  <div className={styles.linksContainer}>
                    {isReportLink && (
                      <Link
                        to={linkTo}
                        target="_self"
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                        className={styles.link}
                      >
                        {t('analysis.see', 'See report')}
                      </Link>
                    )}
                    {!isReportLink && reportUrl && (
                      <a href={reportUrl as string} className={styles.link}>
                        {t('analysis.see', 'See report')}
                      </a>
                    )}
                    {active &&
                      (isExternalLink ? (
                        <a
                          target="_blank"
                          href={linkTo as string}
                          className={styles.link}
                          rel="noreferrer"
                        >
                          {cta}
                        </a>
                      ) : (
                        <Link
                          to={linkTo}
                          target="_self"
                          className={styles.link}
                          onClick={() => onWorkspaceClick(highlightedWorkspace)}
                        >
                          {cta}
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
