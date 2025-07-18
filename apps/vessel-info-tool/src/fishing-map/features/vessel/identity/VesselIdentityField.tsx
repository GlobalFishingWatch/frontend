import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'

import { Tooltip } from '@globalfishingwatch/ui-components'

import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'

import { isFieldLoginRequired } from '../vessel.utils'

import styles from './VesselIdentityField.module.css'

type VesselIdentityFieldProps = {
  value: string
  tooltip?: string
  className?: string
}
const VesselIdentityField = ({ tooltip, value, className = '' }: VesselIdentityFieldProps) => {
  const prevValue = useRef(value)
  const [highlighted, setHighlighted] = useState(false)

  // Needed to remove the class before adding it again in case
  // there is a new value before the timeout is finished
  useLayoutEffect(() => {
    if (prevValue.current !== value) {
      setHighlighted(false)
    }
  }, [value])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (prevValue.current !== value) {
      setHighlighted(true)
      timer = setTimeout(() => {
        setHighlighted(false)
      }, 4000)
    }
    prevValue.current = value
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [value])

  if (isFieldLoginRequired(value)) {
    return <VesselIdentityFieldLogin />
  }

  return (
    <Tooltip content={tooltip}>
      <span className={cx(styles.value, { [styles.highlight]: highlighted }, className)}>
        {value}
      </span>
    </Tooltip>
  )
}

export default VesselIdentityField
