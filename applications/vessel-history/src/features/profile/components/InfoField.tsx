import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ValueItem } from 'types'
import i18n from 'features/i18n/i18n'
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
  gearType = 'gearType',
  length = 'length',
  depth = 'depth',
  grossTonnage = 'grossTonnage',
  owner = 'owner',
  operator = 'operator',
  builtYear = 'builtYear',
  authorizations = 'authorizations',
  registeredGearType = 'registeredGearType',
}

enum VesselFieldLabelPlural {
  names = 'names',
  flags = 'flags',
  shipnames = 'shipnames',
  firstTransmissionDates = 'firstTransmissionDates',
  lastTransmissionDates = 'lastTransmissionDates',
  imos = 'imos',
  mmsis = 'mmsis',
  callsigns = 'callsigns',
  fleets = 'fleets',
  origins = 'origins',
  types = 'types',
  gearTypes = 'gearTypes',
  lengths = 'lengths',
  depths = 'depths',
  grossTonnages = 'grossTonnages',
  owners = 'owners',
  operators = 'operators',
  builtYears = 'builtYears',
  authorizations = 'authorizations',
  registeredGearTypes = 'registeredGearTypes',
}
interface ListItemProps {
  label: VesselFieldLabel
  value: string
  valuesHistory?: ValueItem[]
  vesselName: string
}

const InfoField: React.FC<ListItemProps> = ({
  value = '',
  label,
  valuesHistory = [],
  vesselName,
}): React.ReactElement => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const openModal = useCallback(() => setModalOpen(true), [])
  const closeModal = useCallback(() => setModalOpen(false), [])
  const defaultEmptyValue = '-'

  const current: ValueItem = {
    value,
    firstSeen: valuesHistory.slice().shift()?.endDate,
  }
  const labelPlural: VesselFieldLabelPlural = useMemo(() => {
    const key = (label === 'authorizations' ? label : `${label}s`) as VesselFieldLabelPlural
    return t(`vessel.${key}` as any, key)
  }, [t, label])

  const defaultValue = useMemo(() => {
    return `+${valuesHistory.length} previous ${labelPlural.toLocaleUpperCase()}`
  }, [valuesHistory, labelPlural])

  return (
    <div className={styles.identifierField}>
      <label>{t(`vessel.${label}` as any, label)}</label>
      <div>
        <div onClick={openModal}>{value.length > 0 ? value : defaultEmptyValue}</div>
        {valuesHistory.length > 0 && (
          <button className={styles.moreValues} onClick={openModal}>
            {`${t('vessel.plusPreviousValuesByField', defaultValue, {
              quantity: valuesHistory.length,
              fieldLabel: labelPlural.toLocaleUpperCase(),
            })}`}
          </button>
        )}
        <InfoFieldHistory
          current={current}
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
