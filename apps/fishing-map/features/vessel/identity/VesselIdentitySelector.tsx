import { useSelector } from 'react-redux'
import cx from 'classnames'
import { selectVesselRegistryIndex } from 'features/vessel/vessel.config.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatI18nDate } from 'features/i18n/i18nDate'
import styles from './VesselIdentitySelector.module.css'

const VesselIdentitySelector = () => {
  const vessel = useSelector(selectVesselInfoData)
  const registryIndex = useSelector(selectVesselRegistryIndex)
  const { dispatchQueryParams } = useLocationConnect()

  const setRegistryIndex = (index: number) => {
    dispatchQueryParams({ vesselRegistryIndex: index })
  }

  if (!vessel?.registryInfo?.length || vessel?.registryInfo?.length <= 1) return null

  return (
    <ul className={cx(styles.selector, 'print-hidden')}>
      {vessel?.registryInfo.map((registry, index) => {
        const start = formatI18nDate(registry.transmissionDateFrom)
        const end = formatI18nDate(registry.transmissionDateTo)
        return (
          <li
            key={index}
            className={cx(styles.icon, { [styles.selected]: index === registryIndex })}
            onClick={() => setRegistryIndex(index)}
          >
            <span className={styles.dates}>
              {start} - {end}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export default VesselIdentitySelector
