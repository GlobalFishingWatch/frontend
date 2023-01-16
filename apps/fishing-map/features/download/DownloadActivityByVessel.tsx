import { useMemo, useRef, useState, Fragment } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
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
import {
  selectActiveHeatmapDataviews,
  selectActiveHeatmapVesselDatasets,
} from 'features/dataviews/dataviews.selectors'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { selectUserData } from 'features/user/user.slice'
import {
  checkDatasetReportPermission,
  getDatasetsDownloadNotSupported,
} from 'features/datasets/datasets.utils'
import { getSourcesSelectedInDataview } from 'features/workspace/activity/activity.utils'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadActivityArea } from 'features/download/download.selectors'
import DownloadActivityProductsBanner from 'features/download/DownloadActivityProductsBanner'
import { AsyncReducerStatus } from 'utils/async-slice'
import DatasetLabel from 'features/datasets/DatasetLabel'
import SOURCE_SWITCH_CONTENT from 'features/welcome/SourceSwitch.content'
import { Locale } from 'types'
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
  const { disclaimer } =
    SOURCE_SWITCH_CONTENT[i18n.language as Locale] || SOURCE_SWITCH_CONTENT[Locale.en]
  const dispatch = useAppDispatch()
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveHeatmapDataviews)
  const vesselDatasets = useSelector(selectActiveHeatmapVesselDatasets)
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
  const isDownloadReportSupported = getDownloadReportSupported(start, end)

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

  const downloadArea = useSelector(selectDownloadActivityArea)
  const downloadAreaName = downloadArea?.data?.name
  const downloadAreaGeometry = downloadArea?.data?.geometry
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

    uaEvent({
      category: 'Data downloads',
      action: `Download ${format.toUpperCase()} file`,
      label: JSON.stringify({
        regionName: downloadAreaName || EMPTY_FIELD_PLACEHOLDER,
        temporalResolution,
        groupBy,
        sourceNames: dataviews.flatMap((dataview) =>
          getSourcesSelectedInDataview(dataview).map((source) => source.label)
        ),
      }),
    })

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
    <Fragment>
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
          <label>{t('download.groupVesselsBy', 'Group vessels by')}</label>
          <Choice
            options={filteredGroupByOptions}
            size="small"
            activeOption={groupBy}
            onOptionClick={(option) => setGroupBy(option.id as GroupBy)}
          />
        </div>
        <div>
          <label>{t('download.temporalResolution', 'Group time by')}</label>
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
          ) : (
            <p
              className={styles.disclaimerContainer}
              dangerouslySetInnerHTML={{ __html: disclaimer }}
            />
          )}
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
      <DownloadActivityProductsBanner format={format} />
    </Fragment>
  )
}

export default DownloadActivityByVessel
