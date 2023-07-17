import cx from 'classnames'
import { Icon } from '@globalfishingwatch/ui-components'
import { AuthorizationType } from '@globalfishingwatch/api-types'
import styles from './AuthIcon.module.css'

interface AuthIconProps {
  authorizationStatus: AuthorizationType
}

const AuthIcon: React.FC<AuthIconProps> = ({
  authorizationStatus = 'pending',
}): React.ReactElement => {
  return (
    <Icon
      icon={authorizationStatus === 'true' ? 'tick' : 'help'}
      type="default"
      className={cx(styles.icon, styles[authorizationStatus])}
    />
  )
}

export default AuthIcon
