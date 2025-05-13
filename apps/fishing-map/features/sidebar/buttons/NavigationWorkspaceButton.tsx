import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import Link from 'redux-first-router-link'

import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, WorkspaceCategory } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectHasVesselProfileInstancePinned } from 'features/dataviews/selectors/dataviews.selectors'
import { EMPTY_FILTERS } from 'features/search/search.config'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import {
  cleanVesselProfileDataviewInstances,
  usePinVesselProfileToWorkspace,
} from 'features/sidebar/sidebar-header.hooks'
import { DEFAULT_VESSEL_STATE } from 'features/vessel/vessel.config'
import { resetVesselState } from 'features/vessel/vessel.slice'
import { selectFeatureFlags } from 'features/workspace/workspace.selectors'
import { cleanReportQuery } from 'features/workspace/workspace.slice'
import type { ROUTE_TYPES } from 'routes/routes'
import { WORKSPACE } from 'routes/routes'
import {
  selectIsAnyWorkspaceReportLocation,
  selectIsWorkspaceVesselLocation,
  selectLocationCategory,
  selectLocationQuery,
  selectWorkspaceId,
} from 'routes/routes.selectors'

import styles from '../SidebarHeader.module.css'

function NavigationWorkspaceButton() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const onPinVesselToWorkspaceAndNavigateClick = usePinVesselProfileToWorkspace()
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const isAnyWorkspaceReportLocation = useSelector(selectIsAnyWorkspaceReportLocation)
  const workspaceId = useSelector(selectWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const locationCategory = useSelector(selectLocationCategory)
  const hasVesselProfileInstancePinned = useSelector(selectHasVesselProfileInstancePinned)
  const featureFlags = useSelector(selectFeatureFlags)

  const tooltip = t('navigateBackTo', 'Go back to {{section}}', {
    section: t('workspace.title', 'Workspace').toLocaleLowerCase(),
  })

  const linkTo = useMemo(() => {
    const query = {
      ...cleanReportQuery(locationQuery),
      ...EMPTY_FILTERS,
      ...DEFAULT_VESSEL_STATE,
      featureFlags,
    }
    return {
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
  }, [featureFlags, locationCategory, locationQuery, workspaceId])

  const resetState = useCallback(() => {
    resetSidebarScroll()
    dispatch(resetVesselState())
  }, [dispatch])

  if (
    workspaceId &&
    (isWorkspaceVesselLocation ||
      (isAnyWorkspaceReportLocation && locationCategory !== WorkspaceCategory.Reports))
  ) {
    return isWorkspaceVesselLocation && !hasVesselProfileInstancePinned ? (
      // Can't use Link because we need to intercept the navigation to show the confirmation dialog
      <IconButton
        icon="close"
        type="border"
        onClick={() => onPinVesselToWorkspaceAndNavigateClick(linkTo)}
        className={cx(styles.workspaceLink, 'print-hidden')}
        tooltip={tooltip}
      />
    ) : (
      <Link className={styles.workspaceLink} to={linkTo} onClick={resetState}>
        <IconButton className="print-hidden" type="border" icon="close" tooltip={tooltip} />
      </Link>
    )
  }
  return null
}

export default NavigationWorkspaceButton
