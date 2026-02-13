import { Fragment, lazy, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useSessionStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import { WorkspaceCategory } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import {
  selectBigQueryActive,
  selectTurningTidesActive,
  toggleBigQueryModal,
  toggleTurningTidesModal,
} from 'features/bigquery/bigquery.slice'
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
import { selectIsWorkspaceReady } from 'features/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import useSecretMenu, { useSecretKeyboardCombo } from 'hooks/secret-menu.hooks'
import { getRouterRef } from 'router/router-ref'
import { SAVE_WORKSPACE_BEFORE_LEAVE_KEY } from 'router/routes'
import { ROUTE_PATHS } from 'router/routes.utils'

import styles from './Modals.module.css'

const NewDataset = lazy(() => import('features/datasets/upload/NewDataset'))
const BigQueryModal = lazy(() => import('features/bigquery/BigQueryModal'))
const TurningTidesModal = lazy(() => import('features/bigquery/TurningTidesModal'))
const LayerLibrary = lazy(() => import('features/layer-library/LayerLibrary'))
const DebugMenu = lazy(() => import('features/debug/DebugMenu'))
const WorkspaceGenerator = lazy(() => import('features/workspace-generator/WorkspaceGenerator'))
const DownloadActivityModal = lazy(() => import('features/download/DownloadActivityModal'))
const DownloadTrackModal = lazy(() => import('features/download/DownloadTrackModal'))
const EditorMenu = lazy(() => import('features/editor/EditorMenu'))
const Welcome = lazy(() => import('features/welcome/Welcome'))
const VesselGroupModal = lazy(() => import('features/vessel-groups/VesselGroupModal'))

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
  dispatchToggle: toggleBigQueryModal,
  selectMenuActive: selectBigQueryActive,
}

const TurningTidesMenuConfig = {
  key: 't',
  dispatchToggle: toggleTurningTidesModal,
  selectMenuActive: selectTurningTidesActive,
}

const ResetWorkspaceConfig = {
  key: 'w',
  dispatchToggle: () => {
    getRouterRef().navigate({ to: ROUTE_PATHS.HOME, search: {}, replace: true })
  },
}

const AppModals = () => {
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const isGFWUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)
  const isWorkspaceReady = useSelector(selectIsWorkspaceReady)
  const dispatch = useAppDispatch()
  const [debugActive, dispatchToggleDebugMenu] = useSecretMenu(DebugMenuConfig)
  const [editorActive, dispatchToggleEditorMenu] = useSecretMenu(EditorMenuConfig)
  const [bigqueryActive, dispatchBigQueryMenu] = useSecretMenu(BigQueryMenuConfig)
  const [turningTidesActive, dispatchTurningTidesMenu] = useSecretMenu(TurningTidesMenuConfig)

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
      <Modal
        appSelector={ROOT_DOM_ELEMENT}
        title={t((t) => t.common.layerLibrary, {
          defaultValue: 'Layer Library',
        })}
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
      {(isGFWUser || jacUser) && (bigqueryActive || turningTidesActive) && !anyAppModalOpen && (
        <Fragment>
          <Modal
            appSelector={ROOT_DOM_ELEMENT}
            title={
              <Fragment>
                Big query datasets creation 🧠
                <GFWOnly userGroup="gfw" />
              </Fragment>
            }
            isOpen={bigqueryActive}
            onClose={dispatchBigQueryMenu}
            contentClassName={styles.bqModal}
          >
            <BigQueryModal />
          </Modal>
          <Modal
            appSelector={ROOT_DOM_ELEMENT}
            title={
              <Fragment>
                Turning tides datasets creation 🌊
                <GFWOnly userGroup="gfw" />
              </Fragment>
            }
            isOpen={turningTidesActive}
            onClose={dispatchTurningTidesMenu}
            contentClassName={styles.bqModal}
          >
            <TurningTidesModal />
          </Modal>
        </Fragment>
      )}
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
      {!readOnly && isWorkspaceReady && (
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
