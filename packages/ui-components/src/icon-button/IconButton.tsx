import React, { lazy, Suspense, useMemo } from 'react'
import cx from 'classnames'
import styles from './IconButton.module.css'

type IconButtonTypes = 'default' | 'invert'
type Icons =
  | 'arrow-down'
  | 'arrow-right'
  | 'arrow-top'
  | 'camera'
  | 'close'
  | 'compare'
  | 'delete'
  | 'download'
  | 'edit'
  | 'email'
  | 'graph'
  | 'home'
  | 'info'
  | 'menu'
  | 'minus'
  | 'plus'
  | 'publish'
  | 'remove-from-map'
  | 'ruler'
  | 'satellite'
  | 'search'
  | 'share'
  | 'split'
  | 'view-on-map'
  | 'warning'

interface IconButtonProps {
  type?: IconButtonTypes
  className?: string
  icon: Icons
}

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { type = 'default', className, icon } = props
  const IconComponent = useMemo(() => {
    return lazy(() =>
      import(`../assets/icons/${icon}.svg`).then((node) => ({ default: node.ReactComponent }))
    )
  }, [icon])
  console.log('IconComponent -> IconComponent', IconComponent)
  return (
    <button className={cx(styles.IconButton, { [styles.invert]: type === 'invert' }, className)}>
      <Suspense fallback={null}>
        <IconComponent />
      </Suspense>
    </button>
  )
}

export default IconButton
