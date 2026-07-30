import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { THINNING_LEVELS, ThinningLevels } from '@globalfishingwatch/api-client'
import { Button, Choice, Icon, Modal, Tag } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/map/config'
import type { DateRange } from 'features/_map/download/downloadActivity.slice'
import type { DownloadTrackParams } from 'features/_map/download/downloadTrack.slice'
import {
  clearDownloadTrackVessel,
  downloadTrackThunk,
  resetDownloadTrackStatus,
  selectDownloadTrackDataset,
  selectDownloadTrackIds,
  selectDownloadTrackName,
  selectDownloadTrackRateLimit,
  selectDownloadTrackStatus,
} from 'features/_map/download/downloadTrack.slice'
import TimelineDatesRange from 'features/_map/map/controls/TimelineDatesRange'
import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import { selectIsGFWUser } from 'features/_user/selectors/user.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadTrackModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { getModalParent } from 'features/modals/modals.utils'
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
    dispatch(setModalOpen({ id: 'downloadTrack', open: false }))
  }

  const isDownloadRatioExceeded = rateLimit?.remaining === 0

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        <Fragment>
          {t((t) => t.download.title)} - {t((t) => t.download.track)}
        </Fragment>
      }
      isOpen={downloadModalOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
      parentSelector={getModalParent}
    >
      <div className={styles.container}>
        <div className={styles.info}>
          <div>
            <label>{t((t) => t.common.vessel)}</label>
            <Tag>{downloadTrackName || EMPTY_FIELD_PLACEHOLDER}</Tag>
          </div>
          <div>
            <label>{t((t) => t.download.timeRange)}</label>
            <Tag>
              <TimelineDatesRange />
            </Tag>
          </div>
        </div>
        <div>
          <label>{t((t) => t.download.format)}</label>
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
              ? (t((t) => t.download.trackLimitExceeded, {
                  limit: String(rateLimit?.limit ?? ''),
                }) as string)
              : rateLimit?.remaining
                ? (t((t) => t.download.trackRemaining, {
                    count: rateLimit?.remaining as number,
                  }) as string)
                : null}
          </p>
          <Button
            className={styles.downloadBtn}
            onClick={onDownloadClick}
            loading={downloadStatus === AsyncReducerStatus.Loading}
            disabled={isDownloadRatioExceeded || downloadStatus === AsyncReducerStatus.Loading}
          >
            {downloadStatus === AsyncReducerStatus.Finished ? (
              <Icon icon="tick" />
            ) : (
              t((t) => t.download.title)
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DownloadTrackModal
