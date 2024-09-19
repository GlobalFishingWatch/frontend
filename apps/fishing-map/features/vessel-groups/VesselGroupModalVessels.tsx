import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'es-toolkit'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { IdentityVessel, Locale, VesselRegistryInfo } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselGearTypeLabel } from 'utils/info'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import I18nDate from 'features/i18n/i18nDate'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  getLatestIdentityPrioritised,
  getVesselProperty,
  isFieldLoginRequired,
} from 'features/vessel/vessel.utils'
import { VesselDataIdentity } from 'features/vessel/vessel.slice'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import {
  setVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
  selectNewVesselGroupSearchVessels,
  setNewVesselGroupSearchVessels,
} from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'

type VesselGroupVesselRowProps = {
  vessel: VesselDataIdentity
  className?: string
  onRemoveClick: (vessel: VesselDataIdentity) => void
}
function VesselGroupVesselRow({
  vessel,
  onRemoveClick,
  className = '',
}: VesselGroupVesselRowProps) {
  const { t, i18n } = useTranslation()
  const { shipname, flag, ssvid, transmissionDateFrom, transmissionDateTo } =
    vessel || ({} as VesselRegistryInfo)
  const vesselName = formatInfoField(shipname, 'name')
  const vesselGearType = getVesselGearTypeLabel(vessel)

  return (
    <tr className={className}>
      <td>{ssvid}</td>
      <td>{vesselName}</td>
      <td>
        <Tooltip content={t(`flags:${flag as string}` as any)}>
          <span>
            {isFieldLoginRequired(vesselGearType) ? (
              <VesselIdentityFieldLogin />
            ) : (
              vesselGearType || EMPTY_FIELD_PLACEHOLDER
            )}
          </span>
        </Tooltip>
      </td>
      <td>
        {isFieldLoginRequired(vesselGearType) ? <VesselIdentityFieldLogin /> : vesselGearType}
      </td>
      <td>
        {transmissionDateFrom && transmissionDateTo && (
          // TODO tooltip not working
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

type VesselGroupDataIdentity = VesselDataIdentity & { dataset: string }
function groupSearchVesselsIdentityBy(vessels: IdentityVessel[] | null, groupByKey: string) {
  if (!vessels?.length) {
    return {}
  }
  return groupBy(
    vessels.map(
      (v) =>
        ({
          dataset: v.dataset,
          ...getLatestIdentityPrioritised(v),
        } as VesselGroupDataIdentity)
    ),
    (v) => (v as any)[groupByKey]
  )
}

function VesselGroupVessels() {
  const { t } = useTranslation()
  const vesselGroupSearchVessels = useSelector(selectVesselGroupSearchVessels)
  const newVesselGroupSearchVessels = useSelector(selectNewVesselGroupSearchVessels)
  const groupByKey = [
    ...(vesselGroupSearchVessels || []),
    ...(newVesselGroupSearchVessels || []),
  ].some((vessel) => {
    const ssvid = getVesselProperty(vessel, 'ssvid')
    return ssvid !== undefined && ssvid !== ''
  })
    ? 'ssvid'
    : 'id'
  const searchVesselsGrouped = groupSearchVesselsIdentityBy(vesselGroupSearchVessels, groupByKey)
  const newSearchVesselsGrouped = groupSearchVesselsIdentityBy(
    newVesselGroupSearchVessels,
    groupByKey
  )
  const dispatch = useAppDispatch()

  const onVesselRemoveClick = useCallback(
    (vessel: VesselGroupDataIdentity, list: 'search' | 'new' = 'search') => {
      const vessels = list === 'search' ? vesselGroupSearchVessels : newVesselGroupSearchVessels
      const action = (
        list === 'search' ? setVesselGroupSearchVessels : setNewVesselGroupSearchVessels
      ) as ActionCreatorWithPayload<IdentityVessel[], any>
      const index = vessels!.findIndex(
        (v) => getLatestIdentityPrioritised(v).id === vessel?.id && v.dataset === vessel.dataset
      )
      if (index > -1) {
        dispatch(action([...vessels!.slice(0, index), ...vessels!.slice(index + 1)]))
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
        {Object.keys(newSearchVesselsGrouped)?.length > 0 &&
          Object.keys(newSearchVesselsGrouped).map((mmsi) => {
            if (!mmsi || mmsi === 'undefined') {
              return null
            }
            const vessels = newSearchVesselsGrouped[mmsi]
            return vessels.map((vessel) => (
              <VesselGroupVesselRow
                key={`${vessel?.id}-${vessel.dataset}`}
                className={styles.new}
                vessel={vessel}
                onRemoveClick={(vessel) =>
                  onVesselRemoveClick(vessel as VesselGroupDataIdentity, 'new')
                }
              />
            ))
          })}
        {Object.keys(searchVesselsGrouped)?.length > 0 &&
          Object.keys(searchVesselsGrouped).map((mmsi) => {
            if (newSearchVesselsGrouped[mmsi]) {
              return null
            }
            const vessels = searchVesselsGrouped[mmsi]
            return (
              <Fragment key={mmsi}>
                {vessels.map((vessel, i) => (
                  <VesselGroupVesselRow
                    key={`${vessel?.id}-${vessel.dataset}`}
                    vessel={vessel}
                    onRemoveClick={(vessel) =>
                      onVesselRemoveClick(vessel as VesselGroupDataIdentity)
                    }
                    className={i === vessels.length - 1 ? styles.border : ''}
                  />
                ))}
              </Fragment>
            )
          })}
      </tbody>
    </table>
  )
}

export default VesselGroupVessels
