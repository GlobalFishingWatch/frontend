import { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { ButtonType, IconButton, Modal } from '@globalfishingwatch/ui-components'
import styles from './download-activity-csv.module.css'

export interface DownloadActivityCsvProps {
  filtersApplied: boolean
  onDownloadAllActivityCsv?: () => void
  onDownloadFilteredActivityCsv?: () => void
  onReadmeClick?: () => void
  type?: ButtonType
}

export function DownloadActivityCsv(props: DownloadActivityCsvProps) {
  const { t } = useTranslation()
  const { filtersApplied, onDownloadAllActivityCsv, onDownloadFilteredActivityCsv, onReadmeClick } =
    props
  const [showDownloadPopup, setShowDownloadPopup] = useState(false)

  const handleCloseDownloadPopup = useCallback(() => {
    setShowDownloadPopup(false)
  }, [])
  const readmeUrl = useMemo(
    () => (onReadmeClick !== undefined ? (onReadmeClick() as any) : undefined),
    [onReadmeClick]
  )
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
            {onDownloadAllActivityCsv !== undefined && (
              <li className={styles.itemContainer}>
                <button onClick={onDownloadAllActivityCsv}>
                  {t('events.downloadAllActivity', 'Download entire vessel activity')}
                </button>
                <IconButton
                  className={styles.icon}
                  icon="download"
                  onClick={onDownloadAllActivityCsv}
                  size="small"
                  tooltip={t('common.download', 'Download')}
                  tooltipPlacement="left"
                  type="default"
                />
              </li>
            )}
            {onDownloadFilteredActivityCsv !== undefined && (
              <li className={cx(styles.itemContainer, !filtersApplied && styles.disabled)}>
                <button onClick={onDownloadFilteredActivityCsv} disabled={!filtersApplied}>
                  {t(
                    'events.downloadCurrentActivityFiltered',
                    'Download current vessel activity filtered'
                  )}
                </button>
                <IconButton
                  className={styles.icon}
                  disabled={!filtersApplied}
                  icon="download"
                  onClick={onDownloadFilteredActivityCsv}
                  size="small"
                  tooltip={t('common.download', 'Download')}
                  tooltipPlacement="left"
                  type="default"
                />
              </li>
            )}
            {readmeUrl !== undefined && (
              <li className={styles.itemContainer}>
                <a href={readmeUrl} target="_blank" rel="noreferrer">
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

export default DownloadActivityCsv
