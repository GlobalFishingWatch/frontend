import { Fragment, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, Choice, Icon, Tag, Modal } from '@globalfishingwatch/ui-components'
import {
  DownloadTrackParams,
  selectDownloadTrackStatus,
  selectDownloadTrackId,
  selectDownloadTrackName,
  downloadTrackThunk,
  resetDownloadTrackStatus,
  selectDownloadTrackDataset,
  clearDownloadTrackVessel,
  selectDownloadTrackError,
  selectDownloadTrackRateLimit,
} from 'features/download/downloadTrack.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { DateRange } from 'features/download/downloadActivity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import GFWOnly from 'features/user/GFWOnly'
import { selectDownloadTrackModalOpen } from 'features/download/download.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import styles from './DownloadModal.module.css'
import { Format, FORMAT_OPTIONS } from './downloadTrack.config'

function DownloadTrackModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const downloadStatus = useSelector(selectDownloadTrackStatus)
  const downloadError = useSelector(selectDownloadTrackError)
  const rateLimit = useSelector(selectDownloadTrackRateLimit)
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].id as Format)
  const { timerange } = useTimerangeConnect()

  const downloadTrackId = useSelector(selectDownloadTrackId)
  const downloadModalOpen = useSelector(selectDownloadTrackModalOpen)
  const downloadTrackName = useSelector(selectDownloadTrackName)
  const downloadTrackDataset = useSelector(selectDownloadTrackDataset)

  const onDownloadClick = async () => {
    const downloadParams: DownloadTrackParams = {
      vesselId: downloadTrackId,
      vesselName: downloadTrackName,
      dateRange: timerange as DateRange,
      datasets: downloadTrackDataset,
      format,
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

  let IconText: string | React.ReactNode = t('download.title', 'Download')
  const hasDownloadError =
    downloadError !== null && (downloadError.status === 429 || rateLimit?.remaining === 0)
  if (hasDownloadError) {
    IconText = t('download.trackLimitExceeded', {
      defaultValue: 'You have exceeded the limit of tracks you can download per day ({{limit}})',
      limit: rateLimit?.limit,
    }) as string
  } else if (downloadStatus === AsyncReducerStatus.Finished) {
    IconText = <Icon icon="tick" />
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={
        <Fragment>
          {t('download.title', 'Download')} - {t('download.track', 'Vessel Track')}
          <GFWOnly />
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
          <Button
            className={styles.downloadBtn}
            onClick={onDownloadClick}
            loading={downloadStatus === AsyncReducerStatus.Loading}
            disabled={hasDownloadError}
            tooltip={
              hasDownloadError && rateLimit.retryAfter
                ? t('download.quotaReset', {
                    defaultValue: 'The quota will be reset on {{reset}}',
                    reset: formatI18nDate(rateLimit.retryAfter),
                  })
                : ''
            }
          >
            {IconText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DownloadTrackModal
