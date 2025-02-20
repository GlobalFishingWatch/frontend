import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { VesselWithHistory } from 'types'
import styles from './Profile.module.css'

const actionTexts = {
  en: {
    activity: 'AIS-derived vessel activity',
    map: 'AIS-derived vessel events, positional history on map',
    risk: 'vessel insights and potential risk indicators',
  },
  fr: {
    activity: 'activité du navire dérivée de AIS',
    map: "événements des navires issus de l'AIS et à l'historique des positions sur la carte",
    risk: 'analyses des navires concernant les différents indicateurs de risques',
  },
}

const TabDeprecated = ({
  vessel,
  vesselId,
  fullHeight = true,
  action = 'activity',
}: {
  vessel?: VesselWithHistory
  vesselId: string
  fullHeight?: boolean
  action: 'activity' | 'map' | 'risk'
}) => {
  const { i18n } = useTranslation()
  const href = vessel?.mmsi
    ? `https://globalfishingwatch.org/map/vessel-search?sO=advanced&ssvid=${vessel.mmsi}&qry=${vessel.shipname}&imo=${vessel.imo}`
    : vesselId
      ? `https://globalfishingwatch.org/map/vessel/${vesselId}`
      : 'https://globalfishingwatch.org/map/vessel-search'

  const lng = i18n.language === 'fr' ? 'fr' : 'en'
  const actionText = actionTexts[lng][action]
  return (
    <div className={cx(styles.deprecatedContainer, { [styles.deprecatedFullHeight]: fullHeight })}>
      <p className={styles.emptyState}>
        {/* Ugly, not now wasting time to go throught crowdin as it is going to be removed soon */}
        {i18n.language === 'fr'
          ? `Cette fonctionnalité n'est plus prise en charge alors que nous supprimons progressivement cette version prototype de Vessel Viewer.`
          : 'The feature is no longer supported as we phase out this prototype version of Vessel Viewer.'}
        <br />
        {i18n.language === 'fr'
          ? `Pour accéder à ${actionText}, nous recommandons de rechercher ce navire sur la`
          : `To access ${actionText}, we recommend searching this vessel on the`}
        <br />
        <a href={href}>
          {i18n.language === 'fr'
            ? ' plateforme publique de Vessel Viewer'
            : 'public Vessel Viewer platform'}
        </a>
        .
      </p>
    </div>
  )
}

export default TabDeprecated
