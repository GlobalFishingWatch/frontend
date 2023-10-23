import cx from 'classnames'
import { useSelector } from 'react-redux'
import { serverT } from 'server/i18n'
import { Logo } from '@globalfishingwatch/ui-components'
import { SourceCode } from '@globalfishingwatch/api-types'
import { selectVesselInfoData, selectVesselInfoStatus } from 'features/vessel/vessel.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  CUSTOM_VMS_IDENTITY_FIELD_GROUPS,
  IDENTITY_FIELD_GROUPS,
} from 'features/vessel/vessel.config'
import { formatInfoField } from 'utils/info'
import { getCurrentIdentityVessel, getOtherVesselNames } from 'features/vessel/vessel.utils'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { VesselLastIdentity } from 'features/search/search.slice'
import VesselIdentityCombinedSourceField from 'features/vessel/identity/VesselIdentityCombinedSourceField'
import VesselIdentityField from 'features/vessel/identity/VesselIdentityField'
import styles from './styles.module.css'

const VesselServerComponent = () => {
  const infoStatus = useSelector(selectVesselInfoStatus)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const vessel = useSelector(selectVesselInfoData)
  const vesselIdentity = getCurrentIdentityVessel(vessel, {
    identityId,
    identitySource,
  })

  if (infoStatus !== AsyncReducerStatus.Finished) {
    return null
  }

  const { shipname, nShipname } = vesselIdentity
  const otherNamesLabel = getOtherVesselNames(vessel, nShipname)

  const source = vesselIdentity.sourceCode?.[0] as SourceCode
  const customIdentityFields = CUSTOM_VMS_IDENTITY_FIELD_GROUPS[source]
  const identityFields = customIdentityFields?.length
    ? [...IDENTITY_FIELD_GROUPS[identitySource], ...customIdentityFields]
    : IDENTITY_FIELD_GROUPS[identitySource]

  return (
    <div
      className={styles.container}
      // style={{ opacity: 0 }}
    >
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </a>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {formatInfoField(shipname, 'name', serverT)}
          {otherNamesLabel && <span className={styles.secondary}>{otherNamesLabel}</span>}
        </h1>
        {identityFields.map((fieldGroup, index) => (
          <ul key={index} className={cx(styles.fieldGroup, styles.border)}>
            {/* TODO: make fields more dynamic to account for VMS */}
            {fieldGroup.map((field) => {
              const label = field.label || field.key
              const key = field.key as keyof VesselLastIdentity
              return (
                <li key={field.key}>
                  <label>{serverT(`vessel.${label}` as any, label)}</label>
                  {vesselIdentity.combinedSourcesInfo &&
                  (key === 'shiptype' || key === 'geartype') ? (
                    <VesselIdentityCombinedSourceField
                      identity={vesselIdentity}
                      property={key}
                      translationFn={serverT}
                    />
                  ) : (
                    <VesselIdentityField
                      value={
                        formatInfoField(vesselIdentity[key] as string, label, serverT) as string
                      }
                    />
                  )}
                </li>
              )
            })}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default VesselServerComponent
