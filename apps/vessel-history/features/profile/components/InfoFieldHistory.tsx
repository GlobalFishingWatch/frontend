import React, { Fragment, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import InfoFieldHistoryTable from './InfoFieldHistoryTable'

interface ListItemProps {
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  columnHeaders?: {
    field?: ReactNode
    dates?: ReactNode
    source?: ReactNode
  }
  hideTMTDate: boolean
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  history,
  isOpen,
  label,
  columnHeaders,
  hideTMTDate,
  vesselName,
  onClose = () => { },
}): React.ReactElement => {
  const { t } = useTranslation()

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])


  return (
    <Fragment>
      {history.length > 0 && (
        <Modal
          appSelector="__next"
          title={t('vessel.historyLabelByField', defaultTitle, {
            label: t(`vessel.${label}` as any, label),
            vesselName,
          })}
          isOpen={isOpen}
          onClose={onClose}
        >
          <InfoFieldHistoryTable
            history={history}
            label={label}
            columnHeaders={columnHeaders}
            hideTMTDate={hideTMTDate} />
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
