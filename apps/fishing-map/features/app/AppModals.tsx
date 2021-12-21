import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'
import { WorkspaceCategories } from 'data/workspaces'
import { isGFWUser } from 'features/user/user.slice'
import Welcome, { DISABLE_WELCOME_POPUP } from 'features/welcome/Welcome'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectReadOnly } from 'features/app/app.selectors'
import { selectDebugActive, toggleDebugMenu } from 'features/debug/debug.slice'
import { selectEditorActive, toggleEditorMenu } from 'features/editor/editor.slice'
import EditorMenu from 'features/editor/EditorMenu'
import DownloadActivityModal from 'features/download/DownloadActivityModal'
import DownloadTrackModal from 'features/download/DownloadTrackModal'
import { ROOT_DOM_ELEMENT } from 'data/config'
import useSecretMenu from 'hooks/secret-menu.hooks'
import DebugMenu from 'features/debug/DebugMenu'
import { selectBigQueryActive, toggleBigQueryMenu } from 'features/bigquery/bigquery.slice'
import BigQueryMenu from 'features/bigquery/BigQuery'
import styles from './App.module.css'

const MARINE_MANAGER_LAST_VISIT = 'MarineManagerLastVisit'

const DebugMenuConfig = {
  key: 'd',
  onToggle: toggleDebugMenu,
  selectMenuActive: selectDebugActive,
}

const EditorMenuConfig = {
  key: 'e',
  onToggle: toggleEditorMenu,
  selectMenuActive: selectEditorActive,
}

const BigQueryMenuConfig = {
  key: 'b',
  onToggle: toggleBigQueryMenu,
  selectMenuActive: selectBigQueryActive,
}

const AppModals = () => {
  const isFirstTimeVisit = !localStorage.getItem(MARINE_MANAGER_LAST_VISIT)
  const readOnly = useSelector(selectReadOnly)
  const gfwUser = useSelector(isGFWUser)
  const [debugActive, dispatchToggleDebugMenu] = useSecretMenu(DebugMenuConfig)
  const [editorActive, dispatchToggleEditorMenu] = useSecretMenu(EditorMenuConfig)
  const [bigqueryActive, dispatchBigQueryMenu] = useSecretMenu(BigQueryMenuConfig)
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
          appSelector={ROOT_DOM_ELEMENT}
          title="Secret debug menu 🤖"
          isOpen={debugActive}
          shouldCloseOnEsc
          onClose={dispatchToggleDebugMenu}
        >
          <DebugMenu />
        </Modal>
      )}
      {gfwUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title="Workspace editor 📝"
          isOpen={editorActive}
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <EditorMenu />
        </Modal>
      )}
      {gfwUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title="Big query datasets creation"
          isOpen={bigqueryActive}
          onClose={dispatchBigQueryMenu}
        >
          <BigQueryMenu />
        </Modal>
      )}
      <DownloadActivityModal />
      <DownloadTrackModal />
      {welcomePopupOpen && !readOnly && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          header={false}
          isOpen={welcomePopupOpen}
          onClose={() => setWelcomePopupOpen(false)}
        >
          <Welcome
            contentKey={welcomePopupContentKey}
            showDisableCheckbox={!locationIsMarineManager}
          />
        </Modal>
      )}
    </Fragment>
  )
}

export default AppModals
