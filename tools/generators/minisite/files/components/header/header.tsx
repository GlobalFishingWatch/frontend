import React from 'react'
import dynamic from 'next/dynamic'
import styles from './header.module.css'

const HeaderNoSSR = dynamic(() => import('@globalfishingwatch/ui-components/dist/header'), {
  ssr: false,
})

export function HeaderComponent({ title = '' }: { title: string }) {
  return (
    <div className={styles.Header}>
      <HeaderNoSSR />
      <div className={styles.titleCover}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  )
}

export default HeaderComponent
