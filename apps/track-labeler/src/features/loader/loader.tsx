import React from 'react'

import brand from '../../assets/images/brand.png'

import styles from './loader.module.scss'

interface LoaderProps {
  invert?: boolean
  timeout?: number
  mini?: boolean
  encounter?: boolean
  carrier?: boolean
}

const Loader: React.FC<LoaderProps> = (): React.ReactElement<any> => {
  return (
    <div className={styles.loaderContainer}>
      <div>
        <img src={brand} alt="Logo" className={styles.logoImage} />
        <div className={styles.spinner} role="alert" aria-live="assertive" />
      </div>
    </div>
  )
}

export default Loader
