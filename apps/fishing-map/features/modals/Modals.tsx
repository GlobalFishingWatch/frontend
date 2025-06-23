import { Fragment, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { replace } from 'redux-first-router'

import { useSessionStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { WorkspaceCategory } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectBigQueryActive, toggleBigQueryMenu } from 'features/bigquery/bigquery.slice'
import {
  FeatureFlag,
  selectDebugActive,
  toggleDebugMenu,
  toggleFeatureFlag,
} from 'features/debug/debug.slice'
import { selectDownloadTrackModalOpen } from 'features/download/download.selectors'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectEditorActive, toggleEditorMenu } from 'features/editor/editor.slice'
import { selectAnyAppModalOpen, selectWelcomeModalKey } from 'features/modals/modals.selectors'
import {
  selectDatasetUploadModalOpen,
  selectLayerLibraryModalOpen,
  selectWorkspaceGeneratorModalOpen,
  setModalOpen,
} from 'features/modals/modals.slice'
import GFWOnly from 'features/user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import CreateWorkspaceModal from 'features/workspace/save/WorkspaceCreateModal'
import EditWorkspaceModal from 'features/workspace/save/WorkspaceEditModal'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import useSecretMenu, { useSecretKeyboardCombo } from 'hooks/secret-menu.hooks'
import { SAVE_WORKSPACE_BEFORE_LEAVE_KEY } from 'routes/routes'

import styles from './Modals.module.css'

const NewDataset = dynamic(
  () => import(/* webpackChunkName: "NewDataset" */ 'features/datasets/upload/NewDataset')
)

const BigQueryMenu = dynamic(
  () => import(/* webpackChunkName: "BigQueryMenu" */ 'features/bigquery/BigQuery')
)

const LayerLibrary = dynamic(
  () => import(/* webpackChunkName: "LayerLibrary" */ 'features/layer-library/LayerLibrary')
)
const DebugMenu = dynamic(
  () => import(/* webpackChunkName: "DebugMenu" */ 'features/debug/DebugMenu')
)

