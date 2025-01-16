import { Fragment, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type { ButtonType} from '@globalfishingwatch/ui-components';
import { IconButton, Modal, Spinner } from '@globalfishingwatch/ui-components'

import useDownloadActivity from './download-activity.hook'

import styles from './download-activity.module.css'

export interface DownloadActivityProps {
  filtersApplied: boolean
  onDownloadAllActivityCsv?: () => void
  onDownloadFilteredActivityCsv?: () => void
  onReadmeClick?: () => void
  type?: ButtonType
}

export function DownloadActivity(props: DownloadActivityProps) {
  const { t } = useTranslation()
  const { filtersApplied, onDownloadAllActivityCsv, onDownloadFilteredActivityCsv, onReadmeClick } =
    props
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)
  const { downloadAllEvents, downloadFilteredEvents, downloadingStatus, hasEvents, readmeUrl } =
    useDownloadActivity()

  const handleCloseDownloadPopup = useCallback(() => {
    setShowDownloadPopup(false)
  }, [])

  const handleDownloadAllActivityCsv = useCallback(() => {
    downloadAllEvents()
    if (onDownloadAllActivityCsv !== undefined) {
      onDownloadAllActivityCsv()
    }
    handleCloseDownloadPopup()
  }, [downloadAllEvents, handleCloseDownloadPopup, onDownloadAllActivityCsv])

  const handleDownloadFilteredActivityCsv = useCallback(() => {
    downloadFilteredEvents()
    if (onDownloadFilteredActivityCsv !== undefined) {
      onDownloadFilteredActivityCsv()
    }
    handleCloseDownloadPopup()
  }, [downloadFilteredEvents, handleCloseDownloadPopup, onDownloadFilteredActivityCsv])

  const handleReadmeClick = useCallback(() => {
    if (onReadmeClick !== undefined) {
      onReadmeClick()
    }
    handleCloseDownloadPopup()
  }, [handleCloseDownloadPopup, onReadmeClick])

  return (
    <Fragment>
      {!downloadingStatus && (
        <Fragment>
          <IconButton
            type={props?.type === 'default' ? 'map-tool' : 'solid'}
            icon={showDownloadPopup ? 'close' : 'download'}
            size="medium"
            onClick={() => setShowDownloadPopup(!showDownloadPopup)}
          />

          {showDownloadPopup && (
            <Modal
              appSelector="__next"
              className={styles.modalContentWrapper}
              closeButtonClassName={styles.modalCloseButton}
              contentClassName={styles.modalContainer}
              header={false}
              isOpen={showDownloadPopup}
              onClose={handleCloseDownloadPopup}
              overlayClassName={styles.modalOverlay}
              portalClassName={styles.modalPortal}
              shouldCloseOnEsc={true}
            >
              <ul className={styles.items}>
                {hasEvents && (
                  <li className={styles.itemContainer}>
                    <button onClick={handleDownloadAllActivityCsv}>
                      {t('events.downloadAllActivity', 'Download entire vessel activity')}
                    </button>
                    <IconButton
                      className={styles.icon}
                      icon="download"
                      onClick={handleDownloadAllActivityCsv}
                      size="small"
                      tooltip={t('common.download', 'Download')}
                      tooltipPlacement="left"
                      type="default"
                    />
                  </li>
                )}
                {hasEvents && filtersApplied && (
                  <li className={cx(styles.itemContainer)}>
                    <button onClick={handleDownloadFilteredActivityCsv}>
                      {t(
                        'events.downloadCurrentActivityFiltered',
                        'Download current vessel activity filtered'
                      )}
                    </button>
                    <IconButton
                      className={styles.icon}
                      icon="download"
                      onClick={handleDownloadFilteredActivityCsv}
                      size="small"
                      type="default"
                    />
                  </li>
                )}
                {!hasEvents && (
                  <li className={cx(styles.itemContainer)}>
                    <span>
                      {t('events.noEventsToDownload', 'No vessel activity to download') as string}
                    </span>

                    <IconButton
                      icon="warning"
                      type="default"
                      size="small"
                      className={styles.icon}
                    />
                  </li>
                )}
                {readmeUrl !== undefined && (
                  <li className={styles.itemContainer}>
                    <a
                      href={readmeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleReadmeClick}
                    >
                      <span>{t('events.csvReadmeFile', 'README')}</span>
                      <IconButton
                        icon="external-link"
                        type="default"
                        size="small"
                        className={styles.icon}
                      />
                    </a>
                  </li>
                )}
              </ul>
            </Modal>
          )}
        </Fragment>
      )}
      {downloadingStatus && <Spinner size="small" className={styles.spinnerIcon} />}
    </Fragment>
  )
}

export default DownloadActivity
