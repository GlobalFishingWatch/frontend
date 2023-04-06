import { Fragment } from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import styles from './AuthIcon.module.css'
interface AuthIconProps {
  authorizationStatus: string
}

const AuthIcon: React.FC<AuthIconProps> = ({
  authorizationStatus = 'pending',
}): React.ReactElement => {
  if (authorizationStatus === 'true') {
    return <Icon icon="tick" type="default" className={styles.authorized} />
  }
  return <Icon icon="help" type="default" className={styles[authorizationStatus]} />
}

export default AuthIcon
