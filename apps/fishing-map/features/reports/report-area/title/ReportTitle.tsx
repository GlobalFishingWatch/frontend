import { Fragment, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import geojsonArea from '@mapbox/geojson-area'
import cx from 'classnames'
import parse from 'html-react-parser'

import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Icon, IconButton, Popover } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  DEFAULT_BUFFER_VALUE,
  ENTIRE_WORLD_REPORT_AREA_ID,
  NAUTICAL_MILES,
} from 'features/reports/report-area/area-reports.config'
import {
  selectIsGlobalReport,
  selectReportArea,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/reports/report-area/area-reports.selectors'
import { getReportAreaStringByLocale } from 'features/reports/report-area/title/report-title.utils'
import { DEFAULT_BUFFER_OPERATION } from 'features/reports/reports.config'
import { selectCurrentReport } from 'features/reports/reports.selectors'
import { useReportFeaturesLoading } from 'features/reports/reports-timeseries.hooks'
import AreaReportSearch from 'features/reports/shared/area-search/AreaReportSearch'
import ReportTitlePlaceholder from 'features/reports/shared/placeholders/ReportTitlePlaceholder'
import {
  resetReportData,
  selectReportPreviewBuffer,
  setPreviewBuffer,
} from 'features/reports/tabs/activity/reports-activity.slice'
import { cleanCurrentWorkspaceStateBufferParams } from 'features/workspace/workspace.slice'
import { useLocationConnect } from 'routes/routes.hook'
import type { BufferOperation, BufferUnit } from 'types'

import { useFitAreaInViewport, useHighlightReportArea, useReportTitle } from '../area-reports.hooks'

import { BufferButtonTooltip } from './BufferButonTooltip'

import styles from './ReportTitle.module.css'

export default function ReportTitle({ isSticky }: { isSticky?: boolean }) {
  const { t, i18n } = useTranslation()
  const [showBufferTooltip, setShowBufferTooltip] = useState(false)
  const [longDescription, setLongDescription] = useState(false)
  const [expandedDescription, setExpandedDescription] = useState(false)
  const descriptionRef = useRef<HTMLSpanElement>(null)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const loading = useReportFeaturesLoading()
  const highlightArea = useHighlightReportArea()
  const fitAreaInViewport = useFitAreaInViewport()
  const isGlobalReport = useSelector(selectIsGlobalReport)
  const report = useSelector(selectCurrentReport)
  const reportArea = useSelector(selectReportArea)
  const reportTitle = useReportTitle()
  const previewBuffer = useSelector(selectReportPreviewBuffer)
  const urlBufferValue = useSelector(selectReportBufferValue)
  const urlBufferUnit = useSelector(selectReportBufferUnit)
  const urlBufferOperation = useSelector(selectReportBufferOperation)

  const handleBufferUnitChange = useCallback(
    (option: ChoiceOption<BufferUnit>) => {
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
    (option: ChoiceOption<BufferOperation>) => {
      dispatch(
        setPreviewBuffer({
          operation: option.id,
          unit: previewBuffer.unit || NAUTICAL_MILES,
          value: previewBuffer.value || DEFAULT_BUFFER_VALUE,
        })
      )
    },
    [dispatch, previewBuffer]
  )

  const handleBufferValueChange = useCallback(
    (values: number[]) => {
      const value = Math.round(values[1])
      const operation = value < 0 ? 'dissolve' : previewBuffer.operation || DEFAULT_BUFFER_OPERATION
      dispatch(
        setPreviewBuffer({
          value,
          unit: previewBuffer.unit || NAUTICAL_MILES,
          operation,
        })
      )
    },
    [previewBuffer, dispatch]
  )

  const onPrintClick = () => {
    fitAreaInViewport()
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click print/save as pdf`,
    })
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleTooltipHide = useCallback(() => {
    setShowBufferTooltip(false)
    dispatch(
      setPreviewBuffer({
        unit: null,
        value: null,
        operation: null,
      })
    )
  }, [dispatch])

  const handleTooltipShow = useCallback(() => {
    setShowBufferTooltip(true)
    // This is to create the preview buffer on tooltip show
    dispatch(
      setPreviewBuffer({
        value: urlBufferValue || DEFAULT_BUFFER_VALUE,
        unit: urlBufferUnit || NAUTICAL_MILES,
        operation: urlBufferOperation || DEFAULT_BUFFER_OPERATION,
      })
    )
  }, [dispatch, urlBufferValue, urlBufferUnit, urlBufferOperation])

  const handleConfirmBuffer = useCallback(() => {
    setShowBufferTooltip(false)
    highlightArea(undefined)
    dispatchQueryParams({
      reportBufferValue: previewBuffer.value!,
      reportBufferUnit: previewBuffer.unit!,
      reportBufferOperation: previewBuffer.operation!,
    })
    dispatch(resetReportData())
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Confirm area buffer`,
      label: `${previewBuffer.value} ${previewBuffer.unit} ${previewBuffer.operation}`,
    })
  }, [
    highlightArea,
    dispatchQueryParams,
    previewBuffer.value,
    previewBuffer.unit,
    previewBuffer.operation,
    dispatch,
  ])

  const handleRemoveBuffer = useCallback(() => {
    setShowBufferTooltip(false)
    if (reportArea) {
      highlightArea(reportArea as ContextFeature)
    }
    dispatchQueryParams({
      reportBufferValue: undefined,
      reportBufferUnit: undefined,
      reportBufferOperation: undefined,
    })
    dispatch(resetReportData())
    dispatch(cleanCurrentWorkspaceStateBufferParams())
  }, [dispatch, dispatchQueryParams, highlightArea, reportArea])

  const reportDescription =
    typeof report?.description === 'string' && report?.description.length
      ? parse(getReportAreaStringByLocale(report?.description, i18n.language))
      : report?.description || ''

  const reportAreaSpace =
    reportArea?.id !== ENTIRE_WORLD_REPORT_AREA_ID && reportArea?.geometry
      ? Math.round(geojsonArea.geometry(reportArea?.geometry) / 1000000)
      : null

  useLayoutEffect(() => {
    if (descriptionRef.current) {
      setLongDescription(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight)
    }
  }, [descriptionRef, reportDescription])

  const toggleExpandedDescription = useCallback(() => {
    setExpandedDescription(!expandedDescription)
  }, [expandedDescription])

  if (!reportTitle) {
    return (
      <div className={cx(styles.container, styles.placeholder)}>
        <ReportTitlePlaceholder />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={cx(styles.row, styles.border)}>
        <h1 className={styles.title} data-test="report-title">
          {reportTitle}

          {reportAreaSpace && (
            <span className={styles.secondary}> {formatI18nNumber(reportAreaSpace)} km²</span>
          )}
        </h1>
        <a className={styles.reportLink} href={window.location.href}>
          {t('analysis.linkToReport')}
        </a>

        {isGlobalReport && <AreaReportSearch />}
        <div className={styles.actions}>
          {!isGlobalReport && (
            <Popover
              open={showBufferTooltip}
              onClickOutside={handleTooltipHide}
              className={cx(styles.highlightPanel, 'print-hidden')}
              placement="bottom"
              content={
                <div className={styles.filterButtonWrapper}>
                  <BufferButtonTooltip
                    areaType={reportArea?.properties?.originalGeometryType}
                    activeUnit={previewBuffer.unit || NAUTICAL_MILES}
                    defaultValue={urlBufferValue || DEFAULT_BUFFER_VALUE}
                    activeOperation={previewBuffer.operation || DEFAULT_BUFFER_OPERATION}
                    handleRemoveBuffer={handleRemoveBuffer}
                    handleConfirmBuffer={handleConfirmBuffer}
                    handleBufferUnitChange={handleBufferUnitChange}
                    handleBufferValueChange={handleBufferValueChange}
                    handleBufferOperationChange={handleBufferOperationChange}
                  />
                </div>
              }
            >
              <div>
                <Button
                  onClick={handleTooltipShow}
                  // onHide: handleTooltipHide,
                  type="border-secondary"
                  size="small"
                  className={styles.actionButton}
                >
                  {t('analysis.buffer')}
                  <Icon icon="expand" type="default" />
                </Button>
              </div>
            </Popover>
          )}
          <IconButton
            className={styles.actionButton}
            type="border"
            icon="print"
            tooltip={t('analysis.print')}
            size="small"
            tooltipPlacement="bottom"
            onClick={onPrintClick}
            disabled={loading}
          />
        </div>
      </div>
      {reportDescription && !isSticky && (
        <Fragment>
          <span
            className={cx(styles.description, { [styles.expanded]: expandedDescription })}
            ref={descriptionRef}
          >
            {reportDescription}{' '}
          </span>
          {longDescription && (
            <span
              className={styles.descriptionToggle}
              onClick={toggleExpandedDescription}
              role="button"
              tabIndex={0}
            >
              {expandedDescription ? t('vessel.insights.gapsSeeLess') : t('common.seeMore')}
            </span>
          )}
        </Fragment>
      )}
    </div>
  )
}
