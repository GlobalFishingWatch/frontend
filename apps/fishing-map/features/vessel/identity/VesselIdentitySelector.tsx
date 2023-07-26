import { useSelector } from 'react-redux'
import cx from 'classnames'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { selectVesselRegistryIndex } from 'features/vessel/vessel.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { getUTCDateTime } from 'utils/dates'
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
    <ul className={cx(styles.selector)}>
      {vessel?.registryInfo.map((registry, index) => {
        const start = getUTCDateTime(registry.transmissionDateFrom).toFormat('yyyy')
        const end = getUTCDateTime(registry.transmissionDateTo).toFormat('yyyy')
        return (
          <Tooltip
            content={
              <span>
                {start} - {end}
              </span>
            }
          >
            <li
              className={cx(styles.icon, { [styles.selected]: index === registryIndex })}
              onClick={() => setRegistryIndex(index)}
            ></li>
          </Tooltip>
        )
      })}
    </ul>
  )
}

export default VesselIdentitySelector
