import { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { ButtonType, IconButton, Modal } from '@globalfishingwatch/ui-components'
import styles from './download-activity.module.css'
import useDownloadActivity from './download-activity.hook'

export interface DownloadActivityCsvProps {
  filtersApplied: boolean
  onDownloadAllActivityCsv?: () => void
  onDownloadFilteredActivityCsv?: () => void
  onReadmeClick?: () => void
  type?: ButtonType
}

export function DownloadActivity(props: DownloadActivityCsvProps) {
  const { t } = useTranslation()
  const { filtersApplied, onDownloadAllActivityCsv, onDownloadFilteredActivityCsv, onReadmeClick } =
    props
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)
  const { downloadAllEvents, downloadFilteredEvents, downloadingStatus, viewReadme } =
    useDownloadActivity()

  const readmeUrl = useMemo(
    () => (viewReadme !== undefined ? (viewReadme() as any) : undefined),
    [viewReadme]
  )

  const handleCloseDownloadPopup = useCallback(() => {
    setShowDownloadPopup(false)
  }, [])

  const handleDownloadAllActivityCsv = useCallback(() => {
    downloadAllEvents()
    if (onDownloadAllActivityCsv !== undefined) {
      onDownloadAllActivityCsv()
    }
  }, [downloadAllEvents, onDownloadAllActivityCsv])

  const handleDownloadFilteredActivityCsv = useCallback(() => {
    downloadFilteredEvents()
    if (onDownloadFilteredActivityCsv !== undefined) {
      onDownloadFilteredActivityCsv()
    }
  }, [downloadFilteredEvents, onDownloadFilteredActivityCsv])

  const handleReadmeClick = useCallback(() => {
    if (onReadmeClick !== undefined) {
      onReadmeClick()
    }
  }, [onReadmeClick])

  return (
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
            <li className={cx(styles.itemContainer, !filtersApplied && styles.disabled)}>
              <button onClick={handleDownloadFilteredActivityCsv} disabled={!filtersApplied}>
                {t(
                  'events.downloadCurrentActivityFiltered',
                  'Download current vessel activity filtered'
                )}
              </button>
              <IconButton
                className={styles.icon}
                disabled={!filtersApplied}
                icon="download"
                onClick={handleDownloadFilteredActivityCsv}
                size="small"
                tooltip={t('common.download', 'Download')}
                tooltipPlacement="left"
                type="default"
              />
            </li>
            {readmeUrl !== undefined && (
              <li className={styles.itemContainer}>
                <a href={readmeUrl} target="_blank" rel="noreferrer" onClick={handleReadmeClick}>
                  <span>{t('events.csvReadmeFile', 'README.md')}</span>
                  <IconButton
                    icon="external-link"
                    type="default"
                    size="small"
                    className={styles.icon}
                    tooltipPlacement="left"
                    tooltip={t('common.viewReadme', 'View README.md')}
                  />
                </a>
              </li>
            )}
          </ul>
        </Modal>
      )}
    </Fragment>
  )
}

export default DownloadActivity
