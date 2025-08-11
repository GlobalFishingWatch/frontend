import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

// import packageJson from '../../package.json'
import styles from './WhatsNew.module.css'

const GFW_LAST_VERSION_SEEN_KEY = 'GFW_LAST_VERSION_SEEN'

const parseVersion = (version: string) => {
  //return only first two numbers to check only major and minor changes
  return version.split('.').slice(0, 2).join('.')
}

function WhatsNew() {
  const { t } = useTranslation()
  const [lastVersionSeen, setLastVersionSeen] = useLocalStorage(GFW_LAST_VERSION_SEEN_KEY, '')
  const currentVersion = parseVersion('1')
  const newVersionSinceLastVisit = useRef(
    lastVersionSeen === '' || currentVersion > lastVersionSeen
  )

  useEffect(() => {
    // We want to hide the icon automatically for following visits
    setLastVersionSeen(currentVersion)
  }, [])

  const dismissNewVersionHint = () => {
    // remove hint if user visits the platform updates page
    setLastVersionSeen(currentVersion)
    newVersionSinceLastVisit.current = false
  }

  return (
    <a
      className={cx({ [styles.newVersionHint]: newVersionSinceLastVisit.current })}
      href="https://globalfishingwatch.org/platform-updates"
      target="_blank"
      rel="noreferrer"
    >
      <IconButton
        onClick={dismissNewVersionHint}
        icon="sparks"
        tooltip={
          newVersionSinceLastVisit.current
            ? t('common.whatsNewWithNewVersion')
            : t('common.whatsNew')
        }
        tooltipPlacement="right"
      />
    </a>
  )
}

export default WhatsNew
