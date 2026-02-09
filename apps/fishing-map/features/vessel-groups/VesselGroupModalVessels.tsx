import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { Locale } from '@globalfishingwatch/api-types'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'

import { FIRST_YEAR_OF_DATA } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import I18nDate from 'features/i18n/i18nDate'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import type { VesselIdentityProperty } from 'features/vessel/vessel.utils'
import { getSearchIdentityResolved, isFieldLoginRequired } from 'features/vessel/vessel.utils'
import type { IdField } from 'features/vessel-groups/vessel-groups.slice'
import {
  getVesselGroupUniqVessels,
  groupVesselGroupVessels,
} from 'features/vessel-groups/vessel-groups.utils'
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
  onRemoveClick: (vessel: VesselGroupVesselIdentity, isUnknownVessel: boolean) => void
  hiddenProperties?: VesselIdentityProperty[]
  searchIdField?: IdField
}
function VesselGroupVesselRow({
  vessel,
  onRemoveClick,
  className = '',
  hiddenProperties = [],
  searchIdField,
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
  } = getSearchIdentityResolved(vessel.identity!, { prioritizedProperty: searchIdField })
  const vesselDataset = useSelector(selectDatasetById(dataset))
  const vesselName = formatInfoField(shipname, 'shipname')
  const vesselGearType = getVesselGearTypeLabel({ geartypes })

  const identitySourceLabel = useMemo(() => {
    if (vessel.identity!.registryInfo?.length && vessel.identity!.selfReportedInfo.length)
      return `${t((t) => t.vessel.infoSources.both)} `
    if (vessel.identity!.registryInfo?.length) return t((t) => t.vessel.infoSources.registry)
    if (vessel.identity!.selfReportedInfo.length) return getDatasetLabel(vesselDataset)
    return EMPTY_FIELD_PLACEHOLDER
  }, [t, vessel.identity, vesselDataset])

  return (
    <tr className={className}>
      <td>{hiddenProperties.includes('ssvid') ? '' : ssvid || EMPTY_FIELD_PLACEHOLDER}</td>
      <td>{hiddenProperties.includes('imo') ? '' : imo || EMPTY_FIELD_PLACEHOLDER}</td>
      <td>{vesselName}</td>
      <td>
        <span>{flag ? t((t) => t[flag], { ns: 'flags' }) : EMPTY_FIELD_PLACEHOLDER}</span>
      </td>
      <td>
        {isFieldLoginRequired(vesselGearType) ? <VesselIdentityFieldLogin /> : vesselGearType}
      </td>
      <td translate="no">
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
      <td>{identitySourceLabel}</td>
      <td className={styles.icon}>
        <IconButton
          icon={'delete'}
          style={{
            color: 'rgb(var(--danger-red-rgb))',
          }}
          tooltip={t((t) => t.vesselGroup.removeVessel)}
          onClick={(e) => onRemoveClick(vessel, shipname === null)}
          size="small"
        />
      </td>
    </tr>
  )
}

const GROUP_BY_PROPERTY = 'ssvid'
function VesselGroupVessels({ searchIdField }: { searchIdField: IdField }) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroupVessels = useSelector(selectVesselGroupModalVessels)
  const deletedUnknownVesselsCount = useRef(0)

  const uniqVesselGroupVesselsByProperty = useMemo(() => {
    const uniqVesselGroupVessels = getVesselGroupUniqVessels(vesselGroupVessels)
    return groupVesselGroupVessels(uniqVesselGroupVessels, { property: GROUP_BY_PROPERTY })
  }, [vesselGroupVessels])

  const onVesselRemoveClick = useCallback(
    (vessel: VesselGroupVesselIdentity, isUnknownVessel: boolean) => {
      if (vesselGroupVessels) {
        let filteredVessels = vesselGroupVessels.filter(
          (v) => v.vesselId !== vessel.vesselId && v.relationId !== vessel.vesselId
        )
        if (isUnknownVessel) {
          deletedUnknownVesselsCount.current += 1
          if (deletedUnknownVesselsCount.current > 2) {
            const vesselsWithShipname = filteredVessels.filter(
              (v) => getSearchIdentityResolved(v.identity!).shipname !== null
            )
            const unknownVesselsCount = filteredVessels.length - vesselsWithShipname.length

            if (unknownVesselsCount > 0) {
              const confirmation = window.confirm(
                t((t) => t.vesselGroup.removeUnknownVessels, { param: unknownVesselsCount })
              )
              if (confirmation) {
                filteredVessels = vesselsWithShipname
              }
            }
          }
        }

        dispatch(setVesselGroupModalVessels(filteredVessels))
      }
    },
    [dispatch, vesselGroupVessels, t]
  )

  if (!vesselGroupVessels?.length) {
    return null
  }

  return (
    <table className={styles.vesselsTable}>
      <thead>
        <tr>
          <th>{t((t) => t.vessel.mmsi)}</th>
          <th>{t((t) => t.vessel.imo)}</th>
          <th>{t((t) => t.common.name)}</th>
          <th>{t((t) => t.vessel.flag)}</th>
          <th>{t((t) => t.vessel.gearType_short)}</th>
          <th>{t((t) => t.vessel.transmissionDates)}</th>
          <th>{t((t) => t.vessel.source)}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {Object.values(uniqVesselGroupVesselsByProperty).map((vessels) => {
          if (!vessels.length) {
            return null
          }
          const mainVessel = vessels[0]
          const otherVessels = vessels.slice(1)
          const hasOtherVessels = otherVessels.length > 0
          return (
            <Fragment key={`${mainVessel?.vesselId}-${mainVessel.dataset}`}>
              <VesselGroupVesselRow
                key={`${mainVessel?.vesselId}-${mainVessel.dataset}`}
                vessel={mainVessel}
                onRemoveClick={onVesselRemoveClick}
                className={hasOtherVessels ? styles.noBorderBottom : ''}
                searchIdField={searchIdField}
              />
              {hasOtherVessels &&
                otherVessels.map((otherVessel) => (
                  <VesselGroupVesselRow
                    key={`${otherVessel?.vesselId}-${otherVessel.dataset}`}
                    vessel={otherVessel}
                    onRemoveClick={onVesselRemoveClick}
                    className={cx(styles.noBorderTop)}
                    hiddenProperties={[GROUP_BY_PROPERTY]}
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
