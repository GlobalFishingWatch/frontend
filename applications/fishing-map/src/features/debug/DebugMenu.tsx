import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Switch } from '@globalfishingwatch/ui-components'
import { selectDebugOptions, toggleOption } from './debug.slice'
import styles from './DebugMenu.module.css'

function DebugMenu() {
  const dispatch = useDispatch()
  const debugOptions = useSelector(selectDebugOptions)
  const { i18n } = useTranslation()
  const lang = i18n.language.split('-')[0]

  const toggleLanguage = () => {
    i18n.changeLanguage(lang === 'es' ? 'en' : 'es')
  }
  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <Switch active={debugOptions.blob} onClick={() => dispatch(toggleOption('blob'))} />
        <label htmlFor="option_blob">[experimental] Smooth heatmap style</label>
      </div>
      <p>
        Render fishing layer with a smoother rendering style. Only works when a single fishing layer
        is shown. Will disable interaction on this layer.
      </p>
      <div className={styles.header}>
        <Switch active={debugOptions.extruded} onClick={() => dispatch(toggleOption('extruded'))} />
        <label htmlFor="option_extruded">[experimental] Stacked 3D bars</label>
      </div>
      <p>Renders fishing activity as stacked 3D bars. Will disable interaction on this layer.</p>
      <div className={styles.header}>
        <Switch active={debugOptions.debug} onClick={() => dispatch(toggleOption('debug'))} />
        <label htmlFor="option_debug">Debug tiles</label>
      </div>
      <p>Displays info on tiles useful for debugging.</p>
      <div className={styles.header}>
        <Switch active={lang === 'es'} onClick={toggleLanguage} />
        <label htmlFor="option_language">Ver en Español</label>
      </div>
      <p>Translations in progress, some literals could be missing.</p>
    </div>
  )
}

export default DebugMenu
