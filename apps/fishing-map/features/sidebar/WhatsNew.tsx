import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import packageJson from 'package.json'
import { useEffect, useRef, useState } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from './WhatsNew.module.css'

const parseVersion = (version: string) => {
  //return only first two numbers to check only major and minor changes
  return version.split('.').slice(0, 2).join('.')
}

function WhatsNew() {
  const { t } = useTranslation()
  const lastVersionSeen = parseVersion(localStorage.getItem('lastVersionSeen') || '')
  const currentVersion = parseVersion(packageJson.version)
  const [hintSeen, setHintSeen] = useState(false)
  const newVersionSinceLastVisit = useRef(
    lastVersionSeen === '' || currentVersion > lastVersionSeen
  )

  useEffect(() => {
    // set version to current
    localStorage.setItem('lastVersionSeen', currentVersion)
  }, [])

  const dismissNewVersionHint = () => {
    // remove hint if user visits the platform updates page
    setHintSeen(true)
  }

  return (
    <a
      className={cx({ [styles.newVersionHint]: !hintSeen && newVersionSinceLastVisit.current })}
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
