import React, { useEffect, useState, useMemo, useCallback, Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Button, IconButton, Choice, ChoiceOption } from '@globalfishingwatch/ui-components'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useLocationConnect } from 'routes/routes.hook'
import sectionStyles from 'features/workspace/shared/Sections.module.css'
import { selectUserData } from 'features/user/user.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveActivityDataviews,
  selectHasAnalysisLayersVisible,
} from 'features/dataviews/dataviews.selectors'
import { getActivityDatasetsDownloadSupported } from 'features/datasets/datasets.utils'
import { selectAnalysisQuery, selectAnalysisTypeQuery } from 'features/app/app.selectors'
import { WorkspaceAnalysisType } from 'types'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { FIT_BOUNDS_ANALYSIS_PADDING } from 'data/config'
import LoginButtonWrapper from 'routes/LoginButtonWrapper'
import { setDownloadActivityGeometry } from 'features/download/downloadActivity.slice'
import styles from './Analysis.module.css'
import {
  clearAnalysisGeometry,
  selectAnalysisAreaName,
  selectAnalysisGeometry,
} from './analysis.slice'
import AnalysisEvolution from './AnalysisEvolution'
import { useAnalysisGeometry, useFilteredTimeSeries } from './analysis.hooks'
import { AnalysisGraphProps } from './AnalysisEvolutionGraph'
import { ComparisonGraphProps } from './AnalysisPeriodComparisonGraph'
import AnalysisPeriodComparison from './AnalysisPeriodComparison'
import AnalysisBeforeAfter from './AnalysisBeforeAfter'

export type AnalysisTypeProps = {
  layersTimeseriesFiltered?: AnalysisGraphProps[] | ComparisonGraphProps[]
  hasAnalysisLayers: boolean
  analysisAreaName: string
  analysisGeometryLoaded?: boolean
}

const ANALYSIS_COMPONENTS_BY_TYPE: Record<
  WorkspaceAnalysisType,
  React.FC<AnalysisTypeProps> | null
> = {
  evolution: AnalysisEvolution,
  correlation: null,
  periodComparison: AnalysisPeriodComparison,
  beforeAfter: AnalysisBeforeAfter,
}

