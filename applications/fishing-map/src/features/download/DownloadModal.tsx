import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import { Tag } from '@globalfishingwatch/ui-components/dist'
import { selectDownloadArea } from 'features/download/download.slice'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { TimelineDatesRange } from 'features/map/controls/MapInfo'
import styles from './DownloadModal.module.css'

type DownloadModalProps = {
  isOpen?: boolean
  onClose: () => void
}

function DownloadModal({ isOpen = false, onClose }: DownloadModalProps) {
  const { t } = useTranslation()
  const downloadArea = useSelector(selectDownloadArea)
  console.log(downloadArea)

  return (
    <Modal
      title={t('download.title', 'Download - Activity')}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <div className={styles.info}>
        <div>
          <label>Area</label>
          <Tag>{downloadArea?.feature.value || EMPTY_FIELD_PLACEHOLDER}</Tag>
        </div>
        <div>
          <label>Time Range</label>
          <Tag>
            <TimelineDatesRange />
          </Tag>
        </div>
      </div>
    </Modal>
  )
}

export default DownloadModal
