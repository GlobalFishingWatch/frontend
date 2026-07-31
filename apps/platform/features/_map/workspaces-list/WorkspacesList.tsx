import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'
import cx from 'classnames'

import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/map/workspaces'
import { useSetMapCoordinates } from 'features/_map/map/map-viewport.hooks'
import { fetchWorkspacesThunk } from 'features/_map/workspaces-list/workspaces-list.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { isValidLocationCategory, selectLocationCategory } from 'router/routes.selectors'
import { ROUTE_PATHS } from 'router/routes.utils'
import { htmlSafeParse } from 'utils/html-parser'

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
        <h2>{t((t) => t.errors.pageNotFound)}</h2>
        <p>🙈</p>
        <Link className={styles.linkButton} to={ROUTE_PATHS.MAP} search={{}} replace>
          {t((t) => t.common.seeDefault)}
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {locationCategory === WorkspaceCategory.MarineManager && <WorkspaceWizard />}
      <ul className={cx('card', styles.list)}>
        {locationCategory === WorkspaceCategory.MarineManager && (
          <label className={styles.listTitle}>{t((t) => t.common.partnerSites)}</label>
        )}
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

          // Compute link props based on workspace type
          let linkPath: string
          let linkParams: Record<string, string> = {}
          let linkSearch: Record<string, any>
          let linkReplace = false

          if (id === DEFAULT_WORKSPACE_ID) {
            linkPath = ROUTE_PATHS.MAP
            linkSearch = {}
            linkReplace = true
          } else if (highlightedWorkspace.category === WorkspaceCategory.Reports) {
            linkPath = ROUTE_PATHS.WORKSPACE_REPORT
            linkParams = {
              category: WorkspaceCategory.Reports,
              workspaceId: DEFAULT_WORKSPACE_ID,
            }
            linkSearch = {
              dataviewInstances,
              reportCategory,
              latitude: 0,
              longitude: 0,
              zoom: 0,
              reportLoadVessels: true,
            }
          } else {
            linkPath = ROUTE_PATHS.WORKSPACE
            linkParams = {
              category:
                highlightedWorkspace.category ||
                locationCategory ||
                WorkspaceCategory.FishingActivity,
              workspaceId: id,
            }
            linkSearch = {
              ...(dataviewInstances?.length && { dataviewInstances }),
              ...(highlightedWorkspace.viewport || {}),
            }
            linkReplace = true
          }

          return (
            <li
              key={id || name}
              className={cx(styles.workspace)}
              data-testid={`highlighted-workspace-${id}`}
            >
              <Link
                to={linkPath}
                params={linkParams}
                search={linkSearch}
                replace={linkReplace}
                onClick={() => onWorkspaceClick(highlightedWorkspace)}
                className={styles.imageLink}
              >
                <img className={styles.image} alt={name} src={img} />
              </Link>
              <div className={styles.info}>
                <Link
                  to={linkPath}
                  params={linkParams}
                  search={linkSearch}
                  replace={linkReplace}
                  onClick={() => onWorkspaceClick(highlightedWorkspace)}
                >
                  <h3 className={styles.title}>{name}</h3>
                </Link>
                {description && <p className={styles.description}>{htmlSafeParse(description)}</p>}
                <div className={styles.linksContainer}>
                  <Link
                    to={linkPath}
                    params={linkParams}
                    search={linkSearch}
                    replace={linkReplace}
                    onClick={() => onWorkspaceClick(highlightedWorkspace)}
                    className={styles.link}
                  >
                    {cta}
                  </Link>
                  {reports?.map(({ id: reportId }) => {
                    if (!reportId) {
                      return null
                    }
                    return (
                      <Link
                        key={reportId}
                        to="/report/$reportId"
                        params={{ reportId }}
                        search={{}}
                        className={styles.link}
                        onClick={() => onWorkspaceClick(highlightedWorkspace)}
                      >
                        {t((t) => t.analysis.see)}
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
