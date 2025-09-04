import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Vessel } from '@/types/vessel.types'
import { RFMO } from '@/types/vessel.types'
import { checkMissingMandatoryFields } from '@/utils/validations'
import { handleExportICCATVessels, parseVessels } from '@/utils/vessels'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Button, Modal, Select } from '@globalfishingwatch/ui-components'

import type { RootState } from 'store'

import { FieldsTable } from '../fieldsTable/FieldsTable'

import styles from '../../styles/global.module.css'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  data: Vessel[]
}

const mandatory = [
  { field: 'IntRegNumber', format: 'string' },
  { field: 'VesselName', format: 'string' },
]

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  title = 'Download',
  data,
}) => {
  const { t } = useTranslation()
  const rfmoOptions: SelectOption[] = Object.values(RFMO).map((rfmo) => ({
    id: rfmo,
    label: rfmo,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRFMO, setSelectedRFMO] = useState<SelectOption>(rfmoOptions[0])

  const rowSelection = useSelector((state: RootState) => state.table.selectedRows)
  const selectedIds = Object.keys(rowSelection).map((k) => k.toString())
  const vessels = data.filter((vessel) => selectedIds.includes(vessel.id))
  const parsed = parseVessels(vessels, selectedRFMO.id as RFMO)

  const report = checkMissingMandatoryFields(parsed, mandatory)
  console.log('🚀 ~ DownloadModal ~ report:', report)

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      handleExportICCATVessels(parsed)
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
      <div className="flex flex-col gap-8 !pt-10">
        <h2>{t('modal.download', 'Download')}</h2>
        <>
          <Select
            type="secondary"
            options={rfmoOptions}
            onSelect={(option) => setSelectedRFMO(option)}
            selectedOption={selectedRFMO}
            label={t('modal.submissionFormat', 'Submission format')}
          />
        </>
        {report.length && (
          <div className="flex flex-col">
            {t('modal.fields_minimal', 'The following fields are missing in the registry data')}
            <FieldsTable fields={report} />
          </div>
        )}
        <div className="flex justify-end">
          <Button className={styles.downloadButton} onClick={handleDownload} disabled={isLoading}>
            {isLoading ? 'Downloading...' : 'Download'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default DownloadModal
