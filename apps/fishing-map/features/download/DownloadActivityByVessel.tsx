import { useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { Trans, useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useSelector } from 'react-redux'
import { Geometry } from 'geojson'
import { Icon, Button, Choice, ChoiceOption, Tag } from '@globalfishingwatch/ui-components'
import {
  DownloadActivityParams,
  downloadActivityThunk,
  resetDownloadActivityStatus,
  selectDownloadActivityLoading,
  selectDownloadActivityFinished,
  selectDownloadActivityError,
  DateRange,
} from 'features/download/downloadActivity.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveHeatmapDataviews } from 'features/dataviews/dataviews.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { selectUserData } from 'features/user/user.slice'
import {
  checkDatasetReportPermission,
  getDatasetsDownloadNotSupported,
} from 'features/datasets/datasets.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadActivityArea } from 'features/download/download.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { getUTCDateTime } from 'utils/dates'
import styles from './DownloadModal.module.css'
import {
  Format,
  GroupBy,
  TemporalResolution,
  GROUP_BY_OPTIONS,
  VESSEL_FORMAT_OPTIONS,
} from './downloadActivity.config'
import { getDownloadReportSupported } from './download.utils'

const fallbackDataviews = []
function DownloadActivityByVessel() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDataviews) || fallbackDataviews
  const timeoutRef = useRef<NodeJS.Timeout>()
  const { start, end, timerange } = useTimerangeConnect()
  const datasetsDownloadNotSupported = getDatasetsDownloadNotSupported(
    dataviews,
    userData?.permissions || []
  )
  const downloadLoading = useSelector(selectDownloadActivityLoading)
  const downloadError = useSelector(selectDownloadActivityError)
  const downloadFinished = useSelector(selectDownloadActivityFinished)
  const [format, setFormat] = useState(VESSEL_FORMAT_OPTIONS[0].id as Format)
  const [groupBy, setGroupBy] = useState(GROUP_BY_OPTIONS[0].id as GroupBy)

  const temporalResolutionOptions: ChoiceOption[] = useMemo(
    () => [
      {
        id: TemporalResolution.Full,
        title: t('download.fullTimeRange', 'Full time range'),
      },
      {
        id: TemporalResolution.Daily,
        title: t('download.daily', 'Daily'),
      },
      {
        id: TemporalResolution.Monthly,
        title: t('download.monthly', 'Monthly'),
      },
      {
        id: TemporalResolution.Yearly,
        title: t('download.yearly', 'Yearly'),
      },
    ],
    [t]
  )

  const duration = useMemo(() => {
    if (start && end) {
      const startDateTime = getUTCDateTime(start)
      const endDateTime = getUTCDateTime(end)
      return {
        years: endDateTime.diff(startDateTime, ['years']).years,
        months: endDateTime.diff(startDateTime, ['months']).months,
        days: endDateTime.diff(startDateTime, ['days']).days,
      }
    }
  }, [end, start])
  const isDownloadReportSupported = getDownloadReportSupported(start, end)

  const filteredTemporalResolutionOptions: ChoiceOption[] = useMemo(
    () =>
      temporalResolutionOptions.map((option) => {
        if (option.id === TemporalResolution.Yearly && duration?.years < 1) {
          return {
            ...option,
            disabled: true,
            tooltip: t('download.yearlyNotAvailable', 'Your time range is shorter than 1 year'),
            tooltipPlacement: 'top',
          }
        }
        if (
          option.id === TemporalResolution.Monthly &&
          duration?.years < 1 &&
          duration?.months < 1
        ) {
          return {
            ...option,
            disabled: true,
            tooltip: t('download.monthlyNotAvailable', 'Your time range is shorter than 1 month'),
            tooltipPlacement: 'top',
          }
        }
        return option
      }),
    [duration, t, temporalResolutionOptions]
  )

  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id as TemporalResolution
  )

  const downloadArea = useSelector(selectDownloadActivityArea)
  const downloadAreaName = downloadArea?.name
  const downloadAreaGeometry = downloadArea?.geometry
  const downloadAreaLoading = downloadArea?.status === AsyncReducerStatus.Loading

  const onDownloadClick = async () => {
    const downloadDataviews = dataviews
      .map((dataview) => {
        const activityDatasets: string[] = (dataview?.config?.datasets || []).filter(
          (id: string) => {
            return id ? checkDatasetReportPermission(id, userData?.permissions) : false
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

    if (format === Format.GeoTIFF) {
      uaEvent({
        category: 'Data downloads',
        action: `Download GeoTIFF file`,
        label: JSON.stringify({
          regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
    }
    if (format === Format.Csv) {
      uaEvent({
        category: 'Data downloads',
        action: `Download CSV file`,
        label: JSON.stringify({
          regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
          temporalResolution,
          groupBy,
          sourceNames: dataviews.flatMap((dataview) =>
            getSourcesSelectedInDataview(dataview).map((source) => source.label)
          ),
        }),
      })
    }

    const downloadParams: DownloadActivityParams = {
      dateRange: timerange as DateRange,
      geometry: downloadAreaGeometry as Geometry,
      areaName: downloadAreaName,
      dataviews: downloadDataviews,
      format,
      temporalResolution,
      spatialAggregation: true,
      groupBy,
    }
    await dispatch(downloadActivityThunk(downloadParams))

    uaEvent({
      category: 'Download',
      action: `Activity download`,
      label: getEventLabel([
        downloadAreaName,
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
    <div className={styles.container}>
      <div className={styles.info}>
        <div>
          <label>{t('download.area', 'Area')}</label>
          <Tag>{downloadAreaName || EMPTY_FIELD_PLACEHOLDER}</Tag>
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
          activeOption={format}
          onOptionClick={(option) => setFormat(option.id as Format)}
        />
      </div>
      <div>
        <label>{t('download.groupActivityBy', 'Group activity by vessel property')}</label>
        <Choice
          options={GROUP_BY_OPTIONS}
          size="small"
          activeOption={groupBy}
          onOptionClick={(option) => setGroupBy(option.id as GroupBy)}
        />
      </div>
      <div>
        <label>{t('download.temporalResolution', 'Temporal Resolution')}</label>
        <Choice
          options={filteredTemporalResolutionOptions}
          size="small"
          activeOption={temporalResolution}
          onOptionClick={(option) => setTemporalResolution(option.id as TemporalResolution)}
        />
      </div>
      <div className={styles.footer}>
        {datasetsDownloadNotSupported.length > 0 && (
          <p className={styles.footerLabel}>
            {t(
              'download.datasetsNotAllowed',
              "You don't have permissions to download the following datasets:"
            )}{' '}
            {datasetsDownloadNotSupported.map((dataset) => (
              <DatasetLabel key={dataset} dataset={{ id: dataset }} />
            ))}
          </p>
        )}

        {!isDownloadReportSupported ? (
          <p className={cx(styles.footerLabel, styles.error)}>
            {t('download.timerangeTooLong', 'The maximum time range is 1 year')}
          </p>
        ) : downloadError ? (
          <p className={cx(styles.footerLabel, styles.error)}>
            {`${t('analysis.errorMessage', 'Something went wrong')} 🙈`}
          </p>
        ) : format === Format.Json ? (
          <p className={styles.footerLabel}>
            <Trans i18nKey="analysis.apiDisclaimer">
              Are you looking to use GFW data in your application, find our API documentation
              <a
                href="https://globalfishingwatch.org/our-apis/documentation#create-a-report-of-a-specified-region"
                className={styles.link}
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                here
              </a>
            </Trans>
          </p>
        ) : null}
        <Button
          onClick={onDownloadClick}
          loading={downloadLoading || downloadAreaLoading}
          className={styles.downloadBtn}
          disabled={!isDownloadReportSupported || downloadAreaLoading}
        >
          {downloadFinished ? <Icon icon="tick" /> : t('download.title', 'Download')}
        </Button>
      </div>
    </div>
  )
}

export default DownloadActivityByVessel
