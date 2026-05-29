import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import type { REGISTRY_SOURCES } from 'features/vessel/identity/vessel-identity.config'

import styles from '../VesselIdentity.module.css'

type VesselRegistryContactProps = {
  registrySource?: (typeof REGISTRY_SOURCES)[number]
}

const VesselRegistryContact = ({ registrySource }: VesselRegistryContactProps) => {
  const { t } = useTranslation()
  if (!registrySource) {
    return null
  }
  return (
    <div className={cx(styles.extraInfoContainer, 'print-hidden')}>
      <img
        src={registrySource.logo}
        alt={registrySource.key}
        className={styles.registrySourceLogo}
      />
      <Tooltip content={t((t) => t.vessel.extraInfoTooltip)}>
        <div>
          <label>{t((t) => t.vessel.extraInfo)}</label>
          <a href={`mailto:${registrySource.contact}`} target="_blank">
            {registrySource.contact}
          </a>
        </div>
      </Tooltip>
    </div>
  )
}

export default VesselRegistryContact
