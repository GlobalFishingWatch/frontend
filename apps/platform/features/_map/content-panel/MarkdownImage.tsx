import { useState } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'

import { useSmallScreen } from '@globalfishingwatch/react-hooks'

import styles from './MarkdownImage.module.css'

type MarkdownImageProps = React.ImgHTMLAttributes<HTMLImageElement>

const MarkdownImage = ({ src, alt, ...props }: MarkdownImageProps) => {
  const [open, setOpen] = useState(false)
  const isSmallScreen = useSmallScreen()

  if (!src) return <img src={src} alt={alt} {...props} />

  return (
    <>
      <button className={styles.markdownImageBtn} onClick={() => !isSmallScreen && setOpen(true)}>
        <img src={src} alt={alt} className={styles.markdownImage} {...props} />
      </button>
      {open &&
        createPortal(
          <dialog
            ref={(el) => {
              if (el && !el.open) el.showModal()
            }}
            className={styles.dialog}
            onClose={() => setOpen(false)}
          >
            <button className={styles.markdownImageBtn} onClick={() => setOpen(false)}>
              <img
                src={src}
                alt={alt}
                className={cx(styles.markdownImage, styles.open)}
                {...props}
              />
            </button>
          </dialog>,
          document.body
        )}
    </>
  )
}

export default MarkdownImage
