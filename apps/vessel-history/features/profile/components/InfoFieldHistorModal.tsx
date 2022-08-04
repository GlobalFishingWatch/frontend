import React, { Fragment, ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { useVesselsConnect } from 'features/vessels/vessels.hook'
import { ValueItem } from 'types'
import { VesselFieldLabel } from 'types/vessel'
import HistoryDate from './HistoryDate'
import styles from './Info.module.css'
import InfoFieldHistory from './InfoFieldHistory'

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

const InfoFieldHistoryModal: React.FC<ListItemProps> = ({
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

  const { formatSource } = useVesselsConnect(label)

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
          <InfoFieldHistory
            history={history}
            hideTMTDate={hideTMTDate}
            columnHeaders={columnHeaders}
            label={label} />
        </Modal>
      )}
    </Fragment>
  )
}

export default InfoFieldHistoryModal
