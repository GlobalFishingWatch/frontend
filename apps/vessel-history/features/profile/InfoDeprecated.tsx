import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import type { VesselWithHistory } from 'types'
import styles from './Profile.module.css'

const InfoDeprecated = ({
  vessel,
  vesselId,
  fullHeight = true,
}: {
  vessel?: VesselWithHistory
  vesselId: string
  fullHeight?: boolean
}) => {
  const { i18n } = useTranslation()
  const href = vessel?.mmsi
    ? `https://globalfishingwatch.org/map/vessel-search?sO=advanced&ssvid=${vessel.mmsi}&qry=${vessel.shipname}&imo=${vessel.imo}`
    : vesselId
      ? `https://globalfishingwatch.org/map/vessel/${vesselId}`
      : 'https://globalfishingwatch.org/map/vessel-search'

  return (
    <div className={cx(styles.deprecatedContainer, { [styles.deprecatedFullHeight]: fullHeight })}>
      {i18n.language === 'fr' ? (
        <p className={styles.emptyState}>
          Cette version prototype de Vessel Viewer est en cours de suppression progressive. <br />
          Les informations d'identité dans cet onglet provenant de la source « AIS » (lorsqu'elles
          sont disponibles) ne seront plus accessibles après le 24 janvier 2025.
          <br />
          Nous recommandons de vérifier l'identité des navires sur la
          <br />
          <a href={href}>plateforme publique de Vessel Viewer.</a>
        </p>
      ) : (
        <p className={styles.emptyState}>
          This prototype version of Vessel Viewer is being phased out. <br /> Identity information
          in this tab from ‘AIS’ source (where available) is not available beyond 24 January 2025.{' '}
          <br />
          We recommend cross-checking vessel identity on the
          <br />
          <a href={href}>public Vessel Viewer platform.</a>
        </p>
      )}
    </div>
  )
}

export default InfoDeprecated
