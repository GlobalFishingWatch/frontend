import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { WorkspaceCategory } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  isBathymetryContourDataview,
  isBathymetryDataview,
} from 'features/dataviews/dataviews.utils'
import { selectEnvironmentalDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectEnvironmentReportLayersVisible } from 'features/dataviews/selectors/dataviews.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { ReportCategory } from 'features/reports/reports.types'
import { selectUserEnvironmentDatasets } from 'features/user/selectors/user.permissions.selectors'
import { useVisualizationsOptions } from 'features/workspace/activity/activity.hooks'
import GlobalReportLink from 'features/workspace/shared/GlobalReportLink'
import { VisualisationChoice } from 'features/workspace/shared/VisualisationChoice'
import { selectLocationCategory } from 'routes/routes.selectors'
import { getEventLabel } from 'utils/analytics'

import LayerPanelContainer from '../shared/LayerPanelContainer'
import Section from '../shared/Section'

import EnvironmentalLayerPanel from './EnvironmentalLayerPanel'

import styles from 'features/workspace/shared/Section.module.css'

function EnvironmentalLayerSection(): React.ReactElement<any> | null {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const dataviews = useSelector(selectEnvironmentalDataviews)
  const visibleDataviews = dataviews?.filter((dataview) => dataview.config?.visible === true)
  const hasVisibleDataviews = visibleDataviews.length >= 1
  const reportDataviews = useSelector(selectEnvironmentReportLayersVisible)
  const dataviewsMinusBathymetry = dataviews.filter(
    (d) => !isBathymetryDataview(d) && !isBathymetryContourDataview(d)
  )
  const bathymetryDataviews = dataviews.filter(
    (d) => isBathymetryDataview(d) || isBathymetryContourDataview(d)
  )
  const userDatasets = useSelector(selectUserEnvironmentDatasets)
  const hasVisibleReportDataviews = reportDataviews && reportDataviews?.length > 0
  const locationCategory = useSelector(selectLocationCategory)
  const { visualizationOptions, activeVisualizationOption, onVisualizationModeChange } =
    useVisualizationsOptions(DataviewCategory.Environment)

  const dispatch = useAppDispatch()

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.EnvironmentalData,
      action: `Open panel to add a environmental dataset`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.Environment }))
  }, [dispatch, userDatasets.length])

  const onToggleLayer = useCallback(
    (dataview: UrlDataviewInstance) => () => {
      const isVisible = dataview?.config?.visible ?? false
      const dataset = dataview.datasets?.shift()
      const layerTitle = dataset?.name ?? dataset?.id ?? 'Unknown layer'
      const action = isVisible ? 'disable' : 'enable'
      trackEvent({
        category: TrackCategory.EnvironmentalData,
        action: `Toggle environmental layer`,
        label: getEventLabel([action, layerTitle]),
      })
    },
    []
  )

  if (readOnly && !hasVisibleDataviews) {
    return null
  }

  return (
    <Section
      id={DataviewCategory.Environment}
      data-testid="environment-section"
      className="hover-target"
      title={
        <span>
          {t((t) => t.common.environment)}
          {hasVisibleDataviews && (
            <span className={styles.layersCount}>{` (${visibleDataviews.length})`}</span>
          )}
        </span>
      }
      hasVisibleDataviews={hasVisibleDataviews}
      headerOptions={
        !readOnly ? (
          <div className={styles.sectionButtons}>
            <VisualisationChoice
              options={visualizationOptions}
              testId="environmental-visualizations-change"
              activeOption={activeVisualizationOption}
              onSelect={(option) => onVisualizationModeChange(option.id)}
              className={cx({ [styles.hidden]: !hasVisibleDataviews })}
            />
            {hasVisibleReportDataviews && (
              <GlobalReportLink reportCategory={ReportCategory.Environment} />
            )}
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t((t) => t.dataset.addEnvironmental)}
              tooltipPlacement="top"
              onClick={onAddClick}
            />
          </div>
        ) : null
      }
    >
      <>
        <SortableContext items={dataviewsMinusBathymetry}>
          {dataviewsMinusBathymetry.length > 0
            ? dataviewsMinusBathymetry?.map((dataview) => (
                <LayerPanelContainer key={dataview.id} dataview={dataview}>
                  <EnvironmentalLayerPanel dataview={dataview} onToggle={onToggleLayer(dataview)} />
                </LayerPanelContainer>
              ))
            : null}
        </SortableContext>
        {bathymetryDataviews.length > 0 &&
          bathymetryDataviews.map((bathymetryDataview) => (
            <LayerPanelContainer key={bathymetryDataview.id} dataview={bathymetryDataview}>
              <EnvironmentalLayerPanel
                dataview={bathymetryDataview}
                onToggle={onToggleLayer(bathymetryDataview)}
              />
            </LayerPanelContainer>
          ))}
        {locationCategory === WorkspaceCategory.MarineManager && (
          <div className={cx(styles.surveyLink, 'print-hidden')}>
            <a
              href={t((t) => t.feedback.marineManagerDatasetsSurveyLink) as string}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              {t((t) => t.feedback.marineManagerDatasetsSurvey)}
            </a>
          </div>
        )}
      </>
    </Section>
  )
}

export default EnvironmentalLayerSection
