import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import styles from './UserGuideLink.module.css'

export type UserGuideSection =
  | 'uploadData'
  | 'uploadPolygons'
  | 'uploadTracks'
  | 'uploadPoints'
  | 'analysis'
  | 'downloadActivity'
  | 'vesselSearch'
  | 'vesselGroups'
  | 'activityFishing'
  | 'activityPresence'
  | 'activityFilters'
  | 'detectionsSAR'
  | 'detectionsVIIRS'

const USER_GUIDE_LINK_EN: string = 'https://globalfishingwatch.org/user-guide/'
const USER_GUIDE_LINK_ES: string = 'https://globalfishingwatch.org/es/guia-de-usuario/'

const USER_GUIDE_SECTIONS_EN: Record<UserGuideSection, string> = {
  uploadData: '#Uploading data',
  // TODO update sections by categoreies
  uploadPolygons: '#Uploading data',
  uploadTracks: '#Uploading data',
  uploadPoints: '#Uploading data',
  analysis: '#Analysis',
  downloadActivity: '#Downloading data',
  vesselSearch: '#Vessel search',
  vesselGroups: '#Vessel groups',
  activityFishing: '#Activity - Fishing',
  activityPresence: '#Activity - Presence',
  activityFilters: '#Filtering activity layers',
  detectionsSAR: '#Radar detections - Synthetic aperture radar',
  detectionsVIIRS: '#Night light detections - Visible Infrared Imaging Radiometer Suite',
}

const USER_GUIDE_SECTIONS_ES: Record<UserGuideSection, string> = {
  uploadData: '#Carga de datos',
  // TODO update sections by categoreies
  uploadPolygons: '#Carga de datos',
  uploadTracks: '#Carga de datos',
  uploadPoints: '#Carga de datos',
  analysis: '#Análisis',
  downloadActivity: '#Descarga de datos',
  vesselSearch: '#Búsqueda de embarcaciones',
  vesselGroups: '#Grupos de embarcaciones',
  activityFishing: '#Actividad - Pesca',
  activityPresence: '#Actividad - Presencia',
  activityFilters: '#Filtrar capas de actividad',
  detectionsSAR: '#Detecciones de radar - Radar de apertura sintética',
  detectionsVIIRS:
    '#Detecciones de luz nocturna - Suite de Radiómetros para Imágenes Infrarrojas Visibles',
}

type UserGuideLinkProps = {
  section: UserGuideSection
  className?: string
}

function UserGuideLink({ section, className }: UserGuideLinkProps) {
  const { t, i18n } = useTranslation()
  const userGuideLink = i18n.language === 'es' ? USER_GUIDE_LINK_ES : USER_GUIDE_LINK_EN
  const userGuideSections = i18n.language === 'es' ? USER_GUIDE_SECTIONS_ES : USER_GUIDE_SECTIONS_EN
  return (
    <a
      className={cx(styles.link, className)}
      href={`${userGuideLink}${userGuideSections[section]}`}
      target="_blank"
      rel="noreferrer"
    >
      <IconButton size="small" icon="help" className={styles.icon} />{' '}
      <div>
        <label className={styles.label}>{t('userGuide.title', 'User Guide')}</label>
        <span>{t(`userGuide.${section}` as any)}</span>
      </div>
    </a>
  )
}

export default UserGuideLink
