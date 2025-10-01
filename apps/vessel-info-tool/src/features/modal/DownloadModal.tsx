import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Route } from '@/routes/_auth/index'
import type { ICCATOwner, ICCATVessel, Vessel } from '@/types/vessel.types'
import { RFMO } from '@/types/vessel.types'
import { handleExportICCATVessels, parseVessels } from '@/utils/iccat'
import type { MissingFieldsTableType } from '@/utils/validations'
import { checkMissingMandatoryFields } from '@/utils/validations'
import type { UserData } from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Button, Modal, Select } from '@globalfishingwatch/ui-components'

import { FieldsTable } from '../fieldsTable/FieldsTable'

import styles from '../../styles/global.module.css'

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  data: Vessel[]
  user: UserData
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  title = 'Download',
  data,
  user,
}) => {
  const { t } = useTranslation()
  const searchQuery = Route.useSearch()

  const rfmoOptions: SelectOption[] = Object.values(RFMO).map((rfmo) => ({
    id: rfmo,
    label: rfmo,
  }))
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRFMO, setSelectedRFMO] = useState<SelectOption>(rfmoOptions[0])
  const [report, setReport] = useState<MissingFieldsTableType[]>([])
  const [parsed, setParsed] = useState<{
    iccatVessels: ICCATVessel[]
    ownerList: ICCATOwner[]
  }>({ iccatVessels: [], ownerList: [] })

  useEffect(() => {
    const fetchData = async () => {
      const selectedIds = searchQuery.selectedRows
      if (!selectedIds || selectedIds.length === 0) return
      const vessels = data.filter((vessel) => selectedIds.includes(vessel.id))
      const parsedData = await parseVessels(vessels)
      if (parsedData) {
        setParsed(parsedData)
        const report = checkMissingMandatoryFields(parsedData.iccatVessels)
        setReport(report)
      }
    }

    fetchData()
  }, [isOpen])

  const handleDownload = () => {
    try {
      setIsLoading(true)
      handleExportICCATVessels(parsed.iccatVessels, parsed.ownerList, user)
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
        <Select
          type="secondary"
          options={rfmoOptions}
          onSelect={(option) => setSelectedRFMO(option)}
          selectedOption={selectedRFMO}
          label={t('modal.submissionFormat', 'Submission format')}
        />
        {report.length ? (
          <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-scroll">
            {t('modal.fields_minimal', 'The following fields are missing in the registry data')}
            <FieldsTable fields={report} />
          </div>
        ) : null}
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
