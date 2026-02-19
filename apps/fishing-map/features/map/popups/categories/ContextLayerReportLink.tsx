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
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import {
  getIsDataviewReportSupported,
  selectReportLayersVisible,
} from 'features/dataviews/selectors/dataviews.selectors'
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
  const reportLayersVisible = useSelector(selectReportLayersVisible)
  const isDataviewReportAnalysable = getIsDataviewReportSupported(
    reportLayersVisible!,
    feature?.layerId
  )
  const workspace = useSelector(selectWorkspace)
  const isSidebarOpen = useSelector(selectSidebarOpen)
  const isPointFeature = (feature?.geometry as any)?.type === 'Point'
  const query = useSelector(selectLocationQuery)
  const reportAreaDataset = useSelector(selectReportDatasetId)
  const reportAreaId = useSelector(selectReportAreaId)
  const areaId = getAreaIdFromFeature(feature)
  const reportAreaIds = reportAreaId?.split(',') ?? []
  const reportAreaDatasetIds = reportAreaDataset?.split(',') ?? []
  const isSameAreaId = reportAreaIds.includes(areaId?.toString() ?? '')
  const isSameDataset = reportAreaDatasetIds.includes(feature.datasetId)
  const isSameArea = isSameAreaId && isSameDataset
  const addAreaToReport = reportAreaDataset && reportAreaId && !isSameArea
  const removeAreaFromReport =
    reportAreaDataset && reportAreaId && isSameArea && reportAreaIds.length > 1

  if (!isDataviewReportAnalysable && !addAreaToReport && !removeAreaFromReport) {
    return (
      <IconButton
        icon="analysis"
        disabled={!isDataviewReportAnalysable}
        size="small"
        tooltip={t((t) => t.common.analysisNotAvailable)}
      />
    )
  }

  const onReportClick = (e: React.MouseEvent<Element, MouseEvent>) => {
    const layerSources = (reportLayersVisible ?? [])
      .map((layer) => (layer.datasets ?? []).map((d) => getDatasetLabel(d)))
      .flat()
      .join(', ')
    trackEvent({
      category: TrackCategory.Analysis,
      action: 'Generate report from context layer',
      label: 'active layer sources: ' + layerSources,
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
      bivariateDataviews: null,
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
  const areaIndex = reportAreaIds.indexOf(areaId?.toString() ?? '')
  const removeReportLinkTo = {
    ...reportLinkTo,
    payload: {
      ...reportLinkTo.payload,
      datasetId: reportAreaDatasetIds.filter((id, index) => index !== areaIndex).join(','),
      areaId: reportAreaIds.filter((id, index) => index !== areaIndex).join(','),
    },
  }

  return (
    <Fragment>
      <Link className={styles.workspaceLink} to={reportLinkTo} onClick={onReportClick}>
        <IconButton
          icon="analysis"
          tooltip={t((t) => t.common.analysis)}
          testId="open-analysis"
          size="small"
        />
      </Link>
      {addAreaToReport && (
        <Link className={styles.workspaceLink} to={addReportLinkTo} onClick={onReportClick}>
          <IconButton
            icon="add-polygon-to-analysis"
            tooltip={t((t) => t.common.analysisAddArea)}
            testId="add-analysis"
            size="small"
          />
        </Link>
      )}
      {removeAreaFromReport && (
        <Link className={styles.workspaceLink} to={removeReportLinkTo} onClick={onReportClick}>
          <IconButton
            icon="remove-polygon-from-analysis"
            tooltip={t((t) => t.common.analysisRemoveArea)}
            testId="remove-analysis"
            size="small"
          />
        </Link>
      )}
    </Fragment>
  )
}

export default ContextLayerReportLink
