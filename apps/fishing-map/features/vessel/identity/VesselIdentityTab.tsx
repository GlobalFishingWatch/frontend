import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import filesaver from 'file-saver'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { SelfReportedSource, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { VMS_DATASET_ID } from '@globalfishingwatch/datasets-client'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import DataTerminology from 'features/data-terminology/DataTerminology'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import VesselIdentityField from 'features/vessel/identity/fields/VesselIdentityField'
import {
  type IdentityFieldSection,
  REGISTRY_SOURCES,
} from 'features/vessel/identity/vessel-identity.config'
import { useVesselIdentityLayout } from 'features/vessel/identity/vessel-identity.hooks'
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

import VesselIdentityFields from './fields/VesselIdentityFields'
import VesselRegistryContact from './fields/VesselRegistryContact'
import VesselRegistryField from './fields/VesselRegistryField'

import styles from './VesselIdentity.module.css'

const VesselIdentityTab = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)
  const { setTimerange } = useTimerangeConnect()
  const activeSections = useVesselIdentityLayout()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })
  const latestVesselIdentity = getLatestIdentityPrioritised(vesselData)

  const source = useMemo(() => vesselIdentity?.sourceCode, [vesselIdentity])

  const isVMS = vesselIdentity?.sourceCode?.some((s) =>
    s.toUpperCase().includes(VMS_DATASET_ID.toUpperCase())
  )
  const isChileanVMS = source?.includes(SelfReportedSource.Chile) || vesselIdentity?.flag === 'CHL'
  const isBrazilVMS = source?.includes(SelfReportedSource.Brazil)
  const registrySourceData = REGISTRY_SOURCES.find((s) => s.key === vesselIdentity.registrySource)

  const showSections = activeSections.some(
    (s): s is IdentityFieldSection =>
      s.type === 'fields' && !!('sectionLabel' in s && s.sectionLabel)
  )

  const onTimeRangeClick = () => {
    setTimerange({
      start: vesselIdentity.transmissionDateFrom,
      end: vesselIdentity.transmissionDateTo,
    })
  }

  const onDownloadClick = () => {
    if (!vesselIdentity) return
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
      ...(identitySource === VesselIdentitySourceEnum.Registry
        ? {
            registryPublicAuthorizations:
              registryPublicAuthorizations &&
              filterRegistryInfoByDateAndSSVID(registryPublicAuthorizations, timerange, ssvid),
            registryOwners:
              registryOwners &&
              (filterRegistryInfoByDateAndSSVID(
                registryOwners,
                timerange,
                ssvid
              ) as VesselRegistryOwner[]),
          }
        : { registryPublicAuthorizations: undefined, registryOwners: undefined }),
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
    <div className={cx(styles.container, { [styles.tightPadding]: showSections })}>
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
        <div
          className={cx(styles.twoCells, {
            [styles.sectionContent]: showSections,
            [styles.fieldGroupContainer]: showSections,
          })}
        >
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
          {(isJACUser || isGFWUser) && !source?.[0].includes('VMS') && <VesselInfoCorrection />}
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
      {vesselIdentity && (
        <div className={styles.fields}>
          {activeSections.map((section) => {
            if (section.type === 'fields') {
              return (
                <VesselIdentityFields
                  key={section.key}
                  section={section}
                  vesselIdentity={vesselIdentity}
                  identitySource={identitySource}
                  isVMS={isVMS}
                  isChileanVMS={isChileanVMS}
                  isBrazilVMS={isBrazilVMS}
                />
              )
            }
            if (section.type === 'registry') {
              return (
                <VesselRegistryField
                  key={section.key}
                  registryField={section.registryField}
                  vesselIdentity={vesselIdentity}
                />
              )
            }
            if (section.type === 'registryContact') {
              return (
                <VesselRegistryContact key="registryContact" registrySource={registrySourceData} />
              )
            }
            if (section.type === 'externalLinks') {
              return (
                <VesselExternalToolLinks
                  key="externalLinks"
                  vesselIdentity={vesselIdentity}
                  latestSsvid={latestVesselIdentity?.ssvid}
                  showSections={showSections}
                />
              )
            }
            return null
          })}
        </div>
      )}
      <VesselIdentitySelector />
    </div>
  )
}

export default VesselIdentityTab
