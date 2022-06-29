import { Fragment, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { replace } from 'redux-first-router'
import { useLocalStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'
import { WorkspaceCategories } from 'data/workspaces'
import { isGFWUser } from 'features/user/user.slice'
import { DISABLE_WELCOME_POPUP } from 'features/welcome/Welcome'
import { selectLocationCategory } from 'routes/routes.selectors'
import { selectReadOnly } from 'features/app/app.selectors'
import { selectDebugActive, toggleDebugMenu } from 'features/debug/debug.slice'
import { selectEditorActive, toggleEditorMenu } from 'features/editor/editor.slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import useSecretMenu, { useSecretKeyboardCombo } from 'hooks/secret-menu.hooks'
import { selectBigQueryActive, toggleBigQueryMenu } from 'features/bigquery/bigquery.slice'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectDownloadTrackId } from 'features/download/downloadTrack.slice'
import GFWOnly from 'features/user/GFWOnly'
import styles from './App.module.css'

const BigQueryMenu = dynamic(
  () => import(/* webpackChunkName: "BigQueryMenu" */ 'features/bigquery/BigQuery')
)
const DebugMenu = dynamic(
  () => import(/* webpackChunkName: "DebugMenu" */ 'features/debug/DebugMenu')
)
const DownloadActivityModal = dynamic(
  () =>
    import(
      /* webpackChunkName: "DownloadActivityModal" */ 'features/download/DownloadActivityModal'
    )
)
const DownloadTrackModal = dynamic(
  () => import(/* webpackChunkName: "DownloadTrackModal" */ 'features/download/DownloadTrackModal')
)
const EditorMenu = dynamic(
  () => import(/* webpackChunkName: "EditorMenu" */ 'features/editor/EditorMenu')
)
const Welcome = dynamic(() => import(/* webpackChunkName: "Welcome" */ 'features/welcome/Welcome'))

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

const ResetWorkspaceConfig = {
  key: 'w',
  onToggle: () => {
    replace(window.location.origin)
  },
}

const AppModals = () => {
  const isFirstTimeVisit =
    typeof window !== 'undefined' ? !localStorage.getItem(MARINE_MANAGER_LAST_VISIT) : false
  const readOnly = useSelector(selectReadOnly)
  const gfwUser = useSelector(isGFWUser)
  const [debugActive, dispatchToggleDebugMenu] = useSecretMenu(DebugMenuConfig)
  const [editorActive, dispatchToggleEditorMenu] = useSecretMenu(EditorMenuConfig)
  const [bigqueryActive, dispatchBigQueryMenu] = useSecretMenu(BigQueryMenuConfig)
  useSecretKeyboardCombo(ResetWorkspaceConfig)
  const downloadActivityAreaKey = useSelector(selectDownloadActivityAreaKey)
  const downloadTrackId = useSelector(selectDownloadTrackId)
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
          title={
            <Fragment>
              Secret debug menu 🤖
              <GFWOnly />
            </Fragment>
          }
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
          title={
            <Fragment>
              Workspace editor 📝
              <GFWOnly />
            </Fragment>
          }
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
          title={
            <Fragment>
              Big query datasets creation 🧠
              <GFWOnly />
            </Fragment>
          }
          isOpen={bigqueryActive}
          onClose={dispatchBigQueryMenu}
          contentClassName={styles.bqModal}
        >
          <BigQueryMenu />
        </Modal>
      )}
      {downloadActivityAreaKey && <DownloadActivityModal />}
      {downloadTrackId && <DownloadTrackModal />}
      {welcomePopupOpen && !readOnly && (
        <Modal
          header={false}
          appSelector={ROOT_DOM_ELEMENT}
          shouldCloseOnEsc
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
