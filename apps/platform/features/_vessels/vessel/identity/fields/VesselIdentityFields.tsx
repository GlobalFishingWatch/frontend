import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type {
  CombinedSourceInfo,
  RegistryExtraFieldValue,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED } from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import { getIsCombinedSourceInTimerange } from 'features/_vessels/vessel/identity/fields/vessel-identity.utils'
import VesselIdentityField from 'features/_vessels/vessel/identity/fields/VesselIdentityField'
import VesselTypesField from 'features/_vessels/vessel/identity/fields/VesselTypesField'
import {
  AIS_SELF_REPORTED_SHIPTYPE,
  COMBINED_SOURCE_VALUE_FIELDS,
  type IdentitySection,
  type VesselRenderField,
} from 'features/_vessels/vessel/identity/vessel-identity.config'
import { selectShowPipe5IdentityFields } from 'features/_vessels/vessel/vessel.config.selectors'
import DataTerminology from 'features/cms/data-terminology/DataTerminology'
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

type CombinedSourceValueField = (typeof COMBINED_SOURCE_VALUE_FIELDS)[number]

const resolveFieldValue = (
  field: VesselRenderField,
  vesselIdentity: VesselLastIdentity,
  isChileanVMS?: boolean
): string | number => {
  const key = field.key as keyof VesselLastIdentity
  if (isChileanVMS && key === 'ssvid') return EMPTY_FIELD_PLACEHOLDER
  if (field.key === AIS_SELF_REPORTED_SHIPTYPE) {
    return vesselIdentity?.combinedSourcesInfo?.onFishingListSr?.[0]?.value ? 'fishing' : 'other'
  }
  if (COMBINED_SOURCE_VALUE_FIELDS.includes(key as CombinedSourceValueField)) {
    const sources =
      vesselIdentity?.combinedSourcesInfo?.[key as CombinedSourceValueField] ||
      ([] as CombinedSourceInfo[])
    const source = sources.find((s) => getIsCombinedSourceInTimerange(vesselIdentity, s))
    const value = source?.value
    if (value === API_LOGIN_REQUIRED) return API_LOGIN_REQUIRED
    // an explicit placeholder, otherwise formatInfoField formats the empty value as NaN
    if (value === undefined) return EMPTY_FIELD_PLACEHOLDER
    // numbers must stay numbers: formatInfoField only routes those through formatI18nNumber,
    // which rounds to 2 decimals and adds thousands separators. Strings pass through raw.
    return typeof value === 'boolean' ? value.toString() : value
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
  const showPipe5Fields = useSelector(selectShowPipe5IdentityFields)

  // pipe 4 doesn't publish these, so drop the rows entirely rather than rendering empty ones
  const visibleFields = showPipe5Fields
    ? fields
    : fields
        ?.map((fieldGroup) =>
          fieldGroup.filter(
            (field) => !COMBINED_SOURCE_VALUE_FIELDS.includes(field.key as CombinedSourceValueField)
          )
        )
        .filter((fieldGroup) => fieldGroup.length > 0)

  const fieldGroups = visibleFields?.map((fieldGroup, index) => (
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
      <div
        className={styles.identitySection}
        data-testid={`identity-section-${label.toLowerCase()}`}
      >
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
