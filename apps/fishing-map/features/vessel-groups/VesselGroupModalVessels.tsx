import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Locale } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { FIRST_YEAR_OF_DATA } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import { getSearchIdentityResolved, isFieldLoginRequired } from 'features/vessel/vessel.utils'
import { getVesselGroupUniqVessels } from 'features/vessel-groups/vessel-groups.utils'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselGearTypeLabel } from 'utils/info'

import type { VesselGroupVesselIdentity } from './vessel-groups-modal.slice'
import {
  selectVesselGroupModalVessels,
  setVesselGroupModalVessels,
} from './vessel-groups-modal.slice'

import styles from './VesselGroupModal.module.css'

type VesselGroupVesselRowProps = {
  vessel: VesselGroupVesselIdentity
  className?: string
  onRemoveClick: (vessel: VesselGroupVesselIdentity) => void
}
function VesselGroupVesselRow({
  vessel,
  onRemoveClick,
  className = '',
}: VesselGroupVesselRowProps) {
  const { t, i18n } = useTranslation()
  const {
    shipname,
    flag,
    ssvid,
    imo,
    transmissionDateFrom,
    transmissionDateTo,
    geartypes,
    dataset,
  } = getSearchIdentityResolved(vessel.identity!)
  const vesselDataset = useSelector(selectDatasetById(dataset))
  const vesselName = formatInfoField(shipname, 'shipname')
  const vesselGearType = getVesselGearTypeLabel({ geartypes })

  return (
    <tr className={className}>
      <td>{ssvid || EMPTY_FIELD_PLACEHOLDER}</td>
      <td>{imo || EMPTY_FIELD_PLACEHOLDER}</td>
      <td>{vesselName}</td>
      <td>
        <span>{flag ? t(`flags:${flag as string}` as any) : EMPTY_FIELD_PLACEHOLDER}</span>
      </td>
      <td>
        {isFieldLoginRequired(vesselGearType) ? <VesselIdentityFieldLogin /> : vesselGearType}
      </td>
      <td>
        {transmissionDateFrom && transmissionDateTo && (
          <Tooltip
            content={
              <span>
                from <I18nDate date={transmissionDateFrom} /> to{' '}
                <I18nDate date={transmissionDateTo} />
              </span>
            }
          >
            <div>
              <TransmissionsTimeline
                firstTransmissionDate={transmissionDateFrom}
                lastTransmissionDate={transmissionDateTo}
                firstYearOfData={FIRST_YEAR_OF_DATA}
                locale={i18n.language as Locale}
              />
            </div>
          </Tooltip>
        )}
      </td>
      <td>{getDatasetLabel(vesselDataset)}</td>
      <td className={styles.icon}>
        <IconButton
          icon={'delete'}
          style={{
            color: 'rgb(var(--danger-red-rgb))',
          }}
          tooltip={t('vesselGroup.removeVessel', 'Remove vessel from vessel group')}
          onClick={(e) => onRemoveClick(vessel)}
          size="small"
        />
      </td>
    </tr>
  )
}

function VesselGroupVessels() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroupVessels = useSelector(selectVesselGroupModalVessels)

  const uniqVesselGroupVessels = useMemo(() => {
    return getVesselGroupUniqVessels(vesselGroupVessels)
  }, [vesselGroupVessels])

  const onVesselRemoveClick = useCallback(
    (vessel: VesselGroupVesselIdentity) => {
      if (vesselGroupVessels) {
        const filteredVessels = vesselGroupVessels.filter(
          (v) => v.vesselId !== vessel.vesselId && v.relationId !== vessel.vesselId
        )
        dispatch(setVesselGroupModalVessels(filteredVessels))
      }
    },
    [dispatch, vesselGroupVessels]
  )

  if (!vesselGroupVessels?.length) {
    return null
  }

  return (
    <table className={styles.vesselsTable}>
      <thead>
        <tr>
          <th>{t('vessel.mmsi', 'MMSI')}</th>
          <th>{t('vessel.imo', 'IMO')}</th>
          <th>{t('common.name', 'Name')}</th>
          <th>{t('vessel.flag', 'flag')}</th>
          <th>{t('vessel.gearType_short', 'gear')}</th>
          <th>{t('vessel.transmissionDates', 'Transmission dates')}</th>
          <th>{t('vessel.source', 'Source')}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {uniqVesselGroupVessels?.map((vessel) => {
          if (!vessel.identity) {
            return null
          }
          return (
            <VesselGroupVesselRow
              key={`${vessel?.vesselId}-${vessel.dataset}`}
              vessel={vessel}
              onRemoveClick={(vessel) => onVesselRemoveClick(vessel)}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default VesselGroupVessels
