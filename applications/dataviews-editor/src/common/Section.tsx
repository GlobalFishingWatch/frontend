import React from 'react'
import styles from './Section.module.css'

const Section = ({children}: any) => {
  return <section className={styles.section}>
    {children}
  </section>
}

export default Section
