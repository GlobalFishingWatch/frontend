import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import geojsonArea from '@mapbox/geojson-area'
import cx from 'classnames'
import parse from 'html-react-parser'
import type { BufferOperation, BufferUnit } from 'types'

import { DataviewType, DRAW_DATASET_SOURCE } from '@globalfishingwatch/api-types'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import type { ContextFeature } from '@globalfishingwatch/deck-layers'
import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Button, Icon, Popover } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectCurrentReport,
  selectReportBufferOperation,
  selectReportBufferUnit,
  selectReportBufferValue,
} from 'features/app/selectors/app.reports.selector'
import type { Area } from 'features/areas/areas.slice'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import {
  DEFAULT_BUFFER_OPERATION,
  DEFAULT_BUFFER_VALUE,
  NAUTICAL_MILES,
} from 'features/reports/areas/area-reports.config'
import {
  selectReportArea,
  selectReportAreaDataviews,
  selectReportAreaStatus,
} from 'features/reports/areas/area-reports.selectors'
import {
  resetReportData,
  selectReportPreviewBuffer,
  setPreviewBuffer,
} from 'features/reports/shared/activity/reports-activity.slice'
import { useReportFeaturesLoading } from 'features/reports/shared/activity/reports-activity-timeseries.hooks'
import ReportTitlePlaceholder from 'features/reports/shared/placeholders/ReportTitlePlaceholder'
import { cleanCurrentWorkspaceStateBufferParams } from 'features/workspace/workspace.slice'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

import { useHighlightReportArea } from '../area-reports.hooks'

import { BufferButtonTooltip } from './BufferButonTooltip'

import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const [showBufferTooltip, setShowBufferTooltip] = useState(false)
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()
  const loading = useReportFeaturesLoading()
  const highlightArea = useHighlightReportArea()
  const areaDataview = useSelector(selectReportAreaDataviews)?.[0]
  const report = useSelector(selectCurrentReport)
  const reportArea = useSelector(selectReportArea)
  const reportAreaStatus = useSelector(selectReportAreaStatus)
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
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click print/save as pdf`,
    })
    window.print()
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

  const dataset = areaDataview?.datasets?.[0]
  const reportTitle = useMemo(() => {
    const propertyToInclude = getDatasetConfigurationProperty({
      dataset,
      property: 'propertyToInclude',
    }) as string
    const valueProperties = getDatasetConfigurationProperty({
      dataset,
      property: 'valueProperties',
    })
    const valueProperty = Array.isArray(valueProperties) ? valueProperties[0] : valueProperties

    let areaName = report?.name
    if (!areaName) {
      if (
        areaDataview?.config?.type === DataviewType.Context ||
        areaDataview?.config?.type === DataviewType.UserContext ||
        areaDataview?.config?.type === DataviewType.UserPoints
      ) {
        if (reportAreaStatus === AsyncReducerStatus.Finished) {
          if (dataset?.source === DRAW_DATASET_SOURCE) {
            areaName = getDatasetLabel(dataset)
          } else {
            areaName =
              reportArea?.properties?.[propertyToInclude] ||
              reportArea?.properties?.[valueProperty] ||
              getDatasetLabel(dataset)
          }
        }
      } else {
        areaName = area?.name
      }
    }

    if (!urlBufferValue) {
      return areaName
    }
    if (areaName && urlBufferOperation === 'difference') {
      return `${urlBufferValue} ${t(`analysis.${urlBufferUnit}` as any, urlBufferUnit)} ${t(
        `analysis.around`,
        'around'
      )} ${areaName}`
    }
    if (areaName && urlBufferOperation === 'dissolve') {
      if (urlBufferValue > 0) {
        return `${areaName} ${t('common.and', 'and')} ${urlBufferValue} ${t(
          `analysis.${urlBufferUnit}` as any,
          urlBufferUnit
        )} ${t('analysis.around', 'around')}`
      } else {
        return `${areaName} ${t('common.minus', 'minus')} ${Math.abs(urlBufferValue)} ${t(
          `analysis.${urlBufferUnit}` as any,
          urlBufferUnit
        )}`
      }
    }
    return ''
  }, [
    dataset,
    report?.name,
    urlBufferValue,
    urlBufferOperation,
    areaDataview?.config?.type,
    reportAreaStatus,
    reportArea?.properties,
    area?.name,
    t,
    urlBufferUnit,
  ])

  const reportDescription =
    typeof report?.description === 'string' && report?.description.length
      ? parse(report?.description)
      : report?.description || ''

  const reportAreaSpace = reportArea?.geometry
    ? Math.round(geojsonArea.geometry(reportArea?.geometry) / 1000000)
    : null

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
          {t('analysis.linkToReport', 'Check the dynamic report here')}
        </a>

        <div className={styles.actions}>
          <Popover
            open={showBufferTooltip}
            onClickOutside={handleTooltipHide}
            className={cx(styles.highlightPanel, 'print-hidden')}
            placement="bottom"
            content={
              <div className={styles.filterButtonWrapper}>
                <BufferButtonTooltip
                  areaType={area?.properties?.originalGeometryType}
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
                {t('analysis.buffer', 'Buffer Area')}
                <Icon icon="expand" type="default" />
              </Button>
            </div>
          </Popover>
          <Button
            type="border-secondary"
            size="small"
            className={styles.actionButton}
            onClick={onPrintClick}
            disabled={loading}
          >
            <p>{t('analysis.print ', 'print')}</p>
            <Icon icon="print" type="default" />
          </Button>
        </div>
      </div>
      {reportDescription && (
        <div className={styles.row}>
          <h2 className={styles.description}>{reportDescription}</h2>
        </div>
      )}
    </div>
  )
}
