import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import I18nDate from 'features/i18n/i18nDate'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { ValueItem } from 'types'
import styles from './Info.module.css'
import InfoFieldHistory from './InfoFieldHistory'

export enum VesselFieldLabel {
  name = 'name',
  flag = 'flag',
  shipname = 'shipname',
  firstTransmissionDate = 'firstTransmissionDate',
  lastTransmissionDate = 'lastTransmissionDate',
  imo = 'imo',
  mmsi = 'mmsi',
  callsign = 'callsign',
  fleet = 'fleet',
  origin = 'origin',
  type = 'type',
  geartype = 'geartype',
  length = 'length',
  depth = 'depth',
  grossTonnage = 'grossTonnage',
  owner = 'owner',
  operator = 'operator',
  builtYear = 'builtYear',
  authorizations = 'authorizations',
  registeredGearType = 'registeredGearType',
  iuuStatus = 'iuuStatus',
}
interface ListItemProps {
  label: VesselFieldLabel
  value?: string
  valuesHistory?: ValueItem[]
  vesselName: string
  hideSince?: boolean
}

const InfoField: React.FC<ListItemProps> = ({
  value = DEFAULT_EMPTY_VALUE,
  label,
  valuesHistory = [],
  vesselName,
  hideSince = true,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(
    () => valuesHistory.length > 0 && setModalOpen(true),
    [valuesHistory.length]
  )
  const closeModal = useCallback(() => setModalOpen(false), [])

  const since = useMemo(() => valuesHistory.slice(0, 1)?.shift()?.firstSeen, [valuesHistory])

  return (
    <div className={styles.identifierField}>
      <label>{t(`vessel.${label}` as any, label)}</label>
      <div>
        <div onClick={openModal}>{value}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>
            {t('vessel.formatValues', '{{quantity}} values', {
              quantity: valuesHistory.length,
            })}
          </button>
        )}
        {!hideSince && valuesHistory.length === 1 && since && (
          <p className={styles.rangeLabel}>
            {t('common.since', 'Since')} <I18nDate date={since} />
          </p>
        )}
        <InfoFieldHistory
          label={label}
          history={valuesHistory}
          isOpen={modalOpen}
          onClose={closeModal}
          vesselName={vesselName}
        ></InfoFieldHistory>
      </div>
    </div>
  )
}

export default InfoField
