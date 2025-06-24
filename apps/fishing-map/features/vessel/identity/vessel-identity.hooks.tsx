import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { ChoiceOption, Tab } from '@globalfishingwatch/ui-components'

import DataTerminology from 'features/vessel/identity/DataTerminology'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import { selectVesselIdentitySource } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'

import styles from './VesselIdentity.module.css'

export function useVesselIdentities() {
  const vesselData = useSelector(selectVesselInfoData)
  const identitySource = useSelector(selectVesselIdentitySource)
  const registryDisabled = !vesselData.identities.some(
    (i) => i.identitySource === VesselIdentitySourceEnum.Registry
  )
  const selfReportedIdentities = vesselData.identities.filter(
    (i) => i.identitySource === VesselIdentitySourceEnum.SelfReported
  )

  return { identitySource, registryDisabled, selfReportedIdentities }
}

export function useVesselIdentityTabs() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const { identitySource, registryDisabled, selfReportedIdentities } = useVesselIdentities()

  const identityTabs: Tab<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        title: (
          <span className={styles.tabTitle}>
            {t('vessel.infoSources.registry')}
            {identitySource === VesselIdentitySourceEnum.Registry && (
              <DataTerminology
                title={t('vessel.infoSources.registry')}
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
                title={t('vessel.infoSources.selfReported')}
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

  useEffect(() => {
    if (identitySource === VesselIdentitySourceEnum.Registry && registryDisabled) {
      dispatchQueryParams({
        vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
      })
    }
  }, [dispatchQueryParams, identitySource, registryDisabled])

  return useMemo(
    () => ({ identityTabs, selfReportedIdentities, registryDisabled }),
    [identityTabs, registryDisabled, selfReportedIdentities]
  )
}

export function useVesselIdentityChoice() {
  const { t } = useTranslation()
  const { registryDisabled, selfReportedIdentities } = useVesselIdentities()

  const identitySources: ChoiceOption<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        label: t('vessel.infoSources.registry'),
        disabled: registryDisabled,
      },
      {
        id: VesselIdentitySourceEnum.SelfReported,
        label: uniq(selfReportedIdentities.flatMap((i) => i.sourceCode || [])).join(',') || 'AIS',
        disabled: selfReportedIdentities.length === 0,
      },
    ],
    [registryDisabled, selfReportedIdentities, t]
  )

  return identitySources
}
