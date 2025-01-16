import React, { Component } from 'react'

import { Header } from '@globalfishingwatch/ui-components'

import styles from './header.module.css'

class HeaderComponent extends Component {
  render() {
    return (
      <div className={styles.Header}>
        <Header className={styles.headerLinks} />
        <div className={styles.titleCover}>
          <h1 className={styles.title}>Datasets and Code</h1>
        </div>
      </div>
    )
  }
}

export default HeaderComponent
