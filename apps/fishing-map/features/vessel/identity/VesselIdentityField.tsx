import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import styles from './VesselIdentityField.module.css'

type VesselIdentityFieldProps = {
  value: string
}
const VesselIdentityField = ({ value }: VesselIdentityFieldProps) => {
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

  return <span className={cx(styles.value, { [styles.highlight]: highlighted })}>{value}</span>
}

export default VesselIdentityField
