import { useMemo, useState, Fragment } from 'react'
import parse from 'html-react-parser'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import area from '@turf/area'
import type { Placement } from 'tippy.js'
import { Icon, Button, Choice, Tag, ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import {
  DownloadActivityParams,
  downloadActivityThunk,
  DateRange,
  selectIsDownloadActivityLoading,
  selectIsDownloadActivityFinished,
  selectIsDownloadActivityError,
  selectDownloadActivityAreaKey,
  selectIsDownloadAreaTooBig,
} from 'features/download/downloadActivity.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveHeatmapVesselDatasets,
  selectActiveHeatmapDowloadDataviewsByTab,
} from 'features/dataviews/selectors/dataviews.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { selectUserData } from 'features/user/selectors/user.selectors'
import {
  checkDatasetReportPermission,
  getActiveDatasetsInDataview,
  getDatasetsReportNotSupported,
} from 'features/datasets/datasets.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadActivityArea } from 'features/download/download.selectors'
import DownloadActivityProductsBanner from 'features/download/DownloadActivityProductsBanner'
import { AsyncReducerStatus } from 'utils/async-slice'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserGuideLink from 'features/help/UserGuideLink'
import { AreaKeyId } from 'features/areas/areas.slice'
import styles from './DownloadModal.module.css'
import {
  HeatmapDownloadFormat,
  SpatialResolution,
  MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION,
  SPATIAL_RESOLUTION_OPTIONS,
  GRIDDED_FORMAT_OPTIONS,
  TemporalResolution,
  GroupBy,
  getGriddedGroupOptions,
} from './downloadActivity.config'
import {
  getDownloadReportSupported,
  getSupportedGroupByOptions,
  getSupportedTemporalResolutions,
} from './download.utils'

function DownloadActivityGridded() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDowloadDataviewsByTab)
  const vesselDatasets = useSelector(selectActiveHeatmapVesselDatasets)
  const { start, end, timerange } = useTimerangeConnect()
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const isDownloadLoading = useSelector(selectIsDownloadActivityLoading)
  const isDownloadAreaTooBig = useSelector(selectIsDownloadAreaTooBig)
  const isDownloadError = useSelector(selectIsDownloadActivityError)
  const isDownloadFinished = useSelector(selectIsDownloadActivityFinished)
  const [format, setFormat] = useState(GRIDDED_FORMAT_OPTIONS[0].id)

  const downloadArea = useSelector(selectDownloadActivityArea)
  const downloadAreaKey = useSelector(selectDownloadActivityAreaKey)
  const downloadAreaName = downloadAreaKey?.areaName
  const areaId = downloadAreaKey?.areaId as AreaKeyId
  const datasetId = downloadAreaKey?.datasetId as string
  const downloadAreaGeometry = downloadArea?.data?.geometry
  const downloadAreaLoading = downloadArea?.status === AsyncReducerStatus.Loading

  const bufferUnit = useSelector(selectUrlBufferUnitQuery)
  const bufferValue = useSelector(selectUrlBufferValueQuery)
  const bufferOperation = useSelector(selectUrlBufferOperationQuery)

  const areaIsTooBigForHighRes = useMemo(() => {
    return downloadAreaGeometry
      ? area(downloadAreaGeometry) > MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION
      : false
  }, [downloadAreaGeometry])

  const filteredGroupByOptions: ChoiceOption<GroupBy>[] = useMemo(
    () => getSupportedGroupByOptions(getGriddedGroupOptions(), vesselDatasets),
    [vesselDatasets]
  )
  const [groupBy, setGroupBy] = useState(filteredGroupByOptions[0].id)

  const filteredSpatialResolutionOptions = SPATIAL_RESOLUTION_OPTIONS.map((option) => {
    if (option.id === SpatialResolution.High && areaIsTooBigForHighRes) {
      return {
        ...option,
        disabled: true,
        tooltip: t('download.highResNotAvailable', 'Your area is too big'),
        tooltipPlacement: 'top' as Placement,
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
          filter: dataview.config?.filter || [],
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
          spatialResolution,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
    } else if (format === HeatmapDownloadFormat.Csv || format === HeatmapDownloadFormat.Json) {
      trackEvent({
        category: TrackCategory.DataDownloads,
        action: `Download ${format} file`,
        label: JSON.stringify({
          regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
          spatialResolution,
          groupBy,
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
      ...(groupBy !== GroupBy.None && { groupBy }),
      spatialResolution,
      spatialAggregation: false,
      temporalResolution,
      bufferUnit,
      bufferValue,
      bufferOperation,
    }
    await dispatch(downloadActivityThunk(downloadParams))

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Activity download`,
      label: getEventLabel([
        downloadAreaName,
        ...downloadDataviews
          .map(({ datasets, filters }) => [datasets.join(','), ...getActivityFilters(filters)])
          .flat(),
      ]),
    })
  }

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
            options={GRIDDED_FORMAT_OPTIONS}
            size="small"
            activeOption={format}
            onSelect={(option) => setFormat(option.id as HeatmapDownloadFormat)}
            testId="report-format"
          />
        </div>
        {(format === HeatmapDownloadFormat.Csv || format === HeatmapDownloadFormat.Json) && (
          <Fragment>
            <div>
              <label>{t('download.groupActivityBy', 'Group activity by vessel property')}</label>
              <Choice
                options={filteredGroupByOptions}
                size="small"
                testId="group-vessels-by"
                activeOption={groupBy}
                onSelect={(option) => setGroupBy(option.id as GroupBy)}
              />
            </div>
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
          </Fragment>
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
          {!isDownloadReportSupported ? (
            <p className={cx(styles.footerLabel, styles.error)}>
              {t('download.timerangeTooLong', 'The maximum time range is 1 year')}
            </p>
          ) : datasetsDownloadNotSupported.length > 0 ? (
            <p className={styles.footerLabel}>
              {t(
                'download.datasetsNotAllowed',
                "You don't have permissions to download the following datasets:"
              )}{' '}
              {datasetsDownloadNotSupported.map((dataset, index) => (
                <Fragment>
                  <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                  {index < datasetsDownloadNotSupported.length - 1 && ', '}
                </Fragment>
              ))}
            </p>
          ) : null}
          {isDownloadError && (
            <p className={cx(styles.footerLabel, styles.error)}>
              {isDownloadAreaTooBig
                ? `${t(
                    'analysis.errorTooComplex',
                    'The geometry of the area is too complex to perform a report, try to simplify and upload again.'
                  )}`
                : `${t('analysis.errorMessage', 'Something went wrong')} 🙈`}
            </p>
          )}
          <Button
            testId="download-activity-gridded-button"
            onClick={onDownloadClick}
            loading={isDownloadLoading || downloadAreaLoading}
            className={styles.downloadBtn}
            disabled={!isDownloadReportSupported || downloadAreaLoading || isDownloadError}
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
