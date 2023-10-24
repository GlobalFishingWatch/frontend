import {
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import cx from 'classnames'
import { API_LOGIN_REQUIRED } from '@globalfishingwatch/api-types'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import styles from './VesselIdentityField.module.css'

type VesselIdentityFieldProps = {
  value: string
  className?: string
}
const VesselIdentityField = (
  { value, className = '' }: VesselIdentityFieldProps,
  forwardedRef: Ref<HTMLSpanElement>
) => {
  const prevValue = useRef(value)
  const [highlighted, setHighlighted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useImperativeHandle(forwardedRef, () => ref.current as HTMLSpanElement)

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

  if (typeof value === 'string' && value.toUpperCase() === API_LOGIN_REQUIRED) {
    return <VesselIdentityFieldLogin />
  }

  return (
    <span ref={ref} className={cx(styles.value, { [styles.highlight]: highlighted }, className)}>
      {value}
    </span>
  )
}

export default forwardRef<HTMLSpanElement, VesselIdentityFieldProps>(VesselIdentityField)
