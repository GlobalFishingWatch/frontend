import { Fragment, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { To } from 'redux-first-router-link'
import Link from 'redux-first-router-link'

import type { ReportWorkspaceId } from 'data/highlighted-workspaces/reports'
import { REPORT_IDS } from 'data/highlighted-workspaces/reports'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useSetMapCoordinates } from 'features/map/map-viewport.hooks'
import { fetchReportsThunk } from 'features/reports/reports.slice'
import { fetchWorkspacesThunk } from 'features/workspaces-list/workspaces-list.slice'
import { HOME, REPORT, WORKSPACE, WORKSPACE_REPORT } from 'routes/routes'
import { isValidLocationCategory, selectLocationCategory } from 'routes/routes.selectors'

import type { HighlightedWorkspace } from './workspaces-list.selectors'
import {
  selectCurrentHighlightedWorkspaces,
  selectCurrentHighlightedWorkspacesIds,
} from './workspaces-list.selectors'
import WorkspaceWizard from './WorkspaceWizard'

import styles from './WorkspacesList.module.css'

function WorkspacesList() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setMapCoordinates = useSetMapCoordinates()
  const locationCategory = useSelector(selectLocationCategory)
  const highlightedWorkspacesIds = useSelector(selectCurrentHighlightedWorkspacesIds)
  const highlightedWorkspaces = useSelector(selectCurrentHighlightedWorkspaces)
  const validCategory = useSelector(isValidLocationCategory)

  useEffect(() => {
    if (highlightedWorkspacesIds.length) {
      dispatch(fetchWorkspacesThunk({ ids: highlightedWorkspacesIds }))
    }
  }, [dispatch, highlightedWorkspacesIds])

  const onWorkspaceClick = useCallback(
    (workspace: HighlightedWorkspace) => {
      trackEvent({
        category: TrackCategory.GlobalReports,
        action: `Clicked highlighted ${workspace.reportCategory} workspace`,
        label: workspace.name,
      })

      if (workspace.viewport) {
        setMapCoordinates(workspace.viewport)
      }
    },
    [setMapCoordinates]
  )

  if (!validCategory) {
    return (
      <div className={styles.placeholder}>
        <h2>{t('errors.pageNotFound')}</h2>
        <p>🙈</p>
        <Link className={styles.linkButton} to={{ type: HOME, replaceQuery: true, query: {} }}>
          {t('common.seeDefault')}
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {locationCategory === WorkspaceCategory.MarineManager && (
        <Fragment>
          <WorkspaceWizard />
          <label className={styles.listTitle}>{t('common.partnerSites')}</label>
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
          if (!visible) {
            return null
          }

          let linkTo: To
          if (id === DEFAULT_WORKSPACE_ID) {
            linkTo = {
              type: HOME,
              payload: {},
              query: {},
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
                ...(dataviewInstances?.length && { dataviewInstances }),
                ...(highlightedWorkspace.viewport || {}),
              },
              replaceQuery: true,
            }
          }

          return (
            <li key={id || name} className={cx(styles.workspace)}>
              <Link
                to={linkTo}
                onClick={() => onWorkspaceClick(highlightedWorkspace)}
                className={styles.imageLink}
              >
                <img className={styles.image} alt={name} src={img} />
              </Link>
              <div className={styles.info}>
                <Link to={linkTo} onClick={() => onWorkspaceClick(highlightedWorkspace)}>
                  <h3 className={styles.title}>{name}</h3>
                </Link>
                {description && (
                  <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                  ></p>
                )}
                <div className={styles.linksContainer}>
                  <Link
                    to={linkTo}
                    onClick={() => onWorkspaceClick(highlightedWorkspace)}
                    className={styles.link}
                  >
                    {cta}
                  </Link>
                  {reports?.map(({ id: reportId, key }) => {
                    const reportLink = reportId
                      ? {
                          type: REPORT,
                          payload: {
                            reportId,
                          },
                          query: {},
                        }
                      : undefined
                    if (!reportLink) {
                      return null
                    }
                    return (
                      <Link
                        key={reportId}
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
