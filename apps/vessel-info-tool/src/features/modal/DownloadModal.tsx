import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { RFMO } from '@/types/vessel.types'
import type { SelectOption } from '@globalfishingwatch/ui-components';
import { Button, Modal, Select } from '@globalfishingwatch/ui-components'

import type { RootState } from 'store'

import styles from '../../styles/global.module.css'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose, title = 'Download' }) => {
  const { t } = useTranslation()
  const rfmoOptions: SelectOption[] = Object.values(RFMO).map((rfmo) => ({
    id: rfmo,
    label: rfmo,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRFMO, setSelectedRFMO] = useState<SelectOption>(rfmoOptions[0])

  const rowSelection = useSelector((state: RootState) => state.table.selectedRows)

  const hasMinimalFields = () => {
    return true
  }

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      // Implement your download logic here
      onClose()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="auto"
      shouldCloseOnEsc
      header={false}
    >
      <div className="flex gap-6">
        <>
          <Select
            type="secondary"
            options={rfmoOptions}
            onSelect={(option) => setSelectedRFMO(option)}
            label={t('modal.submissionFormat', 'Submission format')}
          />
        </>
        {!hasMinimalFields() && (
          <div className="flex flex-col">
            {t('modal.fields_minimal', 'The following fields are missing in the registry data')}
            {/* <DownloadTable /> */}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button className={styles.downloadButton} onClick={handleDownload} disabled={isLoading}>
          {isLoading ? 'Downloading...' : 'Download'}
        </Button>
      </div>
    </Modal>
  )
}

export default DownloadModal
