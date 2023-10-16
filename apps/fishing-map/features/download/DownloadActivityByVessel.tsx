import { useMemo, useRef, useState, Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon, Button, Choice, ChoiceOption, Tag } from '@globalfishingwatch/ui-components'
import {
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import {
  DownloadActivityParams,
  downloadActivityThunk,
  resetDownloadActivityStatus,
  selectDownloadActivityLoading,
  selectDownloadActivityFinished,
  selectDownloadActivityError,
  DateRange,
  selectDownloadActivityAreaKey,
} from 'features/download/downloadActivity.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import {
  selectActiveHeatmapDataviews,
  selectActiveHeatmapVesselDatasets,
} from 'features/dataviews/dataviews.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { selectUserData } from 'features/user/user.slice'
import {
  checkDatasetReportPermission,
  getDatasetsReportNotSupported,
} from 'features/datasets/datasets.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import DownloadActivityProductsBanner from 'features/download/DownloadActivityProductsBanner'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getSourceSwitchContentByLng } from 'features/welcome/SourceSwitch.content'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserGuideLink from 'features/help/UserGuideLink'
import { AreaKeyId } from 'features/areas/areas.slice'
import styles from './DownloadModal.module.css'
import {
  Format,
  GroupBy,
  TemporalResolution,
  VESSEL_GROUP_BY_OPTIONS,
  VESSEL_FORMAT_OPTIONS,
} from './downloadActivity.config'
import {
  getDownloadReportSupported,
  getSupportedGroupByOptions,
  getSupportedTemporalResolutions,
} from './download.utils'

function DownloadActivityByVessel() {
  const { t, i18n } = useTranslation()
  const { disclaimer } = getSourceSwitchContentByLng(i18n.language)
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const vesselDatasets = useSelector(selectActiveHeatmapVesselDatasets)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { start, end, timerange } = useTimerangeConnect()
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const downloadLoading = useSelector(selectDownloadActivityLoading)
  const downloadError = useSelector(selectDownloadActivityError)
  const downloadFinished = useSelector(selectDownloadActivityFinished)
  const [format, setFormat] = useState(VESSEL_FORMAT_OPTIONS[0].id as Format)
  const isDownloadReportSupported = getDownloadReportSupported(start, end)
  const downloadAreaKey = useSelector(selectDownloadActivityAreaKey)

  const bufferUnit = useSelector(selectUrlBufferUnitQuery)
  const bufferValue = useSelector(selectUrlBufferValueQuery)
  const bufferOperation = useSelector(selectUrlBufferOperationQuery)

  const filteredGroupByOptions: ChoiceOption[] = useMemo(
    () => getSupportedGroupByOptions(VESSEL_GROUP_BY_OPTIONS, vesselDatasets),
    [vesselDatasets]
  )
  const [groupBy, setGroupBy] = useState(filteredGroupByOptions[0]?.id as GroupBy)

  const filteredTemporalResolutionOptions: ChoiceOption[] = useMemo(
    () => getSupportedTemporalResolutions(start, end),
    [start, end]
  )
  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id as TemporalResolution
  )

  const onDownloadClick = async () => {
    const downloadDataviews = dataviews
      .map((dataview) => {
        const activityDatasets: string[] = (dataview?.config?.datasets || []).filter(
          (id: string) => {
            return id ? checkDatasetReportPermission(id, userData!.permissions) : false
          }
        )
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

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Download ${format.toUpperCase()} file`,
      label: JSON.stringify({
        regionName: downloadAreaKey?.areaName || EMPTY_FIELD_PLACEHOLDER,
        temporalResolution,
        groupBy,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })

    const downloadParams: DownloadActivityParams = {
      areaId: downloadAreaKey?.areaId as AreaKeyId,
      datasetId: downloadAreaKey?.datasetId as string,
      dateRange: timerange as DateRange,
      areaName: downloadAreaKey?.areaName as string,
      dataviews: downloadDataviews,
      format,
      temporalResolution,
      spatialAggregation: true,
      groupBy,
      bufferUnit,
      bufferValue,
      bufferOperation,
    }
    await dispatch(downloadActivityThunk(downloadParams))

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Activity download`,
      label: getEventLabel([
        downloadAreaKey?.areaName || EMPTY_FIELD_PLACEHOLDER,
        ...downloadDataviews
          .map(({ datasets, filters }) => [datasets.join(','), ...getActivityFilters(filters)])
          .flat(),
      ]),
    })

    timeoutRef.current = setTimeout(() => {
      dispatch(resetDownloadActivityStatus())
    }, 1500)
  }
  return (
    <Fragment>
      <div className={styles.container} data-test="download-activity-byvessel">
        <div className={styles.info}>
          <div>
            <label>{t('download.area', 'Area')}</label>
            <Tag testId="area-name">{downloadAreaKey?.areaName || EMPTY_FIELD_PLACEHOLDER}</Tag>
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
            options={VESSEL_FORMAT_OPTIONS}
            size="small"
            testId="report-format"
            activeOption={format}
            onSelect={(option) => setFormat(option.id as Format)}
          />
        </div>
        <div>
          <label>{t('download.groupVesselsBy', 'Group vessels by')}</label>
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
        <UserGuideLink section="downloadActivity" />
        <div className={styles.footer}>
          {datasetsDownloadNotSupported.length > 0 && (
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
          )}

          <Button
            testId="download-activity-vessel-button"
            onClick={onDownloadClick}
            loading={downloadLoading}
            className={styles.downloadBtn}
            disabled={!isDownloadReportSupported}
          >
            {downloadFinished ? <Icon icon="tick" /> : t('download.title', 'Download')}
          </Button>
        </div>
        {!isDownloadReportSupported ? (
          <p className={cx(styles.footerLabel, styles.error)}>
            {t('download.timerangeTooLong', 'The maximum time range is 1 year')}
          </p>
        ) : downloadError ? (
          <p className={cx(styles.footerLabel, styles.error)}>
            {`${t('analysis.errorMessage', 'Something went wrong')} 🙈`}
          </p>
        ) : (
          <p
            className={styles.disclaimerContainer}
            dangerouslySetInnerHTML={{ __html: disclaimer }}
          />
        )}
      </div>
      <DownloadActivityProductsBanner format={format} />
    </Fragment>
  )
}

export default DownloadActivityByVessel
