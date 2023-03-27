import { Fragment } from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import styles from './AuthIcon.module.css'
interface AuthIconProps {
  isAuthorized: boolean
}

const AuthIcon: React.FC<AuthIconProps> = ({ isAuthorized = false }): React.ReactElement => {
  if (isAuthorized) {
    return <Icon icon="tick" type="default" className={styles.authorized} />
  }
  return <Icon icon="help" type="default" className={styles.notAuthorized} />
}

export default AuthIcon
