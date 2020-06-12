import React, { Fragment } from 'react'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import styles from './components.module.css'

const IconButtonsSection = () => {
  return (
    <Fragment>
      <label>Default</label>
      <IconButton icon="menu" onClick={(e) => console.log(e)} tooltip="Menu" />
      <label>Default warning</label>
      <IconButton icon="delete" type="warning" />
      <label>With child</label>
      <IconButton icon="ruler">
        <span className={styles.iconText}>1</span>
      </IconButton>
      <label>Border</label>
      <IconButton icon="download" type="border" />
      <label>Map-tool</label>
      <IconButton icon="camera" type="map-tool" />
      <label>Small</label>
      <IconButton icon="compare" size="small" />
      <label>Tiny</label>
      <IconButton icon="arrow-top" size="tiny" />
      <label>Custom fill</label>
      <IconButton icon="arrow-right" className={styles.customIcon} />

      <div style={{ padding: '2rem', backgroundColor: 'black' }}>
        <label>Small invert</label>
        <IconButton icon="edit" size="small" type="invert" />
        <label>Tiny invert</label>
        <IconButton icon="arrow-down" size="tiny" type="invert" />
        <label>Custom fill invert</label>
        <IconButton icon="arrow-down" type="invert" className={styles.customIcon} />
      </div>
    </Fragment>
  )
}

export default IconButtonsSection
