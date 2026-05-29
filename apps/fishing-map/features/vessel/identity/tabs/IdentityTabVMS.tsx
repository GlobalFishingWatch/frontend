import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { SelfReportedSource } from '@globalfishingwatch/api-types'
import { DATASET_PRIVATE_PREFIX } from '@globalfishingwatch/datasets-client'

import { isPrivateDataset } from 'features/datasets/datasets.utils'
import {
  AIS_SELF_REPORTED_FIELDS,
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  VMS_BASE_IDENTITY_LAYOUT,
} from 'features/vessel/identity/vessel-identity.config'
import { selectVesselInfoData } from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselDatasetId,
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'

import VesselIdentityFields from '../fields/VesselIdentityFields'

const VMSIdentityTab = () => {
  const vesselData = useSelector(selectVesselInfoData)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const vesselDatasetId = useSelector(selectVesselDatasetId)

  const vesselIdentity = getCurrentIdentityVessel(vesselData, { identityId, identitySource })

  const isChileanVMS =
    !!vesselIdentity?.sourceCode?.includes(SelfReportedSource.Chile) ||
    vesselIdentity?.flag === 'CHL'
  const isBrazilVMS = !!vesselIdentity?.sourceCode?.includes(SelfReportedSource.Brazil)
  const privateDs = isPrivateDataset({ id: vesselDatasetId })

  const layout = useMemo(() => {
    const baseSource = vesselIdentity?.sourceCode?.[0] as SelfReportedSource
    const privateSource = `${baseSource}-${DATASET_PRIVATE_PREFIX}` as SelfReportedSource
    const customFields = privateDs
      ? CUSTOM_VMS_IDENTITY_FIELD_GROUPS[privateSource] ||
        CUSTOM_VMS_IDENTITY_FIELD_GROUPS[baseSource]
      : CUSTOM_VMS_IDENTITY_FIELD_GROUPS[baseSource]
    if (!customFields?.length) return VMS_BASE_IDENTITY_LAYOUT
    return VMS_BASE_IDENTITY_LAYOUT.map((s) =>
      s.type === 'fields' && s.key === 'selfReportedVMS'
        ? { ...s, fields: [...AIS_SELF_REPORTED_FIELDS, ...customFields] }
        : s
    )
  }, [vesselIdentity, privateDs])

  return layout.map((section) => {
    if (section.type === 'fields') {
      return (
        <VesselIdentityFields
          key={section.key}
          fields={section.fields}
          label={section.sectionLabel}
          terminologyKey={section.terminologyKey}
          vesselIdentity={vesselIdentity}
          identitySource={identitySource}
          isVMS
          isChileanVMS={isChileanVMS}
          isBrazilVMS={isBrazilVMS}
        />
      )
    }
    return null
  })
}

export default VMSIdentityTab
