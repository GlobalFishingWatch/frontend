import { Fragment } from 'react'
import { groupBy } from 'es-toolkit'

import type { IdentityVessel } from '@globalfishingwatch/api-types'

import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import GFWOnly from 'features/user/GFWOnly'
import { formatInfoField } from 'utils/info'

export const getVesselIdentityTooltipSummary = (
  vessel: IdentityVessel | ExtendedFeatureVessel,
  { showVesselId } = {} as { showVesselId: boolean }
) => {
  if (!vessel || !vessel.selfReportedInfo?.length) {
    return ['']
  }
  const identitiesByNormalizedShipname = groupBy(vessel?.selfReportedInfo, (i) => i.nShipname)
  const identities = Object.entries(identitiesByNormalizedShipname).flatMap(
    ([_, selfReportedInfo], index) => {
      const firstTransmissionDateFrom = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateFrom
        }
        return acc < curr.transmissionDateFrom ? acc : curr.transmissionDateFrom
      }, '')
      const lastTransmissionDateTo = selfReportedInfo.reduce((acc, curr) => {
        if (!acc) {
          return curr.transmissionDateTo
        }
        return acc > curr.transmissionDateTo ? acc : curr.transmissionDateTo
      }, '')

      const selfReported = selfReportedInfo[0]
      const name = formatInfoField(selfReported.shipname, 'shipname')
      const flag = formatInfoField(selfReported.flag, 'flag')
      let info = `${name} - (${flag})`
      if (firstTransmissionDateFrom && lastTransmissionDateTo) {
        info = `${info} (${formatI18nDate(
          firstTransmissionDateFrom
        )} - ${formatI18nDate(lastTransmissionDateTo)})`
      }
      return showVesselId ? (
        <Fragment key={index}>
          {info}
          <br />
          {selfReportedInfo.map((s, index) => (
            <Fragment key={s.id || index}>
              <GFWOnly type="only-icon" /> {s.id}
              {index < selfReportedInfo.length - 1 && <br />}
            </Fragment>
          ))}
          <br />
        </Fragment>
      ) : (
        <Fragment key={index}>
          {info}
          <br />
        </Fragment>
      )
    }
  )
  return [...identities, t((t) => t.vessel.clickToSeeMore)]
}
