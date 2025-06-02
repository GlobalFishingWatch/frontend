import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { To } from 'redux-first-router-link'
import Link from 'redux-first-router-link'

import { LEGACY_CVP_WORKSPACE_ID } from 'data/highlighted-workspaces/fishing-activity'
import type { ReportWorkspaceId } from 'data/highlighted-workspaces/reports'
import { REPORT_IDS } from 'data/highlighted-workspaces/reports'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { selectIsGlobalReportsEnabled } from 'features/debug/debug.selectors'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { selectFeatureFlags } from 'features/workspace/workspace.selectors'
import { HOME, REPORT, WORKSPACE, WORKSPACE_REPORT } from 'routes/routes'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'

import type { HighlightedWorkspace } from './workspaces-list.selectors'
import { selectCurrentHighlightedWorkspaces } from './workspaces-list.selectors'
import WorkspaceWizard from './WorkspaceWizard'

import styles from './WorkspacesList.module.css'

function WorkspacesList() {
  const { t } = useTranslation()
  const setMapCoordinates = useSetMapCoordinates()
  const locationCategory = useSelector(selectLocationCategory)
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const validCategory = useSelector(isValidLocationCategory)
  const featureFlags = useSelector(selectFeatureFlags)
  const isGlobalReportsEnabled = useSelector(selectIsGlobalReportsEnabled)

  const onWorkspaceClick = useCallback(
    (workspace: HighlightedWorkspace) => {
      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

  if (!validCategory) {
    return (
      <div className={styles.placeholder}>
        <h2>{t('errors.pageNotFound', 'Page not found')}</h2>
        <p>🙈</p>
        <Link
          className={styles.linkButton}
          to={{ type: HOME, replaceQuery: true, query: { featureFlags } }}
        >
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
      <ul>
        {highlightedWorkspaces?.map((highlightedWorkspace) => {
          const {
            id,
            visible,
            name,
            description,
            cta,
            reportCategory,
            dataviewInstances,
            reports,
            img,
          } = highlightedWorkspace
          const isLegacyCVPWorkspace = id === LEGACY_CVP_WORKSPACE_ID
          if (!visible || (isLegacyCVPWorkspace && isGlobalReportsEnabled)) {
            return null
          }

          let linkTo: To
          if (id === DEFAULT_WORKSPACE_ID) {
            linkTo = {
              type: HOME,
              payload: {},
              query: { featureFlags },
              replaceQuery: true,
            }
          } else if (REPORT_IDS.includes(id as ReportWorkspaceId)) {
            linkTo = {
              type: WORKSPACE_REPORT,
              payload: {
                category: WorkspaceCategory.Reports,
                workspaceId: DEFAULT_WORKSPACE_ID,
              },
              query: {
                featureFlags,
                dataviewInstances,
                reportCategory,
                latitude: 0,
                longitude: 0,
                zoom: 0,
                reportLoadVessels: true,
              },
            }
          } else {
            linkTo = {
              type: WORKSPACE,
              payload: {
                category: locationCategory,
                workspaceId: highlightedWorkspace.workspaceId || id,
              },
              query: {
                featureFlags,
                ...(dataviewInstances?.length && { dataviewInstances }),
                ...(highlightedWorkspace.viewport || {}),
              },
              replaceQuery: true,
            }
          }
          return (
            <li key={id || name} className={cx(styles.workspace)}>
              {isLegacyCVPWorkspace ? (
                <a href="https://globalfishingwatch.org/carrier-portal" target="_blank">
                  <img className={styles.image} alt={name} src={img} />
                </a>
              ) : (
                <Link
                  to={linkTo}
                  onClick={() => onWorkspaceClick(highlightedWorkspace)}
                  className={styles.imageLink}
                >
                  <img className={styles.image} alt={name} src={img} />
                </Link>
              )}
              <div className={styles.info}>
                {isLegacyCVPWorkspace ? (
                  <a href="https://globalfishingwatch.org/carrier-portal" target="_blank">
                    <h3 className={styles.title}>{name}</h3>
                  </a>
                ) : (
                  <Link to={linkTo} onClick={() => onWorkspaceClick(highlightedWorkspace)}>
                    <h3 className={styles.title}>{name}</h3>
                  </Link>
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
                  {isLegacyCVPWorkspace ? (
                    <a
                      href="https://globalfishingwatch.org/carrier-portal"
                      className={styles.link}
                      target="_blank"
                    >
                      {cta}
                    </a>
                  ) : (
                    <Link
                      to={linkTo}
                      onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      className={styles.link}
                    >
                      {cta}
                    </Link>
                  )}
                  {reports?.map(({ id: reportId, key }) => {
                    const reportLink = reportId
                      ? {
                          type: REPORT,
                          payload: {
                            reportId,
                          },
                          query: { featureFlags },
                        }
                      : undefined
                    if (!reportLink) {
                      return null
                    }
                    return (
                      <Link
                        to={reportLink}
                        className={styles.link}
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      >
                        {t(key || 'analysis.see', 'See report')}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default WorkspacesList
