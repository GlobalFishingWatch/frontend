import React from 'react'
// import { Link } from 'react-router-dom'
import { ReactComponent as IconLogo } from 'assets/logo.svg'
import styles from './Header.module.css'
// import * as serviceWorker from 'serviceWorker.js'

// let deferredPrompt
const Header = () => {
  // const [showInstall, setShowInstall] = useState(true)

  // const onInstallClick = useCallback(() => {
  //   console.log('INSTALLING')
  //   serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
  //   serviceWorker.register(`${process.env.PUBLIC_URL}/workers/api-cache.js`)
  //   if (deferredPrompt) {
  //     deferredPrompt.prompt()
  //     // Wait for the user to respond to the prompt
  //     deferredPrompt.userChoice.then((choiceResult) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         // Default with static assets and custom for api cache
  //         serviceWorker.register(`${process.env.PUBLIC_URL}/service-worker.js`)
  //         serviceWorker.register(`${process.env.PUBLIC_URL}/workers/api-cache.js`)
  //         setShowInstall(false)
  //       } else {
  //         console.log('Service workers installation cancelled')
  //       }
  //       deferredPrompt = null
  //     })
  //   }
  // }, [])

  // useLayoutEffect(() => {
  //   const installListener = window.addEventListener('beforeinstallprompt', (e) => {
  //     e.preventDefault()
  //     // Stash the event so it can be triggered later.
  //     deferredPrompt = e
  //     // Update UI notify the user they can add to home screen
  //     setShowInstall(true)
  //   })
  //   return () => {
  //     window.removeEventListener(installListener)
  //   }
  // }, [])
  return (
    <header className={styles.header}>
      {/* <Link to={`/`} className={styles.logoIconContainer}>
        <IconLogo className={styles.logoIcon} />
        <span className={styles.logoIconText}>Port Inspector App</span>
      </Link> */}
      <IconLogo className={styles.logoIcon} />

      {/* {showInstall && (
        <button className={styles.actionBtn} onClick={onInstallClick}>
          Install app
        </button>
      )} */}
    </header>
  )
}
export default Header
