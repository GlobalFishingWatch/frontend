import { Fragment, useState } from 'react'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import styles from './MarkdownImage.module.css'

type MarkdownImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const MarkdownImage = ({ src, alt, ...props }: MarkdownImageProps) => {
  const [open, setOpen] = useState(false)
  const isSmallScreen = useSmallScreen()

  if (!src) return <img src={src} alt={alt} {...props} />

  return (
    <Fragment>
      <button className={styles.markdownImageBtn} onClick={() => !isSmallScreen && setOpen(true)}>
        <img src={src} alt={alt} className={cx(styles.markdownImage)} {...props} />
      </button>
      {open && (
        <button className={styles.markdownImageBtn} onClick={() => setOpen(false)}>
          <div className={styles.veil} />
          <img src={src} alt={alt} className={cx(styles.markdownImage, styles.open)} {...props} />
        </button>
      )}
    </Fragment>
  )
}

export default MarkdownImage
