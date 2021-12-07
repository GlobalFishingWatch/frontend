import React, { Fragment, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import area from '@turf/area'
import type { Placement } from 'tippy.js'
import { Geometry, MultiPolygon, Polygon } from 'geojson'
import { Icon, Modal, Button, Choice, ChoiceOption, Tag } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import {
  clearDownloadActivityGeometry,
  DownloadActivityParams,
  downloadActivityThunk,
  resetDownloadActivityStatus,
  selectDownloadActivityLoading,
  selectDownloadActivityFinished,
  selectDownloadActivityAreaName,
  selectDownloadActivityGeometry,
} from 'features/download/downloadActivity.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectActiveActivityDataviews } from 'features/dataviews/dataviews.selectors'
import { DateRange } from 'features/analysis/analysis.slice'
import { getActivityFilters, getEventLabel } from 'utils/analytics'
import { ROOT_DOM_ELEMENT } from 'data/config'
import styles from './DownloadModal.module.css'
import {
  Format,
  GroupBy,
  TemporalResolution,
  SpatialResolution,
  MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION,
  SPATIAL_RESOLUTION_OPTIONS,
  FORMAT_OPTIONS,
  MAX_YEARS_TO_ALLOW_DOWNLOAD,
} from './downloadActivity.config'

function DownloadActivityModal() {
  const { t } = useTranslation()
  const dataviews = useSelector(selectActiveActivityDataviews) || []
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const downloadLoading = useSelector(selectDownloadActivityLoading)
  const downloadFinished = useSelector(selectDownloadActivityFinished)
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].id as Format)
  const { start, end, timerange } = useTimerangeConnect()

  const groupByOptions: ChoiceOption[] = useMemo(
    () => [
      {
        id: GroupBy.Vessel,
        title: t('common.vessel', 'Vessel'),
      },
      {
        id: GroupBy.Flag,
        title: t('vessel.flag', 'Flag'),
      },
      {
        id: GroupBy.GearType,
        title: t('vessel.geartype', 'Gear Type'),
      },
      {
        id: GroupBy.FlagAndGearType,
        title: `${t('vessel.flag', 'Flag')} + ${t('vessel.geartype', 'Gear Type')}`,
      },
    ],
    [t]
  )
  const [groupBy, setGroupBy] = useState(groupByOptions[0].id as GroupBy)

  const temporalResolutionOptions: ChoiceOption[] = useMemo(
    () => [
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
      const startDateTime = DateTime.fromISO(start)
      const endDateTime = DateTime.fromISO(end)
      return endDateTime.diff(startDateTime, ['years', 'months'])
    }
  }, [end, start])

  const filteredTemporalResolutionOptions: ChoiceOption[] = useMemo(
    () =>
      temporalResolutionOptions.map((option) => {
        if (option.id === TemporalResolution.Yearly && duration && duration.years < 1) {
          return {
            ...option,
            disabled: true,
            tooltip: t('download.yearlyNotAvailable', 'Your time range is shorter than 1 year'),
            tooltipPlacement: 'top',
          }
        }
        if (option.id === TemporalResolution.Monthly && duration && duration.months < 1) {
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

  const downloadAreaGeometry = useSelector(selectDownloadActivityGeometry)
  const downloadAreaName = useSelector(selectDownloadActivityAreaName)
  const areaIsTooBigForHighRes = useMemo(() => {
    return downloadAreaGeometry
      ? area(downloadAreaGeometry as Polygon | MultiPolygon) > MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION
      : false
  }, [downloadAreaGeometry])
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

    const downloadPromises = downloadDataviews.map((dataview) => {
      const downloadParams: DownloadActivityParams = {
        dateRange: timerange as DateRange,
        geometry: downloadAreaGeometry as Geometry,
        areaName: downloadAreaName,
        dataview,
        format,
        temporalResolution,
        spatialResolution,
        groupBy,
      }

      return dispatch(downloadActivityThunk(downloadParams))
    })

    await Promise.allSettled(downloadPromises)

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

  const onClose = () => {
    dispatch(clearDownloadActivityGeometry())
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={`${t('download.title', 'Download')} - ${t('download.activity', 'Activity')}`}
      isOpen={downloadAreaGeometry !== undefined}
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
            options={FORMAT_OPTIONS}
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
          loading={downloadLoading}
          disabled={!duration || duration.years > MAX_YEARS_TO_ALLOW_DOWNLOAD}
          tooltip={
            duration && duration.years > MAX_YEARS_TO_ALLOW_DOWNLOAD
              ? t('download.timerangeTooLong', 'The maximum time range is {{count}} years', {
                  count: MAX_YEARS_TO_ALLOW_DOWNLOAD,
                })
              : ''
          }
        >
          {downloadFinished ? <Icon icon="tick" /> : t('download.title', 'Download')}
        </Button>
      </div>
    </Modal>
  )
}

export default DownloadActivityModal