function Analysis() {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const fitMapBounds = useMapFitBounds()
  const dispatch = useDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const dataviews = useSelector(selectActiveActivityDataviews)
  const analysisGeometry = useSelector(selectAnalysisGeometry)
  const userData = useSelector(selectUserData)
  const analysisType = useSelector(selectAnalysisTypeQuery)
  const { bounds } = useSelector(selectAnalysisQuery)

  const analysisAreaName = useSelector(selectAnalysisAreaName)
  const hasAnalysisLayers = useSelector(selectHasAnalysisLayersVisible)
  const datasetsReportAllowed = getActivityDatasetsDownloadSupported(
    dataviews,
    userData?.permissions || []
  )
  const datasetsReportSupported = datasetsReportAllowed?.length > 0

  const [timeRangeTooLong, setTimeRangeTooLong] = useState<boolean>(true)

  useEffect(() => {
    if (start && end) {
      const startDateTime = DateTime.fromISO(start)
      const endDateTime = DateTime.fromISO(end)
      const duration = endDateTime.diff(startDateTime, 'years')
      setTimeRangeTooLong(duration.years > 1)
    }
  }, [start, end])

  const onCloseClick = () => {
    cleanFeatureState('highlight')
    cleanFeatureState('click')
    batch(() => {
      dispatch(clearAnalysisGeometry())
      dispatchQueryParams({
        analysis: undefined,
        analysisType: undefined,
        analysisTimeComparison: undefined,
      })
    })
  }

  const onDownloadClick = async () => {
    dispatch(
      setDownloadActivityGeometry({ geometry: analysisGeometry.geometry, name: analysisAreaName })
    )
  }

  const layersTimeseriesFiltered = useFilteredTimeSeries()
  const analysisGeometryLoaded = useAnalysisGeometry()
  const timeComparisonEnabled = useMemo(() => {
    let tooltip = ''
    let enabled = true
    if (!dataviews || !dataviews.length) {
      tooltip = t(
        'analysis.errorTimeComparisonDataviews',
        'At least one activity layer must be enabled'
      )
      enabled = false
    } else if (
      dataviews.length > 1 &&
      !dataviews.every((d) => !d.config.filters || !Object.keys(d.config.filters).length)
    ) {
      tooltip = t(
        'analysis.errorTimeComparisonFilters',
        'Several layers with filters are not supported'
      )
      enabled = false
    }
    return {
      enabled,
      tooltip,
    }
  }, [dataviews, t])

  const ANALYSIS_TYPE_OPTIONS: (ChoiceOption & { hidden?: boolean })[] = useMemo(
    () =>
      [
        {
          id: 'evolution',
          title: t('analysis.evolution', 'Evolution'),
        },
        {
          id: 'correlation',
          title: t('analysis.correlation', 'correlation'),
          hidden: true,
          tooltip: t('common.comingSoon', 'Coming Soon'),
          tooltipPlacement: 'top' as any,
        },
        {
          id: 'beforeAfter',
          title: t('analysis.beforeAfter', 'before/after'),
          tooltip: timeComparisonEnabled.tooltip,
          disabled: !timeComparisonEnabled.enabled,
        },
        {
          id: 'periodComparison',
          title: t('analysis.periodComparison', 'period comparison'),
          tooltip: timeComparisonEnabled.tooltip,
          disabled: !timeComparisonEnabled.enabled,
        },
      ].filter((option) => !option.hidden),
    [timeComparisonEnabled, t]
  )

  const onAnalysisTypeClick = useCallback(
    (option: ChoiceOption) => {
      fitMapBounds(bounds, { padding: FIT_BOUNDS_ANALYSIS_PADDING })
      dispatchQueryParams({ analysisType: option.id as WorkspaceAnalysisType })
    },
    [bounds, dispatchQueryParams, fitMapBounds]
  )

  const AnalysisComponent = useMemo(() => ANALYSIS_COMPONENTS_BY_TYPE[analysisType], [analysisType])

  const disableReportDownload =
    timeRangeTooLong ||
    !analysisGeometryLoaded ||
    !layersTimeseriesFiltered ||
    !hasAnalysisLayers ||
    !datasetsReportSupported

  const showReportDownload = analysisType === 'evolution' && hasAnalysisLayers

  let downloadTooltip = ''
  if (analysisType !== 'evolution') {
    downloadTooltip = t('common.comingSoon', 'Coming Soon')
  } else if (timeRangeTooLong) {
    downloadTooltip = t(
      'analysis.timeRangeTooLong',
      'Reports are only allowed for time ranges up to a year'
    )
  } else if (!datasetsReportSupported) {
    downloadTooltip = t('analysis.onlyAISAllowed', 'Only AIS datasets are allowed to download')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          {t('analysis.title', 'Analysis')}
          <span className={styles.experimental}>{t('analysis.experimental', 'Experimental')}</span>
        </h2>
        <div className={cx('print-hidden', sectionStyles.sectionButtons)}>
          <IconButton
            icon="close"
            onClick={onCloseClick}
            type="border"
            tooltip={t('analysis.close', 'Close')}
            tooltipPlacement="bottom"
          />
        </div>
      </div>

      <div className={styles.content}>
        {AnalysisComponent && (
          <AnalysisComponent
            layersTimeseriesFiltered={layersTimeseriesFiltered}
            hasAnalysisLayers={hasAnalysisLayers}
            analysisAreaName={analysisAreaName}
            analysisGeometryLoaded={analysisGeometryLoaded}
          />
        )}
        <div>
          <Choice
            options={ANALYSIS_TYPE_OPTIONS}
            className={cx('print-hidden', styles.typeChoice)}
            activeOption={analysisType}
            onOptionClick={onAnalysisTypeClick}
            disabled={!bounds}
          />
        </div>
        <div>
          <p className={styles.placeholder}>
            {t(
              'analysis.disclaimer',
              'The data shown above should be taken as an estimate. Click the button below if you need a more precise anlysis, including the list of vessels involved, and we’ll send it to your email.'
            )}
          </p>
        </div>
        {showReportDownload && (
          <Fragment>
            <div className={styles.footer}>
              <LoginButtonWrapper
                tooltip={t('analysis.downloadLogin', 'Please login to download report')}
              >
                <Button
                  className={styles.saveBtn}
                  onClick={onDownloadClick}
                  tooltip={downloadTooltip}
                  tooltipPlacement="top"
                  disabled={disableReportDownload}
                >
                  {t('analysis.download', 'Download report')}
                </Button>
              </LoginButtonWrapper>
            </div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default Analysis
