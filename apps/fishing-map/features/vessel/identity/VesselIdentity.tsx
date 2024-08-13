import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { saveAs } from 'file-saver'
import { Fragment, useEffect, useMemo } from 'react'
import { uniq } from 'es-toolkit'
import { IconButton, Tab, Tabs, TabsProps, Tooltip } from '@globalfishingwatch/ui-components'
import { VesselRegistryOwner, VesselRegistryProperty } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import I18nDate, { formatI18nDate } from 'features/i18n/i18nDate'
import {
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  IDENTITY_FIELD_GROUPS,
  REGISTRY_FIELD_GROUPS,
} from 'features/vessel/vessel.config'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearType,
  getVesselShipType,
} from 'utils/info'
import {
  filterRegistryInfoByDateAndSSVID,
  getCurrentIdentityVessel,
} from 'features/vessel/vessel.utils'
import { parseVesselToCSV } from 'features/vessel/vessel.download'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import VesselIdentitySelector from 'features/vessel/identity/VesselIdentitySelector'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import { useLocationConnect } from 'routes/routes.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsVesselLocation } from 'routes/routes.selectors'
import { useRegionTranslationsById } from 'features/regions/regions.hooks'
import { VesselLastIdentity } from 'features/search/search.slice'
import VesselIdentityCombinedSourceField from 'features/vessel/identity/VesselIdentityCombinedSourceField'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import styles from './VesselIdentity.module.css'

const VesselIdentity = () => {
  const { t } = useTranslation()
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isStandaloneVesselLocation = useSelector(selectIsVesselLocation)
  const { getRegionTranslationsById } = useRegionTranslationsById()
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
        shiptypes: getVesselShipType(vesselIdentity, { joinCharacter: ' -' }), // Can't be commas as it would break the csv format
        geartypes: getVesselGearType(vesselIdentity, { joinCharacter: ' -' }),
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
                size="tiny"
                type="default"
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
                size="tiny"
                type="default"
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

  return (
    <Fragment>
      <Tabs tabs={identityTabs} activeTab={identitySource} onTabClick={onTabClick} />
      <div className={styles.container}>
        <div className={cx(styles.fieldGroup)}>
          {identitySource === VesselIdentitySourceEnum.Registry && (
            <div>
              <label>{t('vessel.registrySources', 'Registry Sources')}</label>
              {vesselIdentity?.sourceCode ? (
                <Tooltip content={vesselIdentity?.sourceCode?.join(', ')}>
                  <VesselIdentityField
                    className={styles.help}
                    value={`${vesselIdentity?.sourceCode?.slice(0, 3).join(', ')}${
                      vesselIdentity?.sourceCode?.length > 3 ? '...' : ''
                    }`}
                  />
                </Tooltip>
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
                  return (
                    <div key={field.key}>
                      <div className={styles.labelContainer}>
                        <label>{t(`vessel.${label}` as any, label)}</label>
                        {field.terminologyKey && (
                          <DataTerminology
                            size="tiny"
                            type="default"
                            title={t(`vessel.${label}`, label) as string}
                            terminologyKey={field.terminologyKey}
                          />
                        )}
                      </div>
                      {vesselIdentity.combinedSourcesInfo &&
                      (key === 'shiptypes' || key === 'geartypes') ? (
                        <VesselIdentityCombinedSourceField
                          identity={vesselIdentity}
                          property={key}
                        />
                      ) : (
                        <VesselIdentityField
                          value={formatInfoField(vesselIdentity[key] as string, label) as string}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {identitySource === VesselIdentitySourceEnum.Registry &&
              REGISTRY_FIELD_GROUPS.map(({ key, label, terminologyKey }, index) => {
                const allRegistryInfo = vesselIdentity[key]
                if (!allRegistryInfo) return null
                const timerange = {
                  start: vesselIdentity.transmissionDateFrom,
                  end: vesselIdentity.transmissionDateTo,
                }
                const filteredRegistryInfo = filterRegistryInfoByDateAndSSVID(
                  vesselIdentity[key] as VesselRegistryProperty[],
                  timerange,
                  vesselIdentity.ssvid
                )
                if (!filteredRegistryInfo) return null
                return (
                  <div className={styles.fieldGroupContainer} key={key}>
                    <div className={styles.labelContainer}>
                      <label className={styles.twoCells}>{t(`vessel.${label}`, label || '')}</label>
                      {terminologyKey && (
                        <DataTerminology
                          size="tiny"
                          type="default"
                          title={t(`vessel.${label}`, label || '')}
                          terminologyKey={terminologyKey}
                        />
                      )}
                    </div>
                    {allRegistryInfo?.length > 0 ? (
                      <ul
                        className={cx(styles.fieldGroup, styles.twoColumns)}
                        style={
                          key === 'registryPublicAuthorizations'
                            ? {
                                gridTemplateRows: `repeat(${Math.ceil(
                                  filteredRegistryInfo.length / 2
                                )}, 1fr)`,
                              }
                            : undefined
                        }
                      >
                        {allRegistryInfo.map((registry, index) => {
                          const registryOverlapsTimeRange = filteredRegistryInfo.includes(registry)
                          const fieldType = key === 'registryOwners' ? 'owner' : 'authorization'
                          let Component = <VesselIdentityField value="" />
                          if (registryOverlapsTimeRange) {
                            if (fieldType === 'owner') {
                              const value = `${formatInfoField(
                                (registry as VesselRegistryOwner).name,
                                'owner'
                              )} (${formatInfoField(
                                (registry as VesselRegistryOwner).flag,
                                'flag'
                              )})`
                              Component = <VesselIdentityField value={value} />
                            } else {
                              const sourceTranslations = (registry.sourceCode as any[])
                                .map(getRegionTranslationsById)
                                .join(',')
                              Component = (
                                <Tooltip content={sourceTranslations}>
                                  <VesselIdentityField
                                    className={styles.help}
                                    value={
                                      formatInfoField(
                                        registry.sourceCode.join(','),
                                        fieldType
                                      ) as string
                                    }
                                  />
                                </Tooltip>
                              )
                            }
                          }
                          return (
                            <li
                              key={`${registry.recordId}-${index}`}
                              className={cx({
                                [styles.twoCells]: key === 'registryOwners',
                                [styles.hidden]: !registryOverlapsTimeRange,
                              })}
                            >
                              {Component}{' '}
                              <span className={styles.secondary}>
                                <I18nDate date={registry.dateFrom} /> -{' '}
                                <I18nDate date={registry.dateTo} />
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    ) : (
                      EMPTY_FIELD_PLACEHOLDER
                    )}
                  </div>
                )
              })}
          </div>
        )}
        <VesselIdentitySelector />
      </div>
    </Fragment>
  )
}

export default VesselIdentity
