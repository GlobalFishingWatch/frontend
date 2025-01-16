import { useSelector } from 'react-redux'
import cx from 'classnames'
import { serverT } from 'server/i18n'

import { Logo } from '@globalfishingwatch/ui-components'

import {
  selectVesselInfoData,
  selectVesselInfoStatus,
} from 'features/vessel/selectors/vessel.selectors'
import { IDENTITY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import { selectVesselIdentitySource } from 'features/vessel/vessel.config.selectors'
import type { VesselIdentityProperty } from 'features/vessel/vessel.utils'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { AsyncReducerStatus } from 'utils/async-slice'
import { formatInfoField } from 'utils/info'

import styles from './styles.module.css'

const VesselServerComponent = () => {
  const infoStatus = useSelector(selectVesselInfoStatus)
  const identitySource = useSelector(selectVesselIdentitySource)
  const vessel = useSelector(selectVesselInfoData)

  if (infoStatus !== AsyncReducerStatus.Finished) {
    return null
  }

  return (
    <div className={styles.container} style={{ opacity: 0 }}>
      <div className={styles.sidebarHeader}>
        <a href="https://globalfishingwatch.org" className={styles.logoLink}>
          <Logo className={styles.logo} />
        </a>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          {formatInfoField(getVesselProperty(vessel, 'shipname'), 'shipname', serverT)}
        </h1>
        {IDENTITY_FIELD_GROUPS[identitySource].map((fieldGroup) => (
          <div key={fieldGroup.join()} className={cx(styles.fieldGroup, styles.border)}>
            {/* TODO: make fields more dynamic to account for VMS */}
            {fieldGroup.map((field) => {
              const label = field.label || field.key
              const key = field.key as VesselIdentityProperty
              return (
                <div key={field.key}>
                  <label>{serverT(`vessel.${label}` as any, label)}</label>
                  {vessel
                    ? formatInfoField(getVesselProperty(vessel, key), field.key as any, serverT)
                    : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VesselServerComponent
