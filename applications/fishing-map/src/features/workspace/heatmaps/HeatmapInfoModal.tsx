import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from '@globalfishingwatch/ui-components/dist/modal'
import Tabs, { Tab } from '@globalfishingwatch/ui-components/dist/tabs'
import { UrlDataviewInstance } from 'types'
import styles from './HeatmapInfoModal.module.css'

function removeDatasetVersion(datasetId: string) {
  return datasetId?.split(':')[0]
}

type HeatmapInfoModalProps = {
  isOpen?: boolean
  onClose: () => void
  dataview: UrlDataviewInstance
}

function HeatmapInfoModal({ isOpen = false, onClose, dataview }: HeatmapInfoModalProps) {
  const { t } = useTranslation()
  const tabs = dataview.datasets?.flatMap((dataset) => {
    if (!dataview.config?.datasets?.includes(dataset.id)) {
      return []
    }
    const datasetId = removeDatasetVersion(dataset?.id)
    if (!datasetId) return []
    return {
      id: datasetId,
      title: t(`datasets:${removeDatasetVersion(dataset?.id)}.name` as any),
      content: (
        <p className={styles.content}>
          {t(`datasets:${removeDatasetVersion(dataset?.id)}.description` as any)}
        </p>
      ),
    }
  })

  const [activeTab, setActiveTab] = useState<Tab | undefined>(tabs?.[0])

  if (!tabs?.length) return null

  const isSingleTab = tabs?.length === 1

  return (
    <Modal
      title={isSingleTab ? `${dataview.name} - ${tabs[0].title}` : dataview.name}
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={styles.modalContent}
    >
      {isSingleTab ? (
        tabs[0]?.content
      ) : (
        <Tabs tabs={tabs} activeTab={activeTab?.id} onTabClick={(tab: Tab) => setActiveTab(tab)} />
      )}
    </Modal>
  )
}

export default HeatmapInfoModal
