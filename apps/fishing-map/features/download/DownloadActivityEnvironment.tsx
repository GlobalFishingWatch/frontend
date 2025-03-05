import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import area from '@turf/area'
import cx from 'classnames'
import parse from 'html-react-parser'

import type { TooltipPlacement } from '@globalfishingwatch/ui-components'
import { Button, Choice, Icon, Tag } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import type { AreaKeyId } from 'features/areas/areas.slice'
import {
  checkDatasetReportPermission,
  getActiveDatasetsInDataview,
} from 'features/datasets/datasets.utils'
import { selectActiveHeatmapDowloadDataviewsByTab } from 'features/dataviews/selectors/dataviews.selectors'
import {
  selectDownloadActivityArea,
  selectIsDownloadActivityAreaLoading,
} from 'features/download/download.selectors'
import type { DateRange, DownloadActivityParams } from 'features/download/downloadActivity.slice'
import {
  downloadActivityThunk,
  selectDownloadActivityAreaKey,
  selectIsDownloadActivityError,
  selectIsDownloadActivityFinished,
  selectIsDownloadActivityLoading,
  selectIsDownloadActivityTimeoutError,
} from 'features/download/downloadActivity.slice'
import DownloadActivityProductsBanner from 'features/download/DownloadActivityProductsBanner'
import UserGuideLink from 'features/help/UserGuideLink'
import TimelineDatesRange from 'features/map/controls/TimelineDatesRange'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectUserData } from 'features/user/selectors/user.selectors'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import {
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import { getDownloadReportSupported, getSupportedTemporalResolutions } from './download.utils'
import type { TemporalResolution } from './downloadActivity.config'
import {
  ENVIRONMENT_FORMAT_OPTIONS,
  GRIDDED_FORMAT_OPTIONS,
  HeatmapDownloadFormat,
  MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION,
  SPATIAL_RESOLUTION_OPTIONS,
  SpatialResolution,
} from './downloadActivity.config'
import ActivityDownloadError, { useActivityDownloadTimeoutRefresh } from './DownloadActivityError'

import styles from './DownloadModal.module.css'

function DownloadActivityGridded() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDowloadDataviewsByTab)
  const { start, end, timerange } = useTimerangeConnect()
  const isDownloadLoading = useSelector(selectIsDownloadActivityLoading)
  const isDownloadError = useSelector(selectIsDownloadActivityError)
  const isDownloadFinished = useSelector(selectIsDownloadActivityFinished)
  const [format, setFormat] = useState(GRIDDED_FORMAT_OPTIONS[0].id)

  const downloadArea = useSelector(selectDownloadActivityArea)
  const downloadAreaKey = useSelector(selectDownloadActivityAreaKey)
  const downloadAreaName = downloadAreaKey?.areaName
  const areaId = downloadAreaKey?.areaId as AreaKeyId
  const datasetId = downloadAreaKey?.datasetId as string
  const downloadAreaGeometry = downloadArea?.data?.geometry
  const isDownloadAreaLoading = useSelector(selectIsDownloadActivityAreaLoading)
  const isDownloadTimeoutError = useSelector(selectIsDownloadActivityTimeoutError)

  const bufferUnit = useSelector(selectUrlBufferUnitQuery)
  const bufferValue = useSelector(selectUrlBufferValueQuery)
  const bufferOperation = useSelector(selectUrlBufferOperationQuery)

  const areaIsTooBigForHighRes = useMemo(() => {
    return downloadAreaGeometry
      ? area(downloadAreaGeometry) > MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION
      : false
  }, [downloadAreaGeometry])

  const filteredSpatialResolutionOptions = SPATIAL_RESOLUTION_OPTIONS.map((option) => {
    if (option.id === SpatialResolution.High && areaIsTooBigForHighRes) {
      return {
        ...option,
        disabled: true,
        tooltip: t('download.highResNotAvailable', 'Your area is too big'),
        tooltipPlacement: 'top' as TooltipPlacement,
      }
    }
    return option
  })
  const [spatialResolution, setSpatialResolution] = useState(filteredSpatialResolutionOptions[0].id)

  const filteredTemporalResolutionOptions = useMemo(
    () => getSupportedTemporalResolutions(dataviews, { start, end }),
    [dataviews, start, end]
  )
  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id
  )

  const onDownloadClick = async () => {
    const downloadDataviews = dataviews
      .map((dataview) => {
        const datasets = getActiveDatasetsInDataview(dataview)?.flatMap((d) => d.id || []) || []
        const activityDatasets = datasets.filter((id: string) => {
          return id ? checkDatasetReportPermission(id, userData!.permissions) : false
        })
        return {
          filter: dataview.config?.filter || '',
          filters: dataview.config?.filters || {},
          ...(dataview.config?.['vessel-groups']?.length && {
            'vessel-groups': dataview.config?.['vessel-groups'],
          }),
          datasets: activityDatasets,
        }
      })
      .filter((dataview) => dataview.datasets.length > 0)

    if (format === HeatmapDownloadFormat.GeoTIFF) {
      trackEvent({
        category: TrackCategory.DataDownloads,
        action: `Download GeoTIFF file`,
        label: JSON.stringify({
          regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
          downloadType: 'environment',
          spatialResolution,
          temporalResolution,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
    } else if (format === HeatmapDownloadFormat.Csv) {
      trackEvent({
        category: TrackCategory.DataDownloads,
        action: `Download ${format} file`,
        label: JSON.stringify({
          regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
          downloadType: 'environment',
          spatialResolution,
          temporalResolution,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
    }

    const downloadParams: DownloadActivityParams = {
      areaId,
      datasetId,
      dateRange: timerange as DateRange,
      areaName: downloadAreaName as string,
      dataviews: downloadDataviews,
      format,
      spatialResolution,
      spatialAggregation: false,
      temporalResolution,
      bufferUnit,
      bufferValue,
      bufferOperation,
    }
    const action = await dispatch(downloadActivityThunk(downloadParams))

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Activity download`,
      label: getEventLabel([
        downloadParams.areaName,
        ...downloadDataviews
          .map(({ datasets, filters }) => [datasets.join(','), ...getActivityFilters(filters)])
          .flat(),
      ]),
    })
    return action.payload
  }
  useActivityDownloadTimeoutRefresh()

  const isDownloadReportSupported = getDownloadReportSupported(start, end)
  const parsedLabel =
    typeof downloadAreaName === 'string' ? parse(downloadAreaName) : downloadAreaName

  return (
    <Fragment>
      <div className={styles.container} data-test="download-activity-gridded">
        <div className={styles.info}>
          <div>
            <label>{t('download.area', 'Area')}</label>
            <Tag>{parsedLabel || EMPTY_FIELD_PLACEHOLDER}</Tag>
          </div>
          <div>
            <label>{t('download.timeRange', 'Time Range')}</label>
            <Tag>
              <TimelineDatesRange />
            </Tag>
          </div>
        </div>
        <div>
          <label>{t('download.format', 'Format')}</label>
          <Choice
            options={ENVIRONMENT_FORMAT_OPTIONS}
            size="small"
            activeOption={format}
            onSelect={(option) => setFormat(option.id as HeatmapDownloadFormat)}
            testId="report-format"
          />
        </div>
        {(format === HeatmapDownloadFormat.Csv || format === HeatmapDownloadFormat.Json) && (
          <div>
            <label>{t('download.temporalResolution', 'Group time by')}</label>
            <Choice
              options={filteredTemporalResolutionOptions}
              size="small"
              testId="group-time-by"
              activeOption={temporalResolution}
              onSelect={(option) => setTemporalResolution(option.id as TemporalResolution)}
            />
          </div>
        )}
        <div>
          <label>{t('download.spatialResolution', 'Spatial Resolution')}</label>
          <Choice
            options={filteredSpatialResolutionOptions}
            size="small"
            testId="group-spatial-by"
            activeOption={spatialResolution}
            onSelect={(option) => setSpatialResolution(option.id as SpatialResolution)}
          />
        </div>
        <UserGuideLink section="downloadActivity" />
        <div className={styles.footer}>
          {!isDownloadReportSupported && (
            <p className={cx(styles.footerLabel, styles.error)}>
              {t('download.timerangeTooLong', 'The maximum time range is 1 year')}
            </p>
          )}
          {isDownloadError && <ActivityDownloadError />}
          <Button
            testId="download-activity-gridded-button"
            onClick={onDownloadClick}
            className={styles.downloadBtn}
            loading={isDownloadAreaLoading || isDownloadLoading || isDownloadTimeoutError}
            disabled={!isDownloadReportSupported || isDownloadAreaLoading || isDownloadError}
          >
            {isDownloadFinished ? <Icon icon="tick" /> : t('download.title', 'Download')}
          </Button>
        </div>
      </div>
      <DownloadActivityProductsBanner format={format} />
    </Fragment>
  )
}

export default DownloadActivityGridded
