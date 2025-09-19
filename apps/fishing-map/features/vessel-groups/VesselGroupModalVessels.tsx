import { Fragment, useCallback, useMemo } from 'react'
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
  onRemoveClick: (vessel: VesselGroupVesselIdentity) => void
  hiddenProperties?: VesselIdentityProperty[]
}
function VesselGroupVesselRow({
  vessel,
  onRemoveClick,
  className = '',
  hiddenProperties = [],
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
      <td>{hiddenProperties.includes('ssvid') ? '' : ssvid || EMPTY_FIELD_PLACEHOLDER}</td>
      <td>{hiddenProperties.includes('imo') ? '' : imo || EMPTY_FIELD_PLACEHOLDER}</td>
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
          tooltip={t('vesselGroup.removeVessel')}
          onClick={(e) => onRemoveClick(vessel)}
          size="small"
        />
      </td>
    </tr>
  )
}

const GROUP_BY_PROPERTY = 'ssvid'
function VesselGroupVessels() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroupVessels = useSelector(selectVesselGroupModalVessels)

  const uniqVesselGroupVesselsByProperty = useMemo(() => {
    const uniqVesselGroupVessels = getVesselGroupUniqVessels(vesselGroupVessels)
    return groupVesselGroupVessels(uniqVesselGroupVessels, { property: GROUP_BY_PROPERTY })
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
          <th>{t('vessel.mmsi')}</th>
          <th>{t('vessel.imo')}</th>
          <th>{t('common.name')}</th>
          <th>{t('vessel.flag')}</th>
          <th>{t('vessel.gearType_short')}</th>
          <th>{t('vessel.transmissionDates')}</th>
          <th>{t('vessel.source')}</th>
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
                onRemoveClick={(vessel) => onVesselRemoveClick(vessel)}
                className={hasOtherVessels ? styles.noBorderBottom : ''}
              />
              {hasOtherVessels &&
                otherVessels.map((otherVessel) => (
                  <VesselGroupVesselRow
                    key={`${otherVessel?.vesselId}-${otherVessel.dataset}`}
                    vessel={otherVessel}
                    onRemoveClick={(vessel) => onVesselRemoveClick(vessel)}
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
