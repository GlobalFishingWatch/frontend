import cx from 'classnames'
import { useSelector } from 'react-redux'
import { Logo } from '@globalfishingwatch/ui-components'
import { selectVesselInfoData, selectVesselInfoStatus } from 'features/vessel/vessel.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { serverT } from 'pages/vessel/i18n'
import { IDENTITY_FIELD_GROUPS } from 'features/vessel/vessel.config'
import { formatInfoField } from 'utils/info'
import styles from './styles.module.css'

const VesselServerComponent = () => {
  const infoStatus = useSelector(selectVesselInfoStatus)
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
        <h1 className={styles.title}>{formatInfoField(vessel?.shipname, 'name', serverT)}</h1>
        {IDENTITY_FIELD_GROUPS.map((fieldGroup) => (
          <div key={fieldGroup.join()} className={cx(styles.fieldGroup, styles.border)}>
            {/* TODO: make fields more dynamic to account for VMS */}
            {fieldGroup.map((field) => (
              <div key={field}>
                <label>{serverT(`vessel.${field}` as any, field)}</label>
                {formatInfoField(vessel?.[field], field, serverT)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VesselServerComponent
