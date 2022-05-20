import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
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
} from 'features/download/downloadTrack.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { DateRange } from 'features/download/downloadActivity.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import styles from './DownloadModal.module.css'
import { Format, FORMAT_OPTIONS } from './downloadTrack.config'

function DownloadTrackModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const downloadStatus = useSelector(selectDownloadTrackStatus)
  const [format, setFormat] = useState(FORMAT_OPTIONS[0].id as Format)
  const { timerange } = useTimerangeConnect()

  const downloadTrackId = useSelector(selectDownloadTrackId)
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
      await dispatch(downloadTrackThunk(downloadParams))
      onClose()
    } catch (e: any) {
      console.warn(e)
    }

    uaEvent({
      category: 'Download',
      action: `Track download`,
      label: downloadTrackName,
    })

    timeoutRef.current = setTimeout(() => {
      dispatch(resetDownloadTrackStatus())
    }, 1000)
  }

  const onClose = () => {
    dispatch(clearDownloadTrackVessel())
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={`${t('download.title', 'Download')} - ${t('download.track', 'Vessel Track')}`}
      isOpen={downloadTrackId !== ''}
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
            onOptionClick={(option) => setFormat(option.id as Format)}
          />
        </div>
        <div className={styles.footer}>
          <Button
            className={styles.downloadBtn}
            onClick={onDownloadClick}
            loading={downloadStatus === AsyncReducerStatus.Loading}
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
