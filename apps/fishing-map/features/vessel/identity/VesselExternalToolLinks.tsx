import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { Icon } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import type { VesselLastIdentity } from 'features/search/search.slice'
import { getSkylightLink } from 'features/vessel/vessel.utils'

import styles from './VesselIdentity.module.css'

type VesselExternalToolLinksProps = {
  vesselIdentity: VesselLastIdentity
  latestSsvid?: string
  showSections?: boolean
}

const VesselExternalToolLinks = ({
  vesselIdentity,
  latestSsvid,
  showSections,
}: VesselExternalToolLinksProps) => {
  const { t, i18n } = useTranslation()
  const { ssvid, imo, callsign, shipname, nShipname } = vesselIdentity

  return (
    <div
      className={cx(
        { [styles.identitySection]: showSections },
        { [styles.sectionContent]: showSections },
        { [styles.fieldGroupContainer]: showSections },
        'print-hidden'
      )}
    >
      <label>{t((t) => t.common.viewIn)}</label>
      <div className={styles.externalToolLinks}>
        <a
          href={`https://www.marinetraffic.com/${i18n.language}/data/?asset_type=vessels&mmsi=${ssvid}`}
          target="_blank"
          onClick={() =>
            trackEvent({
              category: TrackCategory.VesselProfile,
              action: 'click_marine_traffic_link',
            })
          }
        >
          Marine Traffic
          <Icon icon="external-link" type="default" />
        </a>
        {latestSsvid && (
          <a
            href={getSkylightLink({ skylightId: latestSsvid })}
            target="_blank"
            onClick={() =>
              trackEvent({ category: TrackCategory.VesselProfile, action: 'click_skylight_link' })
            }
          >
            Skylight
            <Icon icon="external-link" type="default" />
          </a>
        )}
        <a
          href={`https://app.triton.fish/search?name=${imo || ssvid || callsign || shipname}`}
          target="_blank"
          onClick={() =>
            trackEvent({ category: TrackCategory.VesselProfile, action: 'click_triton_link' })
          }
        >
          Triton
          <Icon icon="external-link" type="default" />
        </a>
        <a
          href={`https://cravt.imcsnet.org/browse-vessels?keywords=${imo || callsign || shipname || nShipname}`}
          target="_blank"
          onClick={() =>
            trackEvent({ category: TrackCategory.VesselProfile, action: 'click_cravt_link' })
          }
        >
          CRAVT
          <Icon icon="external-link" type="default" />
        </a>
      </div>
    </div>
  )
}

export default VesselExternalToolLinks
