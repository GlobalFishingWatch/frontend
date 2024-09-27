import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { Locale } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselGearTypeLabel } from 'utils/info'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import I18nDate from 'features/i18n/i18nDate'
import { useAppDispatch } from 'features/app/app.hooks'
import { getSearchIdentityResolved, isFieldLoginRequired } from 'features/vessel/vessel.utils'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import styles from './VesselGroupModal.module.css'
import {
  VesselGroupVesselIdentity,
  selectNewVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
  setNewVesselGroupSearchVessels,
  setVesselGroupSearchVessels,
} from './vessel-groups-modal.slice'

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
  const { shipname, flag, ssvid, transmissionDateFrom, transmissionDateTo, geartypes } =
    getSearchIdentityResolved(vessel.identity!)
  const vesselName = formatInfoField(shipname, 'name')
  const vesselGearType = getVesselGearTypeLabel({ geartypes })

  return (
    <tr className={className}>
      <td>{ssvid}</td>
      <td>{vesselName}</td>
      <td>
        <span>{t(`flags:${flag as string}` as any) || EMPTY_FIELD_PLACEHOLDER}</span>
      </td>
      <td>
        {isFieldLoginRequired(vesselGearType) ? <VesselIdentityFieldLogin /> : vesselGearType}
      </td>
      <td>
        {transmissionDateFrom && transmissionDateTo && (
          // TODO:VV3 tooltip not working
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
      <td>
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
  const vesselGroupSearchVessels = useSelector(selectVesselGroupSearchVessels)
  const newVesselGroupSearchVessels = useSelector(selectNewVesselGroupSearchVessels)
  const onVesselRemoveClick = useCallback(
    (vessel: VesselGroupVesselIdentity, list: 'search' | 'new' = 'search') => {
      const vessels = list === 'search' ? vesselGroupSearchVessels : newVesselGroupSearchVessels
      if (vessels) {
        const action = (
          list === 'search' ? setVesselGroupSearchVessels : setNewVesselGroupSearchVessels
        ) as ActionCreatorWithPayload<VesselGroupVesselIdentity[], any>
        const filteredVessels = vessels.filter(
          (v) => v.vesselId !== vessel.vesselId && v.relationId !== vessel.vesselId
        )
        dispatch(action(filteredVessels))
      }
    },
    [dispatch, newVesselGroupSearchVessels, vesselGroupSearchVessels]
  )

  if (!vesselGroupSearchVessels?.length && !newVesselGroupSearchVessels?.length) {
    return null
  }

  return (
    <table className={styles.vesselsTable}>
      <thead>
        <tr>
          <th>{t('vessel.mmsi', 'MMSI')}</th>
          <th>{t('common.name', 'Name')}</th>
          <th>{t('vessel.flag', 'flag')}</th>
          <th>{t('vessel.gearType_short', 'gear')}</th>
          <th>{t('vessel.transmissionDates', 'Transmission dates')}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {newVesselGroupSearchVessels?.map((vessel) => {
          if (!vessel.identity) {
            return null
          }
          return (
            <VesselGroupVesselRow
              key={`${vessel?.vesselId}-${vessel.dataset}`}
              className={styles.new}
              vessel={vessel}
              onRemoveClick={(vessel) => onVesselRemoveClick(vessel, 'new')}
            />
          )
        })}
        {vesselGroupSearchVessels?.map((vessel) => {
          if (!vessel.identity) {
            return null
          }
          return (
            <VesselGroupVesselRow
              key={`${vessel?.vesselId}-${vessel.dataset}`}
              className={styles.new}
              vessel={vessel}
              onRemoveClick={(vessel) => onVesselRemoveClick(vessel, 'search')}
            />
          )
        })}
      </tbody>
    </table>
  )
}

export default VesselGroupVessels
