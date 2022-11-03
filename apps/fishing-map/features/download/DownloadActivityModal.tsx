import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Modal, Tabs, Tab, Button } from '@globalfishingwatch/ui-components'
import { resetDownloadActivityState } from 'features/download/downloadActivity.slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectDownloadActivityModalOpen } from 'features/download/download.selectors'
import DownloadActivityByVessel from './DownloadActivityByVessel'
import DownloadActivityGridded from './DownloadActivityGridded'
import styles from './DownloadModal.module.css'
import { Downloads } from './downloadActivity.config'
import { getDownloadReportSupported } from './download.utils'

function DownloadActivityModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const downloadModalOpen = useSelector(selectDownloadActivityModalOpen)
  const { start, end } = useTimerangeConnect()
  const isDownloadReportSupported = getDownloadReportSupported(start, end)

  const tabs = useMemo(() => {
    return [
      {
        id: Downloads.ByVessel,
        title: t('download.byVessel', 'Active vessels'),
        content: <DownloadActivityByVessel />,
      },
      {
        id: Downloads.Gridded,
        title: t('download.gridded', 'Gridded activity'),
        content: <DownloadActivityGridded />,
      },
    ]
  }, [t])
  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  const onClose = () => {
    dispatch(resetDownloadActivityState())
  }

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={`${t('download.title', 'Download')} - ${t('download.activity', 'Activity')}`}
      isOpen={downloadModalOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      <Tabs
        tabs={tabs}
        activeTab={activeTab?.id}
        onTabClick={(tab: Tab) => setActiveTab(tab)}
        buttonSize={'default'}
      />
      {!isDownloadReportSupported && (
        <div className={styles.downloadFooter}>
          <p className={styles.downloadLabel}>
            {t('download.fullDataset', 'Do you need the full dataset?')}
          </p>
          <Button
            className={styles.downloadBtn}
            href="https://globalfishingwatch.org/data-download/datasets/public-fishing-effort"
            target="_blank"
          >
            {t('download.dataPortal', 'See data download portal')}
          </Button>
        </div>
      )}
    </Modal>
  )
}

export default DownloadActivityModal
