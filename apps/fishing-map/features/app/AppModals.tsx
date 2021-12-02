import React, { Fragment, Suspense, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'
import { WorkspaceCategories } from 'data/workspaces'
import useDebugMenu from 'features/debug/debug.hooks'
import useEditorMenu from 'features/editor/editor.hooks'
import { isGFWUser } from 'features/user/user.slice'
import Welcome, { DISABLE_WELCOME_POPUP } from 'features/welcome/Welcome'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectReadOnly } from 'features/app/app.selectors'
import DebugMenu from 'features/debug/DebugMenu'
import EditorMenu from 'features/editor/EditorMenu'
import DownloadActivityModal from 'features/download/DownloadActivityModal'
import DownloadTrackModal from 'features/download/DownloadTrackModal'
import styles from './App.module.css'

const MARINE_MANAGER_LAST_VISIT = 'MarineManagerLastVisit'

const AppModals = () => {
  const isFirstTimeVisit = !localStorage.getItem(MARINE_MANAGER_LAST_VISIT)
  const readOnly = useSelector(selectReadOnly)
  const gfwUser = useSelector(isGFWUser)
  const { debugActive, dispatchToggleDebugMenu } = useDebugMenu()
  const { editorActive, dispatchToggleEditorMenu } = useEditorMenu()
  const [disabledWelcomePopup] = useLocalStorage(DISABLE_WELCOME_POPUP, false)

  const locationIsMarineManager =
    useSelector(selectLocationCategory) === WorkspaceCategories.MarineManager

  useEffect(() => {
    if (locationIsMarineManager) {
      localStorage.setItem(MARINE_MANAGER_LAST_VISIT, new Date().toISOString())
    }
  }, [locationIsMarineManager])

  const [welcomePopupOpen, setWelcomePopupOpen] = useState(
    locationIsMarineManager ? isFirstTimeVisit : !disabledWelcomePopup
  )
  const welcomePopupContentKey = locationIsMarineManager
    ? WorkspaceCategories.MarineManager
    : WorkspaceCategories.FishingActivity

  return (
    <Fragment>
      {gfwUser && (
        <Modal
          appSelector="__next"
          title="Secret debug menu 🤖"
          isOpen={debugActive}
          onClose={dispatchToggleDebugMenu}
        >
          <DebugMenu />
        </Modal>
      )}
      {gfwUser && (
        <Modal
          appSelector="__next"
          title="Workspace editor 📝"
          isOpen={editorActive}
          shouldCloseOnEsc={false}
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <EditorMenu />
        </Modal>
      )}
      <Suspense fallback={null}>
        <DownloadActivityModal />
      </Suspense>
      <Suspense fallback={null}>
        <DownloadTrackModal />
      </Suspense>
      {welcomePopupOpen && !readOnly && (
        <Suspense fallback={null}>
          <Modal
            appSelector="__next"
            header={false}
            isOpen={welcomePopupOpen}
            onClose={() => setWelcomePopupOpen(false)}
          >
            <Welcome
              contentKey={welcomePopupContentKey}
              showDisableCheckbox={!locationIsMarineManager}
            />
          </Modal>
        </Suspense>
      )}
    </Fragment>
  )
}

export default AppModals
