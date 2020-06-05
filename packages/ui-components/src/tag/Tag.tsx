import React from 'react'
import cx from 'classnames'
import styles from './Tag.module.css'

interface ButtonProps {
  className?: string
  children: string
}

const Tag: React.FC<ButtonProps> = (props) => {
  const { className, children } = props
  return (
    <span className={cx(styles.Tag, className)}>
      {children}
      {/* <IconButton icon="close" /> */}
    </span>
  )
}

export default Tag
