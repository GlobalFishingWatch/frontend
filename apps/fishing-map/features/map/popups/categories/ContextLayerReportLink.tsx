import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectSidebarOpen } from 'features/app/selectors/app.selectors'
import { selectHasReportLayersVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { DEFAULT_POINT_BUFFER_VALUE } from 'features/reports/report-area/area-reports.config'
import { DEFAULT_BUFFER_OPERATION, DEFAULT_BUFFER_UNIT } from 'features/reports/reports.config'
import { selectReportAreaId, selectReportDatasetId } from 'features/reports/reports.selectors'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { selectWorkspace } from 'features/workspace/workspace.selectors'
import { cleanCurrentWorkspaceReportState } from 'features/workspace/workspace.slice'
import { WORKSPACE_REPORT } from 'routes/routes'
import { selectLocationQuery } from 'routes/routes.selectors'

import { getAreaIdFromFeature } from './ContextLayers.hooks'

import styles from '../Popup.module.css'

type ContextLayerReportLinkProps = {
  feature: ContextPickingObject | UserLayerPickingObject
  onClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject
  ) => void
}

const ContextLayerReportLink = ({ feature, onClick }: ContextLayerReportLinkProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasAnalysableLayer = useSelector(selectHasReportLayersVisible)
  const workspace = useSelector(selectWorkspace)
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const isPointFeature = (feature?.geometry as any)?.type === 'Point'
  const query = useSelector(selectLocationQuery)
  const reportAreaDataset = useSelector(selectReportDatasetId)
  const reportAreaId = useSelector(selectReportAreaId)
  const areaId = getAreaIdFromFeature(feature)
  const isSameAreaId = reportAreaId?.toString() === areaId?.toString()
  const isSameDataset = feature.datasetId === reportAreaDataset
  const isSameArea = isSameAreaId && isSameDataset
  const addAreaToReport = reportAreaDataset && reportAreaId && !isSameArea

  if (!hasAnalysableLayer || isSameArea) {
    return (
      <IconButton
        icon="analysis"
        disabled={!hasAnalysableLayer}
        size="small"
        tooltip={
          isSameArea
            ? ''
            : t(
                'common.analysisNotAvailable',
                'Toggle an activity or environment layer on to analyse in in this area'
              )
        }
      />
    )
  }

  const onReportClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Open analysis panel',
      label: areaId as string,
    })
    resetSidebarScroll()
    dispatch(resetReportData())
    dispatch(cleanCurrentWorkspaceReportState())
    if (onClick) {
      onClick(e, feature)
    }
  }

  const reportLinkTo = {
    type: WORKSPACE_REPORT,
    payload: {
      category: workspace?.category || DEFAULT_WORKSPACE_CATEGORY,
      workspaceId: workspace?.id || DEFAULT_WORKSPACE_ID,
      datasetId: feature.datasetId,
      areaId,
    },
    query: {
      ...query,
      reportBufferUnit: isPointFeature ? DEFAULT_BUFFER_UNIT : undefined,
      reportBufferValue: isPointFeature ? DEFAULT_POINT_BUFFER_VALUE : undefined,
      reportBufferOperation: isPointFeature ? DEFAULT_BUFFER_OPERATION : undefined,
      ...(!isSidebarOpen && { sidebarOpen: true }),
    },
  }

  const addReportLinkTo = {
    ...reportLinkTo,
    payload: {
      ...reportLinkTo.payload,
      datasetId: [reportAreaDataset, (feature as any).datasetId].join(','),
      areaId: [reportAreaId, areaId].join(','),
    },
  }

  return (
    <Fragment>
      <Link className={styles.workspaceLink} to={reportLinkTo} onClick={onReportClick}>
        <IconButton
          icon="analysis"
          tooltip={t('common.analysis', 'Create an analysis for this area')}
          testId="open-analysis"
          size="small"
        />
      </Link>
      {addAreaToReport && (
        <Link className={styles.workspaceLink} to={addReportLinkTo} onClick={onReportClick}>
          <IconButton
            icon="add-polygon-to-analysis"
            tooltip={t('common.analysisAddArea', 'Add area to the analysis')}
            testId="add-analysis"
            size="small"
          />
        </Link>
      )}
    </Fragment>
  )
}

export default ContextLayerReportLink
