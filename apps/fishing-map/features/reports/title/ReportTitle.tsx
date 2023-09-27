import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { Area } from 'features/areas/areas.slice'
import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_BUFFER_VALUE,
  NAUTICAL_MILES,
} from 'features/reports/reports.config'
import {
  resetReportData,
  selectReportPreviewBuffer,
  setPreviewBuffer,
} from 'features/reports/report.slice'
import { selectReportAreaDataview } from 'features/reports/reports.selectors'
import ReportTitlePlaceholder from 'features/reports/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectCurrentReport } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { Bbox } from 'types'
import {
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
  selectUrlBufferOperationQuery,
} from 'routes/routes.selectors'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import useMapInstance from 'features/map/map-context.hooks'
import { PREVIEW_BUFFER_GENERATOR_ID } from 'features/map/map.config'
import { getBufferedAreaBbox } from '../reports.utils'
import { BufferButtonTooltip } from './BufferButonTooltip'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const areaDataview = useSelector(selectReportAreaDataview)
  const report = useSelector(selectCurrentReport)
  const previewBuffer = useSelector(selectReportPreviewBuffer)
  const urlBufferValue = useSelector(selectUrlBufferValueQuery)
  const urlBufferUnit = useSelector(selectUrlBufferUnitQuery)
  const urlBufferOperation = useSelector(selectUrlBufferOperationQuery)
  const fitBounds = useMapFitBounds()
  const { cleanFeatureState, updateFeatureState } = useFeatureState(useMapInstance())

  const [tooltipInstance, setTooltipInstance] = useState<any>(null)

  const handleBufferUnitChange = useCallback(
    (option) => {
      dispatch(
        setPreviewBuffer({
          unit: option.id,
          value: previewBuffer.value || DEFAULT_BUFFER_VALUE,
          operation: previewBuffer.operation || DEFAULT_BUFFER_OPERATION,
        })
      )
    },
    [dispatch, previewBuffer]
  )
  const handleBufferOperationChange = useCallback(
    (option) => {
      dispatch(
        setPreviewBuffer({
          operation: option.id,
          unit: previewBuffer.unit || NAUTICAL_MILES,
          value: previewBuffer.value || DEFAULT_BUFFER_VALUE,
        })
      )
      cleanFeatureState('highlight')
      const featureState = {
        source: PREVIEW_BUFFER_GENERATOR_ID,
        id: area.id,
      }
      updateFeatureState([featureState], 'highlight')
    },
    [dispatch, previewBuffer, updateFeatureState, cleanFeatureState, area]
  )

  const handleBufferValueChange = useCallback(
    (values: number[]) => {
      dispatch(
        setPreviewBuffer({
          value: Math.round(values[1]),
          unit: previewBuffer.unit || NAUTICAL_MILES,
          operation: previewBuffer.operation || DEFAULT_BUFFER_OPERATION,
        })
      )
    },
    [previewBuffer, dispatch]
  )

  const reportLink = window.location.href
  const name = report
    ? report.name
    : areaDataview?.config?.type === GeneratorType.UserContext
    ? areaDataview?.datasets?.[0]?.name
    : area?.name

  const onPrintClick = () => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click print/save as pdf`,
    })
    window.print()
  }

  const handleTooltipHide = useCallback(() => {
    dispatch(
      setPreviewBuffer({
        unit: null,
        value: null,
        operation: null,
      })
    )
  }, [dispatch])

  const handleTooltipShow = useCallback(
    (instance) => {
      setTooltipInstance(instance)
      // This is to create the preview buffer on tooltip show
      dispatch(
        setPreviewBuffer({
          value: urlBufferValue || DEFAULT_BUFFER_VALUE,
          unit: urlBufferUnit || NAUTICAL_MILES,
          operation: urlBufferOperation || DEFAULT_BUFFER_OPERATION,
        })
      )
    },
    [dispatch, setTooltipInstance, urlBufferValue, urlBufferUnit, urlBufferOperation]
  )

  const handleConfirmBuffer = useCallback(() => {
    tooltipInstance!.hide()
    // recenter the map on the selected buffer
    const bounds = getBufferedAreaBbox({
      area,
      value: previewBuffer.value!,
      unit: previewBuffer.unit!,
    }) as Bbox
    fitBounds(bounds)
    dispatchQueryParams({
      reportBufferValue: previewBuffer.value!,
      reportBufferUnit: previewBuffer.unit!,
      reportBufferOperation: previewBuffer.operation!,
    })
    cleanFeatureState('highlight')
    dispatch(resetReportData())
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Confirm area buffer`,
      label: `${previewBuffer.value} ${previewBuffer.unit} ${previewBuffer.operation}`,
    })
  }, [
    tooltipInstance,
    area,
    previewBuffer,
    fitBounds,
    dispatchQueryParams,
    cleanFeatureState,
    dispatch,
  ])

  const handleRemoveBuffer = useCallback(() => {
    tooltipInstance!.hide()
    fitBounds(area.bounds as Bbox)
    dispatchQueryParams({
      reportBufferValue: undefined,
      reportBufferUnit: undefined,
      reportBufferOperation: undefined,
    })
    dispatch(resetReportData())
  }, [dispatch, dispatchQueryParams, tooltipInstance, area, fitBounds])

  return (
    <div className={styles.container}>
      {name ? (
        <Fragment>
          <h1 className={styles.title} data-test="report-title">
            {urlBufferValue
              ? `${urlBufferValue} ${t(`analysis.${urlBufferUnit}` as any, urlBufferUnit)} ${t(
                  `analysis.around`,
                  'around'
                )} ${name}`
              : name}
          </h1>
          <a className={styles.reportLink} href={reportLink}>
            {t('analysis.linkToReport', 'Check the dynamic report here')}
          </a>

          <div className={styles.actions}>
            {/* https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity */}
            {/* 👇 extra div needed to allow element to be keyboard accessible */}
            <div>
              <Button
                type="border-secondary"
                size="small"
                className={styles.actionButton}
                tooltip={
                  <BufferButtonTooltip
                    areaType={area?.geometry?.type}
                    activeUnit={previewBuffer.unit || NAUTICAL_MILES}
                    defaultValue={urlBufferValue || DEFAULT_BUFFER_VALUE}
                    activeOperation={previewBuffer.operation || DEFAULT_BUFFER_OPERATION}
                    handleRemoveBuffer={handleRemoveBuffer}
                    handleConfirmBuffer={handleConfirmBuffer}
                    handleBufferUnitChange={handleBufferUnitChange}
                    handleBufferValueChange={handleBufferValueChange}
                    handleBufferOperationChange={handleBufferOperationChange}
                  />
                }
                tooltipPlacement="bottom"
                tooltipProps={{
                  interactive: true,
                  trigger: 'click',
                  delay: 0,
                  className: styles.bufferContainer,
                  onHide: handleTooltipHide,
                  onShow: handleTooltipShow,
                }}
              >
                {t('analysis.buffer', 'Buffer Area')}
                <Icon icon="expand" type="default" />
              </Button>
            </div>
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              onClick={onPrintClick}
            >
              <p>{t('analysis.print ', 'print')}</p>
              <Icon icon="print" type="default" />
            </Button>
          </div>
        </Fragment>
      ) : (
        <ReportTitlePlaceholder />
      )}
    </div>
  )
}
