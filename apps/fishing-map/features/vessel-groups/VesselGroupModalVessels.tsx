import { Fragment, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { groupBy } from 'lodash'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { IdentityVessel, Locale, VesselRegistryInfo } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import I18nDate from 'features/i18n/i18nDate'
import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import {
  setVesselGroupSearchVessels,
  selectVesselGroupSearchVessels,
  selectNewVesselGroupSearchVessels,
  setNewVesselGroupSearchVessels,
} from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'

type VesselGroupVesselRowProps = {
  vessel: IdentityVessel
  className?: string
  onRemoveClick: (vessel: IdentityVessel) => void
}
function VesselGroupVesselRow({
  vessel,
  onRemoveClick,
  className = '',
}: VesselGroupVesselRowProps) {
  const { t, i18n } = useTranslation()
  const vesselName = formatInfoField(getVesselProperty(vessel, { property: 'shipname' }), 'name')
  const vesselFlag = getVesselProperty(vessel, { property: 'flag' })
  const gearType = getVesselProperty(vessel, { property: 'geartype' })
  const vesselGearType = `${t(
    `vessel.gearTypes.${gearType}` as any,
    gearType ?? EMPTY_FIELD_PLACEHOLDER
  )}`

  const { ssvid, transmissionDateFrom, transmissionDateTo } =
    vessel?.registryInfo?.[0] || ({} as VesselRegistryInfo)
  return (
    <tr className={className}>
      <td>{ssvid}</td>
      <td>{vesselName}</td>
      <td>
        <Tooltip content={t(`flags:${vesselFlag as string}` as any)}>
          <span>{vesselFlag || EMPTY_FIELD_PLACEHOLDER}</span>
        </Tooltip>
      </td>
      <td>{vesselGearType}</td>
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

function VesselGroupVessels() {
  const { t } = useTranslation()
  const vesselGroupSearchVessels = useSelector(selectVesselGroupSearchVessels)
  const newVesselGroupSearchVessels = useSelector(selectNewVesselGroupSearchVessels)
  const groupByKey = [
    ...(vesselGroupSearchVessels || []),
    ...(newVesselGroupSearchVessels || []),
  ].some((vessel) => getVesselProperty(vessel, { property: 'ssvid' }) !== undefined)
    ? 'selfReportedInfo[0].mmsi'
    : 'selfReportedInfo[0].id'
  const searchVesselsGrouped = groupBy(vesselGroupSearchVessels, groupByKey)
  const newSearchVesselsGrouped = groupBy(newVesselGroupSearchVessels, groupByKey)
  const dispatch = useAppDispatch()

  const onVesselRemoveClick = useCallback(
    (vessel: IdentityVessel, list: 'search' | 'new' = 'search') => {
      const vessels = list === 'search' ? vesselGroupSearchVessels : newVesselGroupSearchVessels
      const action =
        list === 'search' ? setVesselGroupSearchVessels : setNewVesselGroupSearchVessels
      const index = vessels!.findIndex(
        (v) =>
          v?.registryInfo?.[0]?.id === vessel.selfReportedInfo?.[0]?.id &&
          v.dataset === vessel.dataset
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
            const vessels = newSearchVesselsGrouped[mmsi]
            return vessels.map((vessel) => (
              <VesselGroupVesselRow
                key={`${vessel.selfReportedInfo?.[0]?.id}-${vessel.dataset}`}
                className={styles.new}
                vessel={vessel}
                onRemoveClick={(vessel) => onVesselRemoveClick(vessel as IdentityVessel, 'new')}
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
                    key={`${vessel.selfReportedInfo?.[0]?.id}-${vessel.dataset}`}
                    vessel={vessel}
                    onRemoveClick={onVesselRemoveClick}
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
