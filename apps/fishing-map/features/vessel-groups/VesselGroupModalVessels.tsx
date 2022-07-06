import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { IconButton, Tooltip, TransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { Vessel } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import I18nDate from 'features/i18n/i18nDate'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselGroupSearchVessels, setVesselGroupSearchVessels } from './vessel-groups.slice'
import styles from './VesselGroupModal.module.css'

function VesselGroupVessels(): React.ReactElement {
  const { t } = useTranslation()
  const vesselGroupSearchVessels = useSelector(selectVesselGroupSearchVessels)
  const dispatch = useAppDispatch()
  const onVesselRemoveClick = useCallback(
    (vessel: Vessel) => {
      const index = vesselGroupSearchVessels.findIndex(
        (v) => v.id === vessel.id && v.dataset === vessel.dataset
      )
      dispatch(
        setVesselGroupSearchVessels([
          ...vesselGroupSearchVessels.slice(0, index),
          ...vesselGroupSearchVessels.slice(index + 1),
        ])
      )
    },
    [dispatch, vesselGroupSearchVessels]
  )
  return (
    <table className={styles.vesselsTable}>
      <thead>
        <tr>
          <th>{t('vessel.mmsi', 'MMSI')}</th>
          <th>{t('common.name', 'Name')}</th>
          <th>{'dataset'}</th>
          <th>{t('vessel.flag_short', 'iso3')}</th>
          <th>{t('vessel.gearType_short', 'gear')}</th>
          <th>{t('vessel.transmissionDates', 'Transmission dates')}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {vesselGroupSearchVessels.map((vessel, i) => {
          const vesselName = formatInfoField(vessel.shipname, 'name')

          const vesselGearType = `${t(
            `vessel.gearTypes.${vessel.geartype}` as any,
            vessel.geartype ?? EMPTY_FIELD_PLACEHOLDER
          )}`

          const { mmsi, firstTransmissionDate, lastTransmissionDate } = vessel
          return (
            <tr key={i}>
              <td>{mmsi}</td>
              <td>{vesselName}</td>
              <td>{vessel.dataset}</td>
              <td>
                <Tooltip content={t(`flags:${vessel.flag as string}` as any)}>
                  <span>{vessel.flag || EMPTY_FIELD_PLACEHOLDER}</span>
                </Tooltip>
              </td>
              <td>{vesselGearType}</td>
              <td>
                {firstTransmissionDate && lastTransmissionDate && (
                  // TODO tooltip not working
                  <Tooltip
                    content={
                      <span>
                        from <I18nDate date={firstTransmissionDate} /> to{' '}
                        <I18nDate date={lastTransmissionDate} />
                      </span>
                    }
                  >
                    <div>
                      <TransmissionsTimeline
                        firstTransmissionDate={firstTransmissionDate}
                        lastTransmissionDate={lastTransmissionDate}
                        firstYearOfData={FIRST_YEAR_OF_DATA}
                        shortYears
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
                  onClick={(e) => onVesselRemoveClick(vessel)}
                  size="small"
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default VesselGroupVessels
