import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import type {
  RegistryExtraFieldValue,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED } from '@globalfishingwatch/api-types'

import DataTerminology from 'features/data-terminology/DataTerminology'
import type { VesselLastIdentity } from 'features/search/search.slice'
import VesselIdentityField from 'features/vessel/identity/fields/VesselIdentityField'
import VesselTypesField from 'features/vessel/identity/fields/VesselTypesField'
import {
  AIS_SELF_REPORTED_SHIPTYPE,
  type IdentitySection,
  type VesselRenderField,
} from 'features/vessel/identity/vessel-identity.config'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

import styles from '../VesselIdentity.module.css'

type VesselIdentityFieldsProps = {
  fields: IdentitySection['fields']
  label: IdentitySection['sectionLabel']
  terminologyKey: IdentitySection['terminologyKey']
  vesselIdentity: VesselLastIdentity
  identitySource: VesselIdentitySourceEnum
  isVMS?: boolean
  isChileanVMS?: boolean
  isBrazilVMS?: boolean
}

const resolveFieldValue = (
  field: VesselRenderField,
  vesselIdentity: VesselLastIdentity,
  isChileanVMS?: boolean
): string => {
  const key = field.key as keyof VesselLastIdentity
  if (isChileanVMS && key === 'ssvid') return EMPTY_FIELD_PLACEHOLDER
  if (field.key === AIS_SELF_REPORTED_SHIPTYPE) {
    return vesselIdentity?.combinedSourcesInfo?.onFishingListSr?.[0]?.value ? 'fishing' : 'other'
  }
  if (key === 'depthM' || key === 'builtYear') {
    const raw = vesselIdentity[key] as RegistryExtraFieldValue<number> | string
    if (raw === API_LOGIN_REQUIRED) return API_LOGIN_REQUIRED
    return (
      (raw as RegistryExtraFieldValue<number>)?.value?.toString() ||
      (typeof raw === 'string' ? raw : '') ||
      EMPTY_FIELD_PLACEHOLDER
    )
  }
  return vesselIdentity[key] as string
}

const VesselIdentityFields = ({
  fields,
  label,
  terminologyKey,
  vesselIdentity,
  identitySource,
  isChileanVMS,
  isBrazilVMS,
}: VesselIdentityFieldsProps) => {
  const { t } = useTranslation()

  const fieldGroups = fields?.map((fieldGroup, index) => (
    <div
      key={index}
      className={cx(styles.fieldGroupContainer, styles.fieldGroup, {
        [styles.twoColumns]: fieldGroup.length === 2,
      })}
    >
      {fieldGroup.map((field) => {
        const label = field.label || field.key
        const key = field.key as keyof VesselLastIdentity
        const value = resolveFieldValue(field, vesselIdentity, isChileanVMS)
        const labelTranslation = t((t: any) => t.vessel[label], { defaultValue: label })
        return (
          <div key={field.key}>
            <div className={styles.labelContainer}>
              <label>{labelTranslation}</label>
              {field.terminologyKey && !field.renderPlain && (
                <DataTerminology
                  terminologyKey={
                    isBrazilVMS &&
                    (field.terminologyKey === 'shiptype' || field.terminologyKey === 'geartype')
                      ? `${field.terminologyKey}BRA`
                      : field.terminologyKey
                  }
                />
              )}
            </div>
            {(key === 'shiptypes' || key === 'geartypes') && !field.renderPlain ? (
              <VesselTypesField
                vesselIdentity={vesselIdentity}
                fieldKey={key}
                identitySource={identitySource}
              />
            ) : (
              <VesselIdentityField value={formatInfoField(value, label as any) as string} />
            )}
          </div>
        )
      })}
    </div>
  ))

  if (label) {
    return (
      <div className={styles.identitySection}>
        <div className={styles.sectionHeader}>
          <label>{t((t: any) => t.vessel[label!])}</label>
          {terminologyKey && <DataTerminology terminologyKey={terminologyKey} />}
        </div>
        <div className={styles.sectionContent}>{fieldGroups}</div>
      </div>
    )
  }

  return <Fragment>{fieldGroups}</Fragment>
}

export default VesselIdentityFields
