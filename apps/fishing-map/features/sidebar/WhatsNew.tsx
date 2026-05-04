import { useEffect, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components'

import packageJson from '../../package.json'

import styles from './WhatsNew.module.css'

const GFW_LAST_VERSION_SEEN_KEY = 'GFW_LAST_VERSION_SEEN'
let hasLoadedSnapshot = false
let newVersionSinceLastVisitSnapshot = false

const parseVersion = (version: string) => {
  //return only first two numbers to check only major and minor changes
  return version.split('.').slice(0, 2).join('.')
}

const CURRENT_VERSION = parseVersion(packageJson.version)

function getClientWhatsNewSnapshot() {
  if (!hasLoadedSnapshot) {
    const lastVersionSeen = localStorage.getItem(GFW_LAST_VERSION_SEEN_KEY) || ''
    newVersionSinceLastVisitSnapshot = lastVersionSeen === '' || CURRENT_VERSION > lastVersionSeen
    hasLoadedSnapshot = true
  }
  return newVersionSinceLastVisitSnapshot
}

function getServerWhatsNewSnapshot() {
  return false
}

function dismissWhatsNewSnapshot() {
  localStorage.setItem(GFW_LAST_VERSION_SEEN_KEY, CURRENT_VERSION)
  newVersionSinceLastVisitSnapshot = false
}

function WhatsNew() {
  const { t } = useTranslation()
  const newVersionSinceLastVisit = useSyncExternalStore(
    () => () => {},
    getClientWhatsNewSnapshot,
    getServerWhatsNewSnapshot
  )

  useEffect(() => {
    // We want to hide the icon automatically for following visits
    localStorage.setItem(GFW_LAST_VERSION_SEEN_KEY, CURRENT_VERSION)
  }, [])

  const dismissNewVersionHint = () => {
    // remove hint if user visits the platform updates page
    dismissWhatsNewSnapshot()
  }

  return (
    <a
      className={cx({ [styles.newVersionHint]: newVersionSinceLastVisit })}
      href="https://globalfishingwatch.org/platform-updates"
      target="_blank"
      rel="noreferrer"
    >
      <IconButton
        onClick={dismissNewVersionHint}
        icon="sparks"
        tooltip={
          newVersionSinceLastVisit
            ? t((t) => t.common.whatsNewWithNewVersion)
            : t((t) => t.common.whatsNew)
        }
        tooltipPlacement="right"
      />
    </a>
  )
}

export default WhatsNew
