import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { Area } from 'features/areas/areas.slice'
import { DEFAULT_BUFFER_VALUE, NAUTICAL_MILES } from 'features/reports/reports.constants'
import { resetReportData, setPreviewBuffer } from 'features/reports/report.slice'
import { selectReportAreaDataview } from 'features/reports/reports.selectors'
import ReportTitlePlaceholder from 'features/reports/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectCurrentReport } from 'features/app/app.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { Bbox, BufferUnit } from 'types'
import { selectUrlBufferUnitQuery, selectUrlBufferValueQuery } from 'routes/routes.selectors'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import useMapInstance from 'features/map/map-context.hooks'
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
  const urlBufferValue = useSelector(selectUrlBufferValueQuery)
  const urlBufferUnit = useSelector(selectUrlBufferUnitQuery)
  const fitBounds = useMapFitBounds()
  const { cleanFeatureState } = useFeatureState(useMapInstance())

  const [bufferValue, setBufferValue] = useState<number>(urlBufferValue || DEFAULT_BUFFER_VALUE)
  const [bufferUnit, setBufferUnit] = useState<BufferUnit>(urlBufferUnit || NAUTICAL_MILES)
  const [tooltipInstance, setTooltipInstance] = useState<any>(null)

  const handleBufferUnitChange = useCallback(
    (option) => {
      setBufferUnit(option.id)
      dispatch(setPreviewBuffer({ value: bufferValue, unit: option.id }))
    },
    [setBufferUnit, dispatch, bufferValue]
  )
  const handleBufferValueChange = useCallback(
    (values: number[]) => {
      setBufferValue(Math.round(values[1]))
      dispatch(setPreviewBuffer({ value: Math.round(values[1]), unit: bufferUnit }))
    },
    [setBufferValue, dispatch, bufferUnit]
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

  const handleConfirmBuffer = useCallback(() => {
    tooltipInstance!.hide()
    // recenter the map on the selected buffer
    const bounds = getBufferedAreaBbox({ area, value: bufferValue, unit: bufferUnit }) as Bbox
    fitBounds(bounds)
    dispatchQueryParams({ reportBufferValue: bufferValue, reportBufferUnit: bufferUnit })
    cleanFeatureState('highlight')
    dispatch(resetReportData())
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Confirm area buffer`,
      label: `${bufferValue} ${bufferUnit}`,
    })
  }, [
    tooltipInstance,
    area,
    bufferValue,
    bufferUnit,
    fitBounds,
    dispatchQueryParams,
    cleanFeatureState,
    dispatch,
  ])

  return (
    <div className={styles.container}>
      {name ? (
        <Fragment>
          <h1 className={styles.title} data-test="report-title">
            {name}
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
                    handleBufferValueChange={handleBufferValueChange}
                    defaultValue={urlBufferValue || DEFAULT_BUFFER_VALUE}
                    activeOption={bufferUnit || NAUTICAL_MILES}
                    handleBufferUnitChange={handleBufferUnitChange}
                    handleConfirmBuffer={handleConfirmBuffer}
                  />
                }
                tooltipPlacement="bottom"
                tooltipProps={{
                  interactive: true,
                  trigger: 'click',
                  delay: 0,
                  className: styles.bufferContainer,
                  onShow: (instance) => setTooltipInstance(instance),
                }}
              >
                <p>{t('analysis.buffer', 'Buffer Area')}</p>
                {urlBufferValue && <span>{`(${urlBufferValue} ${urlBufferUnit})`}</span>}
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
