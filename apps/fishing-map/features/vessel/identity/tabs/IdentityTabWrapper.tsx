import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import filesaver from 'file-saver'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/data-terminology/DataTerminology'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import VesselIdentityField from 'features/vessel/identity/fields/VesselIdentityField'
import VesselExternalToolLinks from 'features/vessel/identity/VesselExternalToolLinks'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { parseVesselToCSV } from 'features/vessel/vessel.download'
import {
  filterRegistryInfoByDateAndSSVID,
  getCurrentIdentityVessel,
  getLatestIdentityPrioritised,
} from 'features/vessel/vessel.utils'
import VesselInfoCorrection from 'features/workspace/vessels/VesselInfoCorrection'
import { selectIsVesselLocation } from 'router/routes.selectors'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import styles from '../VesselIdentity.module.css'

const IdentityTabWrapper = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)
  const { setTimerange } = useTimerangeConnect()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })
  const latestVesselIdentity = getLatestIdentityPrioritised(vesselData)

  const source = useMemo(() => vesselIdentity?.sourceCode, [vesselIdentity])

  const hasSsvid = !!vesselIdentity?.ssvid

  if (!vesselIdentity) {
    return null
  }

  const onTimeRangeClick = () => {
    setTimerange({
      start: vesselIdentity.transmissionDateFrom,
      end: vesselIdentity.transmissionDateTo,
    })
  }

  const onDownloadClick = () => {
    const timerange = {
      start: vesselIdentity.transmissionDateFrom,
      end: vesselIdentity.transmissionDateTo,
    }
    const { registryPublicAuthorizations, registryOwners, ssvid, shipname, flag } = vesselIdentity
    const filteredVesselIdentity = {
      ...vesselIdentity,
      nShipname: formatInfoField(shipname, 'shipname') as string,
      flag: t((t) => t[flag], { defaultValue: flag, ns: 'flags' }) as string,
      shiptypes: getVesselShipTypeLabel(vesselIdentity, { joinCharacter: ' -' }),
      geartypes: getVesselGearTypeLabel(vesselIdentity, { joinCharacter: ' -' }),
      registryPublicAuthorizations:
        identitySource === VesselIdentitySourceEnum.Registry
          ? registryPublicAuthorizations &&
            filterRegistryInfoByDateAndSSVID(registryPublicAuthorizations, timerange, ssvid)
          : undefined,
      registryOwners:
        identitySource === VesselIdentitySourceEnum.Registry
          ? registryOwners &&
            (filterRegistryInfoByDateAndSSVID(
              registryOwners,
              timerange,
              ssvid
            ) as VesselRegistryOwner[])
          : undefined,
    }
    const data = parseVesselToCSV(filteredVesselIdentity)
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
    filesaver.saveAs(blob, `${shipname}-${flag}.csv`)
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'vessel_identity_download',
      label: identitySource,
    })
  }

  return (
    <div className={styles.container}>
      <div className={cx(styles.fieldGroup)}>
        {identitySource === VesselIdentitySourceEnum.Registry && (
          <div>
            <div className={styles.labelContainer}>
              <label>{t((t) => t.vessel.registrySources)}</label>
              <DataTerminology
                title={t((t) => t.vessel.registrySources)}
                terminologyKey="registrySources"
              />
            </div>
            {source ? (
              <VesselIdentityField
                tooltip={source.filter(Boolean).join(', ')}
                className={styles.help}
                value={`${source.slice(0, 3).join(', ')}${source.length > 3 ? '...' : ''}`}
              />
            ) : (
              EMPTY_FIELD_PLACEHOLDER
            )}
          </div>
        )}
        <div className={styles.twoCells}>
          <label>{t((t) => t.common.date, { count: 2 })}</label>
          <div className={styles.timerange}>
            <VesselIdentityField
              value={`${formatI18nDate(vesselIdentity.transmissionDateFrom)} - ${formatI18nDate(
                vesselIdentity.transmissionDateTo
              )}`}
            />
            {isStandaloneVesselLocation && (
              <IconButton
                size="small"
                icon="fit-to-timerange"
                tooltip={t((t) => t.timebar.fitOnThisDates)}
                className="print-hidden"
                onClick={onTimeRangeClick}
              />
            )}
          </div>
        </div>
        <div className={styles.actionsContainer}>
          {(isJACUser || isGFWUser) && !source?.[0]?.includes('VMS') && <VesselInfoCorrection />}
          <UserLoggedIconButton
            type="border"
            icon="download"
            size="medium"
            className="print-hidden"
            onClick={onDownloadClick}
            tooltip={t((t) => t.download.identityDownload)}
            loginTooltip={t((t) => t.download.dataDownloadLogin)}
            tooltipPlacement="top"
          />
        </div>
      </div>
      <div className={styles.fields}>
        {children}
        {vesselIdentity && hasSsvid && (
          <VesselExternalToolLinks
            key="externalLinks"
            vesselIdentity={vesselIdentity}
            latestSsvid={latestVesselIdentity?.ssvid}
          />
        )}
      </div>
      <VesselIdentitySelector />
    </div>
  )
}

export default IdentityTabWrapper
