import { Fragment, useRef } from 'react'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import styles from './MarkdownImage.module.css'

type MarkdownImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const MarkdownImage = ({ src, alt, ...props }: MarkdownImageProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isSmallScreen = useSmallScreen()

  if (!src) return <img src={src} alt={alt} {...props} />

  return (
    <Fragment>
      <button
        className={styles.markdownImageBtn}
        onClick={() => !isSmallScreen && dialogRef.current?.showModal()}
      >
        <img src={src} alt={alt} className={styles.markdownImage} {...props} />
      </button>
      <dialog ref={dialogRef} className={styles.dialog}>
        <button className={styles.closeArea} onClick={() => dialogRef.current?.close()}>
          <img src={src} alt={alt} className={cx(styles.markdownImage, styles.open)} {...props} />
        </button>
      </dialog>
    </Fragment>
  )
}

export default MarkdownImage
