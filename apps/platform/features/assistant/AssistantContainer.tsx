import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { KEEP_MAP_POPUP_ATTRIBUTE } from 'features/_map/map/map.config'
import LoginLink from 'features/_user/LoginLink'
import { selectIsGFWUser, selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import AssistantHeader from 'features/assistant/AssistantHeader'
import AssistantSession from 'features/assistant/AssistantSession'

import styles from './Assistant.module.css'

function AssistantContainer() {
  const { t } = useTranslation()
  const isGuestUser = useSelector(selectIsGuestUser)
  const isGFWUser = useSelector(selectIsGFWUser)

  if (isGuestUser) {
    return (
      <div className={styles.loginGate}>
        <p className={styles.empty}>{t((t) => t.common.assistantLogin)}</p>
        <LoginLink className={styles.loginLink} loginSource="assistant">
          {t((t) => t.common.login)}
        </LoginLink>
      </div>
    )
  }

  if (!isGFWUser) {
    return null
  }

  return (
    <div className={styles.assistant} {...{ [KEEP_MAP_POPUP_ATTRIBUTE]: true }}>
      <AssistantHeader />
      <AssistantSession />
    </div>
  )
}

export default AssistantContainer