const WorkspaceGenerator = dynamic(
  () =>
    import(
      /* webpackChunkName: "WorkspaceGenerator" */ 'features/workspace-generator/WorkspaceGenerator'
    )
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

const VesselGroupModal = dynamic(
  () => import(/* webpackChunkName: "VesselGroup" */ 'features/vessel-groups/VesselGroupModal')
)

const DebugMenuConfig = {
  key: 'd',
  dispatchToggle: toggleDebugMenu,
  selectMenuActive: selectDebugActive,
}

const EditorMenuConfig = {
  key: 'e',
  dispatchToggle: toggleEditorMenu,
  selectMenuActive: selectEditorActive,
}

const BigQueryMenuConfig = {
  key: 'b',
  dispatchToggle: toggleBigQueryMenu,
  selectMenuActive: selectBigQueryActive,
}

const ResetWorkspaceConfig = {
  key: 'w',
  dispatchToggle: () => {
    replace(window.location.origin)
  },
}

const AppModals = () => {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const isGFWUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)
  const dispatch = useAppDispatch()
  const [debugActive, dispatchToggleDebugMenu] = useSecretMenu(DebugMenuConfig)
  const [editorActive, dispatchToggleEditorMenu] = useSecretMenu(EditorMenuConfig)
  const [bigqueryActive, dispatchBigQueryMenu] = useSecretMenu(BigQueryMenuConfig)

  const workspaceGeneratorConfig = useMemo(
    () => ({
      keys: 'iaiaia',
      onToggle: () => dispatch(toggleFeatureFlag(FeatureFlag.WorkspaceGenerator)),
      selectMenuActive: selectWorkspaceGeneratorModalOpen,
    }),
    [dispatch]
  )
  const [workspaceGeneratorActive, dispatchWorkspaceGeneratorMenu] =
    useSecretMenu(workspaceGeneratorConfig)

  useSecretKeyboardCombo(ResetWorkspaceConfig)
  const downloadActivityAreaKey = useSelector(selectDownloadActivityAreaKey)
  const isVesselGroupModalOpen = useSelector(selectVesselGroupModalOpen)
  const isDatasetUploadModalOpen = useSelector(selectDatasetUploadModalOpen)
  const isLayerLibraryModalOpen = useSelector(selectLayerLibraryModalOpen)
  const downloadTrackModalOpen = useSelector(selectDownloadTrackModalOpen)
  const anyAppModalOpen = useSelector(selectAnyAppModalOpen)
  const welcomePopupContentKey = useSelector(selectWelcomeModalKey)

  const [saveWorkspaceBeforeLeave, setSaveWorkspaceBeforeLeave] = useSessionStorage<
    boolean | undefined
  >(SAVE_WORKSPACE_BEFORE_LEAVE_KEY, undefined)

  useEffect(() => {
    if (saveWorkspaceBeforeLeave === false) {
      dispatch(setWorkspaceSuggestSave(false))
    } else if (saveWorkspaceBeforeLeave === true) {
      dispatch(setModalOpen({ id: 'createWorkspace', open: true }))
      setSaveWorkspaceBeforeLeave(false)
    }
  }, [dispatch])

  return (
    <Fragment>
      {isGFWUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <Fragment>
              Secret debug menu 🤖
              <GFWOnly userGroup="gfw" />
            </Fragment>
          }
          isOpen={debugActive && !anyAppModalOpen}
          shouldCloseOnEsc
          onClose={dispatchToggleDebugMenu}
        >
          <DebugMenu />
        </Modal>
      )}
      {isGFWUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <Fragment>
              Workspace editor 📝
              <GFWOnly userGroup="gfw" />
            </Fragment>
          }
          isOpen={editorActive && !anyAppModalOpen}
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <EditorMenu />
        </Modal>
      )}
      {(isGFWUser || jacUser) && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <Fragment>
              Big query datasets creation 🧠
              <GFWOnly userGroup="gfw" />
            </Fragment>
          }
          isOpen={bigqueryActive && !anyAppModalOpen}
          onClose={dispatchBigQueryMenu}
          contentClassName={styles.bqModal}
        >
          <BigQueryMenu />
        </Modal>
      )}
      <Modal
        appSelector={ROOT_DOM_ELEMENT}
        title={t('common.layerLibrary', 'Layer Library')}
        isOpen={isLayerLibraryModalOpen}
        onClose={() => dispatch(setModalOpen({ id: 'layerLibrary', open: false }))}
        contentClassName={styles.layerLibraryModal}
        size="fullscreen"
      >
        <LayerLibrary />
      </Modal>
      {isGFWUser && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          isOpen={workspaceGeneratorActive && !anyAppModalOpen}
          shouldCloseOnEsc
          onClose={() => dispatch(setModalOpen({ id: 'workspaceGenerator', open: false }))}
          contentClassName={styles.workspaceGeneratorModal}
          header={false}
        >
          <WorkspaceGenerator />
        </Modal>
      )}
      {!isVesselGroupModalOpen && isDatasetUploadModalOpen && <NewDataset />}
      <EditWorkspaceModal />
      <CreateWorkspaceModal />
      {downloadActivityAreaKey && <DownloadActivityModal />}
      {downloadTrackModalOpen && <DownloadTrackModal />}
      {!readOnly && (
        <Fragment>
          {/* Please don't judge this piece of code, it is needed to avoid race-conditions in the useLocalStorage internal hook */}
          {welcomePopupContentKey === 'vessel-profile' && <Welcome contentKey="vessel-profile" />}
          {welcomePopupContentKey === 'deep-sea-mining' && <Welcome contentKey="deep-sea-mining" />}
          {welcomePopupContentKey === WorkspaceCategory.FishingActivity && (
            <Welcome contentKey={WorkspaceCategory.FishingActivity} />
          )}
          {welcomePopupContentKey === WorkspaceCategory.MarineManager && (
            <Welcome contentKey={WorkspaceCategory.MarineManager} />
          )}
          {/* also, this was done 2 days before the release, end of the history */}
        </Fragment>
      )}
      {isVesselGroupModalOpen && <VesselGroupModal />}
    </Fragment>
  )
}

export default AppModals
