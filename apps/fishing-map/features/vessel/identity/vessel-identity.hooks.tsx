import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import { SelfReportedSource, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { DATASET_PRIVATE_PREFIX, VMS_DATASET_ID } from '@globalfishingwatch/datasets-client'
import type { ChoiceOption, Tab } from '@globalfishingwatch/ui-components'

import DataTerminology from 'features/data-terminology/DataTerminology'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import { selectHasTMTPermission } from 'features/user/selectors/user.permissions.selectors'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import type {
  IdentitySection,
  VesselRenderContext,
} from 'features/vessel/identity/vessel-identity.config'
import {
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  FULL_IDENTITY_LAYOUT,
  IDENTITY_FIELD_GROUPS,
} from 'features/vessel/identity/vessel-identity.config'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselDatasetId,
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import { useReplaceQueryParams } from 'router/routes.hook'

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
  const { identitySource, registryDisabled, selfReportedIdentities } = useVesselIdentities()
  const { replaceQueryParams } = useReplaceQueryParams()

  const identityTabs: Tab<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        title: (
          <span className={styles.tabTitle}>
            {t((t) => t.vessel.infoSources.registry)}
            {identitySource === VesselIdentitySourceEnum.Registry && (
              <DataTerminology
                title={t((t) => t.vessel.infoSources.registry)}
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
                title={t((t) => t.vessel.infoSources.selfReported)}
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
      replaceQueryParams({
        vesselIdentitySource: VesselIdentitySourceEnum.SelfReported,
      })
    }
  }, [identitySource, registryDisabled])

  return useMemo(
    () => ({ identityTabs, selfReportedIdentities, registryDisabled }),
    [identityTabs, registryDisabled, selfReportedIdentities]
  )
}

export function useVesselIdentityLayout(): IdentitySection[] {
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const vesselDatasetId = useSelector(selectVesselDatasetId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isGFWUser = useSelector(selectIsGFWUser)
  const isJACUser = useSelector(selectIsJACUser)
  const hasTMTPermission = useSelector(selectHasTMTPermission)

  return useMemo(() => {
    const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })

    const isVMS = !!vesselIdentity?.sourceCode?.some((s) =>
      s.toUpperCase().includes(VMS_DATASET_ID.toUpperCase())
    )
    const isChileanVMS =
      !!vesselIdentity?.sourceCode?.includes(SelfReportedSource.Chile) ||
      vesselIdentity?.flag === 'CHL'
    const isBrazilVMS = !!vesselIdentity?.sourceCode?.includes(SelfReportedSource.Brazil)
    const hasMoreInfo =
      !!vesselIdentity?.hasComplianceInfo ||
      vesselIdentity?.iuuStatus?.value?.toUpperCase() === 'CURRENT'
    const hasSsvid = !!vesselIdentity?.ssvid
    const privateDs = isPrivateDataset({ id: vesselDatasetId })

    const ctx: VesselRenderContext = {
      identitySource,
      isVMS,
      isChileanVMS,
      isBrazilVMS,
      isGFWUser: isGFWUser ?? false,
      isJACUser: isJACUser ?? false,
      hasTMTPermission,
      isPrivateDataset: privateDs,
      hasMoreInfo,
      hasSsvid,
    }

    const activeSections = FULL_IDENTITY_LAYOUT.filter(
      (section) => !section.condition || section.condition(ctx)
    )

    // For VMS sections, replace the generic fields with country-specific ones when available
    return activeSections.map((section) => {
      if (section.type !== 'fields' || section.key !== 'selfReportedVMS') return section
      const baseSource = vesselIdentity?.sourceCode?.[0] as SelfReportedSource
      const privateSource = `${baseSource}-${DATASET_PRIVATE_PREFIX}` as SelfReportedSource
      const customFields = privateDs
        ? CUSTOM_VMS_IDENTITY_FIELD_GROUPS[privateSource] ||
          CUSTOM_VMS_IDENTITY_FIELD_GROUPS[baseSource]
        : CUSTOM_VMS_IDENTITY_FIELD_GROUPS[baseSource]
      if (!customFields?.length) return section
      return {
        ...section,
        fields: [...IDENTITY_FIELD_GROUPS[VesselIdentitySourceEnum.SelfReported], ...customFields],
      }
    })
  }, [
    vesselData,
    identityId,
    vesselDatasetId,
    identitySource,
    isGFWUser,
    isJACUser,
    hasTMTPermission,
  ])
}

export function useVesselIdentityChoice() {
  const { t } = useTranslation()
  const { registryDisabled, selfReportedIdentities } = useVesselIdentities()

  const identitySources: ChoiceOption<VesselIdentitySourceEnum>[] = useMemo(
    () => [
      {
        id: VesselIdentitySourceEnum.Registry,
        label: t((t) => t.vessel.infoSources.registry),
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
