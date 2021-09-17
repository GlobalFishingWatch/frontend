import React, { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import area from '@turf/area'
import type { Placement } from 'tippy.js'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Button, Choice, Icon, Tag } from '@globalfishingwatch/ui-components/dist'
import { Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  CreateDownload,
  createDownloadThunk,
  DownloadGeometry,
  resetDownloadStatus,
  selectDownloadAreaName,
  selectDownloadGeometry,
  selectDownloadStatus,
} from 'features/download/download.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { selectUserData } from 'features/user/user.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.selectors'
import { DateRange } from 'features/analysis/analysis.slice'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from './DownloadModal.module.css'
import {
  Format,
  GroupBy,
  TemporalResolution,
  SpatialResolution,
  formatOptions,
  groupByOptions,
  temporalResolutionOptions,
  spatialResolutionOptions,
  MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION,
} from './download.config'

type DownloadModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function DownloadModal({ isOpen = false, onClose }: DownloadModalProps) {
  const { t } = useTranslation()
  const dataviews = useSelector(selectActiveActivityDataviews) || []
  const userData = useSelector(selectUserData)
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const downloadStatus = useSelector(selectDownloadStatus)

  const [format, setFormat] = useState(formatOptions[0].id as Format)
  const [groupBy, setGroupBy] = useState(groupByOptions[0].id as GroupBy)

  const { start, end, timerange } = useTimerangeConnect()
  let filteredTemporalResolutionOptions = temporalResolutionOptions
  if (start && end) {
    const startDateTime = DateTime.fromISO(start)
    const endDateTime = DateTime.fromISO(end)
    const duration = endDateTime.diff(startDateTime, ['years', 'months'])
    filteredTemporalResolutionOptions = filteredTemporalResolutionOptions.map((option) => {
      if (option.id === TemporalResolution.Yearly && duration?.years < 1) {
        return {
          ...option,
          disabled: true,
          tooltip: t('download.yearlyNotAvailable', 'Your time range is shorter than 1 year'),
          tooltipPlacement: 'top',
        }
      }
      if (option.id === TemporalResolution.Monthly && duration?.months < 1) {
        return {
          ...option,
          disabled: true,
          tooltip: t('download.monthlyNotAvailable', 'Your time range is shorter than 1 month'),
          tooltipPlacement: 'top',
        }
      }
      return option
    })
  }
  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id as TemporalResolution
  )

  const downloadAreaGeometry = useSelector(selectDownloadGeometry)
  const downloadAreaName = useSelector(selectDownloadAreaName)
  const areaIsTooBigForHighRes =
    area(downloadAreaGeometry as any) > MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION
  const filteredSpatialResolutionOptions = spatialResolutionOptions.map((option) => {
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
  const [spatialResolution, setSpatialResolution] = useState(
    filteredSpatialResolutionOptions[0].id as SpatialResolution
  )

  const onDownloadClick = async () => {
    const downloadDataviews = dataviews
      .map((dataview) => {
        const activityDatasets: Dataset[] = (dataview?.config?.datasets || []).map((id: string) =>
          dataview.datasets?.find((dataset) => dataset.id === id)
        )
        return {
          filters: dataview.config?.filters || {},
          datasets: activityDatasets.map((dataset: Dataset) => dataset.id),
        }
      })
      .filter((dataview) => dataview.datasets.length > 0)

    const createDownload: CreateDownload = {
      dateRange: timerange as DateRange,
      dataviews: downloadDataviews,
      geometry: downloadAreaGeometry as DownloadGeometry,
      format,
      temporalResolution,
      spatialResolution,
      groupBy,
    }
    await dispatch(createDownloadThunk(createDownload))
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
      dispatch(resetDownloadStatus(undefined))
    }, 5000)
  }

  return (
    <Modal
      title={t('download.title', 'Download - Activity')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
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
            options={formatOptions}
            size="small"
            activeOption={format}
            onOptionClick={(option) => setFormat(option.id as Format)}
          />
        </div>
        {format === Format.Csv && (
          <Fragment>
            <div>
              <label>{t('download.groupActivityBy', 'Group activity by')}</label>
              <Choice
                options={groupByOptions}
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
          </Fragment>
        )}
        <div>
          <label>{t('download.spatialResolution', 'Spatial Resolution')}</label>
          <Choice
            options={filteredSpatialResolutionOptions}
            size="small"
            activeOption={spatialResolution}
            onOptionClick={(option) => setSpatialResolution(option.id as SpatialResolution)}
          />
        </div>
        <Button
          className={styles.downloadBtn}
          onClick={onDownloadClick}
          loading={downloadStatus === AsyncReducerStatus.LoadingCreate}
        >
          {downloadStatus === AsyncReducerStatus.Finished ? (
            <Icon icon="tick" />
          ) : (
            t('download.cta', 'Download')
          )}
        </Button>
      </div>
    </Modal>
  )
}

export default DownloadModal
function checkExistPermissionInList(
  permissions: import('@globalfishingwatch/api-types/dist').UserPermission[] | undefined,
  permission: { type: string; value: string; action: string }
) {
  throw new Error('Function not implemented.')
}
