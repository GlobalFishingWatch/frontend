import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, WorkspaceCategory } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { EMPTY_SEARCH_FILTERS } from 'features/search/search.config'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { cleanVesselProfileDataviewInstances } from 'features/sidebar/sidebar-header.hooks'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { resetVesselState } from 'features/vessel/vessel.slice'
import { cleanReportQuery } from 'features/workspace/workspace.slice'
import type { ROUTE_TYPES } from 'routes/routes'
import { HOME, WORKSPACE } from 'routes/routes'
import {
  selectIsAnySearchLocation,
  selectIsAnyWorkspaceReportLocation,
  selectIsVesselLocation,
  selectIsWorkspaceVesselLocation,
  selectLocationCategory,
  selectLocationQuery,
  selectWorkspaceId,
} from 'routes/routes.selectors'

import styles from '../SidebarHeader.module.css'

function NavigationWorkspaceButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const isSearchLocation = useSelector(selectIsAnySearchLocation)
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)
  const isAnyWorkspaceReportLocation = useSelector(selectIsAnyWorkspaceReportLocation)
  const workspaceId = useSelector(selectWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const locationCategory = useSelector(selectLocationCategory)

  const resetState = useCallback(() => {
    resetSidebarScroll()
    dispatch(resetVesselState())
  }, [dispatch])

  if (isSearchLocation || (!workspaceId && isVesselLocation)) {
    const linkTo = {
      type: HOME,
      query: {},
      replaceQuery: true,
      isHistoryNavigation: true,
    }
    return (
      <Link className={cx(styles.workspaceLink, 'print-hidden')} to={linkTo} onClick={resetState}>
        <IconButton type="border" icon="close" />
      </Link>
    )
  }

  if (
    workspaceId &&
    (isWorkspaceVesselLocation ||
      isTrackCorrectionOpen ||
      (isAnyWorkspaceReportLocation && locationCategory !== WorkspaceCategory.Reports))
  ) {
    const tooltip = t((t) => t.common.navigateBackTo, {
      section: t((t) => t.workspace.title).toLocaleLowerCase(),
    })
    const query = {
      ...cleanReportQuery(locationQuery),
      ...EMPTY_SEARCH_FILTERS,
      ...DEFAULT_VESSEL_STATE,
      trackCorrectionId: undefined,
    }
    const linkTo = {
      type: WORKSPACE as ROUTE_TYPES,
      payload: {
        workspaceId: workspaceId,
        category: locationCategory || DEFAULT_WORKSPACE_CATEGORY,
      },
      query: {
        ...query,
        dataviewInstances: cleanVesselProfileDataviewInstances(query.dataviewInstances),
      },
      isHistoryNavigation: true,
    }
    return (
      <Link className={cx(styles.workspaceLink, 'print-hidden')} to={linkTo} onClick={resetState}>
        <IconButton type="border" icon="close" tooltip={tooltip} />
      </Link>
    )
  }
  return null
}

export default NavigationWorkspaceButton
