import { useTranslation } from 'react-i18next'

import { BasemapType } from '@globalfishingwatch/deck-layers'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

import basemapDefaultImage from 'assets/images/basemap-default.jpg'
import basemapSatelliteImage from 'assets/images/basemap-satellite.jpg'

import styles from './MapControls.module.css'

type BasemapSwitcherProps = {
  basemap: BasemapType
  onChange: (basemap: BasemapType) => void
}

/** Thumbnail button that toggles between the default and the satellite basemap */
function BasemapSwitcher({ basemap, onChange }: BasemapSwitcherProps) {
  const { t } = useTranslation()
  const isDefault = basemap === BasemapType.Default
  const label = isDefault
    ? t((t) => t.map.change_basemap_satellite)
    : t((t) => t.map.change_basemap_default)

  return (
    <Tooltip content={label} placement="left">
      <button
        aria-label={label}
        className={styles.basemapSwitcher}
        style={{
          backgroundImage: `url(${isDefault ? basemapSatelliteImage : basemapDefaultImage})`,
        }}
        onClick={() => onChange(isDefault ? BasemapType.Satellite : BasemapType.Default)}
      />
    </Tooltip>
  )
}

export default BasemapSwitcher
