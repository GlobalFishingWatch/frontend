import type { JSX,ReactNode } from 'react';
import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValueItem } from 'types'

import { Modal } from '@globalfishingwatch/ui-components'

import type { VesselFieldLabel } from 'types/vessel'

import InfoFieldHistoryTable from './InfoFieldHistoryTable'

interface ListItemProps {
  history: ValueItem[]
  isOpen: boolean
  label: VesselFieldLabel
  modalTitle?: string
  columnHeaders?: {
    field?: ReactNode
    dates?: ReactNode
    source?: ReactNode
  }
  datesTemplate?: (firstSeen, originalFirstSeen) => JSX.Element
  hideTMTDate: boolean
  vesselName: string
  onClose?: () => void
}

const InfoFieldHistory: React.FC<ListItemProps> = ({
  history,
  isOpen,
  label,
  modalTitle,
  columnHeaders,
  datesTemplate,
  hideTMTDate,
  vesselName,
  onClose = () => { },
}): React.ReactElement<any> => {
  const { t } = useTranslation()

  const defaultTitle = useMemo(() => {
    return `${label} History for ${vesselName}`
  }, [label, vesselName])


  return (
    <Fragment>
      {history.length > 0 && (
        <Modal
          appSelector="__next"
          title={modalTitle ?? t('vessel.historyLabelByField', defaultTitle, {
            label: t(`vessel.${label}` as any, label),
            vesselName,
          })}
          isOpen={isOpen}
          onClose={onClose}
        >
          <InfoFieldHistoryTable
            history={history}
            label={label}
            datesTemplate={datesTemplate}
            columnHeaders={columnHeaders}
            hideTMTDate={hideTMTDate} />
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistory
