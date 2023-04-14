import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './UserGuideLink.module.css'

type UserGuideSection =
  | 'uploadReference'
  | 'uploadEnvironment'
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
  uploadReference: '#Uploading data',
  uploadEnvironment: '#Environment data',
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
  uploadReference: '#Carga%20de%20datos',
  uploadEnvironment: '#Datos%20ambientales',
  analysis: '#Análisis',
  downloadActivity: '#Descarga%20de%20datos',
  vesselSearch: '#Búsqueda%20de%20embarcaciones',
  vesselGroups: '#Grupos%20de%20embarcaciones',
  activityFishing: '#Actividad%20-%20Pesca',
  activityPresence: '#Actividad%20-%20Presencia',
  activityFilters: '#Filtrar%20capas%20de%20actividad',
  detectionsSAR: '#Detecciones%20de%20radar%20-%20Radar%20de%20apertura%20sintética',
  detectionsVIIRS:
    '#Detecciones%20de%20luz%20nocturna%20-%20Suite%20de%20Radiómetros%20para%20Imágenes%20Infrarrojas%20Visibles',
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
