import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Modal, Tabs, Tab } from '@globalfishingwatch/ui-components'
import { resetDownloadActivityState } from 'features/download/downloadActivity.slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDownloadActivityModalOpen } from 'features/download/download.selectors'
import DownloadActivityByVessel from './DownloadActivityByVessel'
import DownloadActivityGridded from './DownloadActivityGridded'
import styles from './DownloadModal.module.css'
import { Downloads } from './downloadActivity.config'

function DownloadActivityModal() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const downloadModalOpen = useSelector(selectDownloadActivityModalOpen)

  const tabs = useMemo(() => {
    return [
      {
        id: Downloads.ByVessel,
        title: t('download.byVessel', 'Data per vessel'),
        content: <DownloadActivityByVessel />,
      },
      {
        id: Downloads.Gridded,
        title: t('download.gridded', 'Data per grid cell'),
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
    </Modal>
  )
}

export default DownloadActivityModal
