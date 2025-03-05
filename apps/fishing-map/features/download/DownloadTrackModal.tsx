import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { THINNING_LEVELS, ThinningLevels } from '@globalfishingwatch/api-client'
import { Button, Choice, Icon, Modal, Tag } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadTrackModalOpen } from 'features/download/download.selectors'
import type { DateRange } from 'features/download/downloadActivity.slice'
import type { DownloadTrackParams } from 'features/download/downloadTrack.slice'
import {
  clearDownloadTrackVessel,
  downloadTrackThunk,
  resetDownloadTrackStatus,
  selectDownloadTrackDataset,
  selectDownloadTrackIds,
  selectDownloadTrackName,
  selectDownloadTrackRateLimit,
  selectDownloadTrackStatus,
} from 'features/download/downloadTrack.slice'
import TimelineDatesRange from 'features/map/controls/TimelineDatesRange'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import type { Format } from './downloadTrack.config'
import { FORMAT_OPTIONS } from './downloadTrack.config'

import styles from './DownloadModal.module.css'

function DownloadTrackModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>(undefined)
  const downloadStatus = useSelector(selectDownloadTrackStatus)
  const rateLimit = useSelector(selectDownloadTrackRateLimit)
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].id as Format)
  const { timerange } = useTimerangeConnect()
  const gFWUser = useSelector(selectIsGFWUser)

  const downloadTrackIds = useSelector(selectDownloadTrackIds)
  const downloadModalOpen = useSelector(selectDownloadTrackModalOpen)
  const downloadTrackName = useSelector(selectDownloadTrackName)
  const downloadTrackDataset = useSelector(selectDownloadTrackDataset)

  const onDownloadClick = async () => {
    const downloadParams: DownloadTrackParams = {
      vesselIds: downloadTrackIds,
      vesselName: downloadTrackName,
      dateRange: timerange as DateRange,
      dataset: downloadTrackDataset,
      format,
      ...(gFWUser ? {} : { thinning: THINNING_LEVELS[ThinningLevels.Medium] }),
    }

    try {
      const action = await dispatch(downloadTrackThunk(downloadParams))
      if (downloadTrackThunk.fulfilled.match(action)) {
        onClose()
        timeoutRef.current = setTimeout(() => {
          dispatch(resetDownloadTrackStatus())
        }, 1000)
      }
    } catch (e: any) {
      console.warn(e)
    }

    trackEvent({
      category: TrackCategory.DataDownloads,
      action: `Track download`,
      label: downloadTrackName,
    })
  }

  const onClose = () => {
    dispatch(clearDownloadTrackVessel())
  }

  const isDownloadRatioExceeded = rateLimit?.remaining === 0

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        <Fragment>
          {t('download.title', 'Download')} - {t('download.track', 'Vessel Track')}
        </Fragment>
      }
      isOpen={downloadModalOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.container}>
        <div className={styles.info}>
          <div>
            <label>{t('common.vessel', 'Vessel')}</label>
            <Tag>{downloadTrackName || EMPTY_FIELD_PLACEHOLDER}</Tag>
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
            onSelect={(option) => setFormat(option.id as Format)}
          />
        </div>
        <div className={styles.footer}>
          <p className={cx({ [styles.error]: isDownloadRatioExceeded })}>
            {isDownloadRatioExceeded
              ? (t('download.trackLimitExceeded', {
                  defaultValue:
                    'You have already downloaded {{limit}} tracks today, please try again tomorrow',
                  limit: rateLimit?.limit,
                }) as string)
              : rateLimit?.remaining
                ? (t('download.trackRemaining', {
                    defaultValue: 'You can download {{count}} more tracks today',
                    count: rateLimit?.remaining as number,
                  }) as string)
                : null}
          </p>
          <Button
            className={styles.downloadBtn}
            onClick={onDownloadClick}
            loading={downloadStatus === AsyncReducerStatus.Loading}
            disabled={isDownloadRatioExceeded}
          >
            {downloadStatus === AsyncReducerStatus.Finished ? (
              <Icon icon="tick" />
            ) : (
              t('download.title', 'Download')
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DownloadTrackModal
