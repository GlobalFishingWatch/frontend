/* eslint-disable @next/next/no-img-element */
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import filesaver from 'file-saver'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import {
  API_LOGIN_REQUIRED,
  SelfReportedSource,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import type { TabsProps } from '@globalfishingwatch/ui-components'
import { Icon, IconButton, Tabs, Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { VesselLastIdentity } from 'features/search/search.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { useVesselIdentityTabs } from 'features/vessel/identity/vessel-identity.hooks'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  IDENTITY_FIELD_GROUPS,
  REGISTRY_FIELD_GROUPS,
  REGISTRY_SOURCES,
} from 'features/vessel/vessel.config'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { parseVesselToCSV } from 'features/vessel/vessel.download'
import {
  filterRegistryInfoByDateAndSSVID,
  getCurrentIdentityVessel,
} from 'features/vessel/vessel.utils'
import VesselInfoCorrection from 'features/workspace/vessels/VesselInfoCorrection'
import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsVesselLocation } from 'router/routes.selectors'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import VesselRegistryField from './VesselRegistryField'
import VesselTypesField from './VesselTypesField'

import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t, i18n } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const { setTimerange } = useTimerangeConnect()
  const { identityTabs } = useVesselIdentityTabs()
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityId,
    identitySource,
  })

  const onTabClick: TabsProps<VesselIdentitySourceEnum>['onTabClick'] = (tab) => {
    replaceQueryParams({ vesselIdentitySource: tab.id })
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'click_vessel_source_tab',
      label: tab.id,
    })
  }

  const onTimeRangeClick = () => {
    setTimerange({
      start: vesselIdentity.transmissionDateFrom,
      end: vesselIdentity.transmissionDateTo,
    })
  }

  const onDownloadClick = () => {
    if (vesselIdentity) {
      const timerange = {
        start: vesselIdentity.transmissionDateFrom,
        end: vesselIdentity.transmissionDateTo,
      }
      const { registryPublicAuthorizations, registryOwners, ssvid, shipname, flag } = vesselIdentity
      const filteredVesselIdentity = {
        ...vesselIdentity,
        nShipname: formatInfoField(shipname, 'shipname') as string,
        flag: t((t) => t[flag], {
          defaultValue: flag,
          ns: 'flags',
        }) as string,
        shiptypes: getVesselShipTypeLabel(vesselIdentity, { joinCharacter: ' -' }), // Can't be commas as it would break the csv format
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
  }

  const source = vesselIdentity?.sourceCode

  const identityFields = useMemo(() => {
    const customIdentityFields = CUSTOM_VMS_IDENTITY_FIELD_GROUPS[source?.[0]]
    return customIdentityFields?.length
      ? [...IDENTITY_FIELD_GROUPS[identitySource], ...customIdentityFields]
      : IDENTITY_FIELD_GROUPS[identitySource]
  }, [identitySource, source])

  const isChileanVMSVessel =
    source?.includes(SelfReportedSource.Chile) || vesselIdentity?.flag === 'CHL'
  const hasMoreInfo =
    vesselIdentity?.hasComplianceInfo ||
    vesselIdentity?.iuuStatus?.value?.toUpperCase() === 'CURRENT'
  const registrySourceData = REGISTRY_SOURCES.find((s) => s.key === vesselIdentity.registrySource)

  return (
    <Fragment>
      <Tabs tabs={identityTabs} activeTab={identitySource} onTabClick={onTabClick} />
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
                  tooltip={source?.filter(Boolean)?.join(', ')}
                  className={styles.help}
                  value={`${source?.slice(0, 3).join(', ')}${source?.length > 3 ? '...' : ''}`}
                />
              ) : (
                EMPTY_FIELD_PLACEHOLDER
              )}
            </div>
          )}
          <div className={styles.twoCells}>
            <label>
              {t((t) => t.common.date, {
                count: 2,
              })}
            </label>
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
            {identityFields?.map((fieldGroup, index) => {
              const showExpandableGearTypes =
                isGFWUser &&
                identitySource === VesselIdentitySourceEnum.SelfReported &&
                fieldGroup.some((field) => field.key === 'shiptypes' || field.key === 'geartypes')
              return (
                <div
                  key={index}
                  className={cx(styles.fieldGroupContainer, styles.fieldGroup, {
                    [styles.secondColumnLarger]: showExpandableGearTypes,
                  })}
                >
                  {/* TODO: make fields more dynamic to account for VMS */}
                  {fieldGroup.map((field) => {
                    let label = field.label || field.key
                    if (
                      identitySource === VesselIdentitySourceEnum.SelfReported &&
                      (label === 'geartypes' || label === 'shiptypes')
                    ) {
                      label = 'gfw_' + label
                    }
                    const key = field.key as keyof VesselLastIdentity
                    let value =
                      isChileanVMSVessel && key === 'ssvid' ? '--' : (vesselIdentity[key] as string)
                    if (key === 'depthM' || key === 'builtYear') {
                      value =
                        (vesselIdentity[key] as any) === API_LOGIN_REQUIRED
                          ? API_LOGIN_REQUIRED
                          : vesselIdentity[key]?.value?.toString()
                    }
                    const labelTranslation = t((t: any) => t.vessel[label], { defaultValue: label })
                    return (
                      <div key={field.key}>
                        <div className={styles.labelContainer}>
                          <label>{labelTranslation}</label>
                          {field.terminologyKey && (
                            <DataTerminology
                              title={labelTranslation}
                              terminologyKey={field.terminologyKey}
                            />
                          )}
                        </div>
                        {key === 'shiptypes' || key === 'geartypes' ? (
                          <VesselTypesField
                            vesselIdentity={vesselIdentity}
                            fieldKey={key}
                            identitySource={identitySource}
                          />
                        ) : (
                          <VesselIdentityField
                            value={formatInfoField(value, label as any) as string}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
            {identitySource === VesselIdentitySourceEnum.Registry &&
              REGISTRY_FIELD_GROUPS.map((registryField) => {
                return (
                  <VesselRegistryField
                    key={registryField.key}
                    registryField={registryField}
                    vesselIdentity={vesselIdentity}
                  />
                )
              })}
            {identitySource === VesselIdentitySourceEnum.Registry &&
              hasMoreInfo &&
              registrySourceData && (
                <div className={cx(styles.extraInfoContainer, 'print-hidden')}>
                  <img
                    src={registrySourceData?.logo}
                    alt={registrySourceData?.key}
                    className={styles.registrySourceLogo}
                  />
                  <Tooltip content={t((t) => t.vessel.extraInfoTooltip)}>
                    <div>
                      <label>{t((t) => t.vessel.extraInfo)}</label>
                      <a href={`mailto:${registrySourceData?.contact}`} target="_blank">
                        {registrySourceData?.contact}
                      </a>
                    </div>
                  </Tooltip>
                </div>
              )}
          </div>
        )}
        <VesselIdentitySelector />
      </div>
      {vesselIdentity?.ssvid && (
        <div className={styles.container}>
          <label>{t((t) => t.common.viewIn)}</label>
          <div className={styles.externalToolLinks}>
            <a
              href={`https://www.marinetraffic.com/${i18n.language}/data/?asset_type=vessels&mmsi=${vesselIdentity?.ssvid}`}
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: TrackCategory.VesselProfile,
                  action: 'click_marine_traffic_link',
                })
              }}
            >
              Marine Traffic
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://sc-production.skylight.earth/vesselsearch?mmsi=${vesselIdentity?.ssvid}`}
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: TrackCategory.VesselProfile,
                  action: 'click_skylight_link',
                })
              }}
            >
              Skylight
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://app.triton.fish/search?${vesselIdentity?.imo ? `imo=${vesselIdentity.imo}` : `name=${vesselIdentity?.ssvid}`}`}
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: TrackCategory.VesselProfile,
                  action: 'click_triton_link',
                })
              }}
            >
              Triton
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://cravt.imcsnet.org/browse-vessels?keywords=${vesselIdentity?.imo || vesselIdentity?.callsign || vesselIdentity?.shipname || vesselIdentity?.nShipname}`}
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: TrackCategory.VesselProfile,
                  action: 'click_cravt_link',
                })
              }}
            >
              CRAVT
              <Icon icon="external-link" type="default" />
            </a>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default VesselIdentity
