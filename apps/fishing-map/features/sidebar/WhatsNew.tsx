import { useRef, useEffect } from 'react'
import cx from 'classnames'
import packageJson from 'package.json'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import styles from './WhatsNew.module.css'

const GFW_LAST_VERSION_SEEN_KEY = 'GFW_LAST_VERSION_SEEN'

const parseVersion = (version: string) => {
  //return only first two numbers to check only major and minor changes
  return version.split('.').slice(0, 2).join('.')
}

function WhatsNew() {
  const { t } = useTranslation()
  const [lastVersionSeen, setLastVersionSeen] = useLocalStorage(GFW_LAST_VERSION_SEEN_KEY, '')
  const currentVersion = parseVersion(packageJson.version)
  const newVersionSinceLastVisit = useRef(
    lastVersionSeen === '' || currentVersion > lastVersionSeen
  )

  useEffect(() => {
    // We want to hide the icon automatically for following visits
    setLastVersionSeen(currentVersion)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            ? t(
                'common.whatsNewWithNewVersion',
                "We've made some changes since you last visited the map. Click to learn more"
              )
            : t('common.whatsNew', "What's new?")
        }
        tooltipPlacement="right"
      />
    </a>
  )
}

export default WhatsNew
