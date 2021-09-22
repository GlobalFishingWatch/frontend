import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@globalfishingwatch/ui-components/dist/button'
import InputText from '@globalfishingwatch/ui-components/dist/input-text'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import { useMapDrawConnect } from '../map-draw.hooks'
import styles from './MapDrawControls.module.css'

function MapDrawControls() {
  const { drawMode, dispatchSetDrawMode } = useMapDrawConnect()
  const { t } = useTranslation()

  if (drawMode === 'disabled') {
    return null
  }

  const closeDraw = () => {
    dispatchSetDrawMode('disabled')
  }

  return (
    <div className={styles.container}>
      <div>
        <label>{t('layer.name', 'Layer name')}</label>
        <div className={styles.flex}>
          <InputText className={styles.input} inputSize="small" />
          <IconButton icon="edit" />
          <IconButton type="warning" icon="delete" />
        </div>
      </div>
      <div className={styles.flex}>
        <Button className={styles.button} type="secondary" onClick={closeDraw}>
          {t('common.dismiss', 'Dismiss')}
        </Button>
        <Button
          className={styles.button}
          onClick={() => {
            console.log('DOIT')
            closeDraw()
          }}
        >
          {t('common.save', 'Save')}
        </Button>
      </div>
    </div>
  )
}

export default MapDrawControls
