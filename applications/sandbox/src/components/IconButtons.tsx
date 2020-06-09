import React, { Fragment } from 'react'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import styles from './components.module.css'

const IconButtonsSection = () => {
  return (
    <Fragment>
      <label>Default</label>
      <IconButton icon="menu" onClick={(e) => console.log(e)} />
      <label>Default destructive</label>
      <IconButton icon="delete" type="destructive" />
      <label>Border</label>
      <IconButton icon="download" type="border" />
      <label>Invert</label>
      <IconButton icon="camera" type="invert" />
      <label>Small</label>
      <IconButton icon="compare" size="small" />
      <label>Small invert</label>
      <IconButton icon="edit" size="small" type="invert" />
      <label>Tiny</label>
      <IconButton icon="arrow-top" size="tiny" />
      <label>Tiny invert</label>
      <IconButton icon="arrow-down" size="tiny" type="invert" />
      <label>Custom fill</label>
      <IconButton icon="arrow-right" className={styles.customIcon} />
      <label>Custom fill invert</label>
      <IconButton icon="arrow-down" type="invert" className={styles.customIcon} />
    </Fragment>
  )
}

export default IconButtonsSection
