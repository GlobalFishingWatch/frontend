/* eslint-disable @next/next/no-img-element */
import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { saveAs } from 'file-saver'

import type { VesselRegistryOwner } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { Tab, TabsProps } from '@globalfishingwatch/ui-components'
import { Icon, IconButton, Tabs, Tooltip } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate'
import type { VesselLastIdentity } from 'features/search/search.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import DataTerminology from 'features/vessel/identity/DataTerminology'
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
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsVesselLocation } from 'routes/routes.selectors'
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
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const { dispatchQueryParams } = useLocationConnect()
  const { setTimerange } = useTimerangeConnect()

  const vesselIdentity = getCurrentIdentityVessel(vesselData, {
    identityId,
    identitySource,
  })

  const onTabClick: TabsProps<VesselIdentitySourceEnum>['onTabClick'] = (tab) => {
    dispatchQueryParams({ vesselIdentitySource: tab.id })
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
        flag: t(`flags:${flag}`, flag) as string,
        shiptypes: getVesselShipTypeLabel(vesselIdentity, { joinCharacter: ' -' }), // Can't be commas as it would break the csv format
        geartypes: getVesselGearTypeLabel(vesselIdentity, { joinCharacter: ' -' }),
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
      const data = parseVesselToCSV(filteredVesselIdentity)
      const blob = new Blob([data], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${shipname}-${flag}.csv`)
      trackEvent({
        category: TrackCategory.VesselProfile,
        action: 'vessel_identity_download',
        label: identitySource,
      })
    }
  }

  const registryDisabled = !vesselData.identities.some(
    (i) => i.identitySource === VesselIdentitySourceEnum.Registry
  )
  const selfReportedIdentities = vesselData.identities.filter(
    (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
  )

  useEffect(() => {
    if (identitySource === VesselIdentitySourceEnum.Registry && registryDisabled) {
      dispatchQueryParams({
        vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
      })
    }
  }, [dispatchQueryParams, identitySource, registryDisabled])

  const identityTabs: Tab<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        title: (
          <span className={styles.tabTitle}>
            {t('vessel.infoSources.registry', 'Registry')}
            {identitySource === VesselIdentitySourceEnum.Registry && (
              <DataTerminology
                title={t('vessel.infoSources.registry', 'Registry')}
                terminologyKey="registryInfo"
              />
            )}
          </span>
        ),
        disabled: registryDisabled,
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        title: (
          <span className={styles.tabTitle}>
            {uniq(selfReportedIdentities.flatMap((i) => i.sourceCode || [])).join(',') || 'AIS'}
            {identitySource === VesselIdentitySourceEnum.SelfReported && (
              <DataTerminology
                title={t('vessel.infoSources.selfReported', 'Self Reported')}
                terminologyKey="selfReported"
              />
            )}
          </span>
        ),
        disabled: selfReportedIdentities.length === 0,
      },
    ],
    [identitySource, registryDisabled, selfReportedIdentities, t]
  )

  const identityFields = useMemo(() => {
    const source = vesselIdentity.sourceCode?.[0]
    const customIdentityFields = CUSTOM_VMS_IDENTITY_FIELD_GROUPS[source]
    return customIdentityFields?.length
      ? [...IDENTITY_FIELD_GROUPS[identitySource], ...customIdentityFields]
      : IDENTITY_FIELD_GROUPS[identitySource]
  }, [identitySource, vesselIdentity?.sourceCode])

  const hasMoreInfo = vesselIdentity?.hasComplianceInfo || vesselIdentity?.iuuStatus === 'Current'
  const registrySourceData = REGISTRY_SOURCES.find((s) => s.key === vesselIdentity.registrySource)

  return (
    <Fragment>
      <Tabs tabs={identityTabs} activeTab={identitySource} onTabClick={onTabClick} />
      <div className={styles.container}>
        <div className={cx(styles.fieldGroup)}>
          {identitySource === VesselIdentitySourceEnum.Registry && (
            <div>
              <label>{t('vessel.registrySources', 'Registry Sources')}</label>
              {vesselIdentity?.sourceCode ? (
                <VesselIdentityField
                  tooltip={vesselIdentity?.sourceCode?.join(', ')}
                  className={styles.help}
                  value={`${vesselIdentity?.sourceCode?.slice(0, 3).join(', ')}${
                    vesselIdentity?.sourceCode?.length > 3 ? '...' : ''
                  }`}
                />
              ) : (
                EMPTY_FIELD_PLACEHOLDER
              )}
            </div>
          )}
          <div className={styles.twoCells}>
            <label>{t(`common.date_other`, 'Dates')}</label>
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
                  tooltip={t('timebar.fitOnThisDates', 'Fit time range to these dates')}
                  className="print-hidden"
                  onClick={onTimeRangeClick}
                />
              )}
            </div>
          </div>
          <div className={styles.actionsContainer}>
            <UserLoggedIconButton
              type="border"
              icon="download"
              size="medium"
              className="print-hidden"
              onClick={onDownloadClick}
              tooltip={t('download.dataDownload', 'Download Data')}
              loginTooltip={t(
                'download.dataDownloadLogin',
                'Register and login to download vessel information (free, 2 minutes)'
              )}
              tooltipPlacement="top"
            />
          </div>
        </div>
        {vesselIdentity && (
          <div className={styles.fields}>
            {identityFields?.map((fieldGroup, index) => (
              <div key={index} className={cx(styles.fieldGroupContainer, styles.fieldGroup)}>
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
                  let value = vesselIdentity[key] as string
                  if (key === 'depthM' || key === 'builtYear') {
                    value = vesselIdentity[key]?.value?.toString()
                  }
                  return (
                    <div key={field.key}>
                      <div className={styles.labelContainer}>
                        <label>{t(`vessel.${label}` as any, label)}</label>
                        {field.terminologyKey && (
                          <DataTerminology
                            title={t(`vessel.${label}`, label) as string}
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
            ))}
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
                <div className={styles.extraInfoContainer}>
                  <img
                    src={registrySourceData?.logo}
                    alt={registrySourceData?.key}
                    className={styles.registrySourceLogo}
                  />
                  <div>
                    <label>{`${registrySourceData?.key} ${t(
                      `vessel.extraInfo`,
                      'has more information'
                    )}`}</label>
                    <p>{`${t(`vessel.extraInfo`, 'Request additional information at')} ${
                      registrySourceData?.contact
                    }`}</p>
                  </div>
                </div>
              )}
          </div>
        )}
        <VesselIdentitySelector />
      </div>
      {vesselIdentity?.ssvid && (
        <div className={styles.container}>
          <label>View in</label>
          <div className={styles.externalToolLinks}>
            <a
              href={`https://www.marinetraffic.com/${i18n.language}/ais/details/ships/mmsi:${vesselIdentity?.ssvid}`}
              target="_blank"
              rel="noreferrer"
            >
              Marine Traffic
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://app.triton.fish/search?name=${vesselIdentity?.ssvid}`}
              target="_blank"
              rel="noreferrer"
            >
              Triton
              <Icon icon="external-link" type="default" />
            </a>
            {/* TODO this Skylight link is broken */}
            {/* <a
            href={`https://sc-production.skylight.earth/vesseldetails/B:${vesselIdentity?.ssvid}`}
            target="_blank"
            rel="noreferrer"
          >
            Skylight
            <Icon icon="external-link" type="default" />
          </a> */}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default VesselIdentity
