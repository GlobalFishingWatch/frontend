import React, { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import area from '@turf/area'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Choice, Tag } from '@globalfishingwatch/ui-components/dist'
import { selectDownloadArea } from 'features/download/download.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
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
import styles from './DownloadModal.module.css'

type DownloadModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function DownloadModal({ isOpen = false, onClose }: DownloadModalProps) {
  const { t } = useTranslation()

  const [format, setFormat] = useState(formatOptions[0].id)
  const [groupBy, setGroupBy] = useState(groupByOptions[0].id)

  const { start, end } = useTimerangeConnect()
  let filteredTemporalResolutionOptions = temporalResolutionOptions
  if (start && end) {
    const startDateTime = DateTime.fromISO(start)
    const endDateTime = DateTime.fromISO(end)
    const duration = endDateTime.diff(startDateTime, ['years', 'months'])
    filteredTemporalResolutionOptions = filteredTemporalResolutionOptions.map((option) => {
      if (option.id === TemporalResolution.Yearly && duration?.years < 1) option.disabled = true
      if (option.id === TemporalResolution.Monthly && duration?.months < 1) option.disabled = true
      return option
    })
  }
  const [temporalResolution, setTemporalResolution] = useState(
    filteredTemporalResolutionOptions[0].id
  )

  const downloadArea = useSelector(selectDownloadArea)
  const areaIsTooBigForHighRes =
    area(downloadArea?.feature.geometry as any) > MAX_AREA_FOR_HIGH_SPATIAL_RESOLUTION
  const filteredSpatialResolutionOptions = spatialResolutionOptions.map((option) => {
    if (option.id === SpatialResolution.High && areaIsTooBigForHighRes) option.disabled = true
    return option
  })
  const [spatialResolution, setSpatialResolution] = useState(filteredSpatialResolutionOptions[0].id)

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
            <Tag>{downloadArea?.feature.value || EMPTY_FIELD_PLACEHOLDER}</Tag>
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
      </div>
    </Modal>
  )
}

export default DownloadModal
