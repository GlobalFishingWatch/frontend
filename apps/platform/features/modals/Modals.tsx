import { Fragment, lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useSessionStorage } from '@globalfishingwatch/react-hooks'
import { Modal } from '@globalfishingwatch/ui-components/modal'

import { selectDownloadActivityAreaKey } from 'features/_map/download/downloadActivity.slice'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import { selectIsWorkspaceReady } from 'features/_map/workspace/workspace.selectors'
import { setWorkspaceSuggestSave } from 'features/_map/workspace/workspace.slice'
import GFWOnly from 'features/_user/GFWOnly'
import { selectIsGFWUser, selectIsJACUser } from 'features/_user/selectors/user.selectors'
import { selectVesselGroupModalOpen } from 'features/_user/vessel-groups/vessel-groups-modal.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDebugActive, toggleDebugMenu } from 'features/debug/debug.slice'
import { selectAnyAppModalOpen, selectWelcomeModalKey } from 'features/modals/modals.selectors'
import {
  selectBigQueryModalOpen,
  selectCreateWorkspaceModalOpen,
  selectDatasetUploadModalOpen,
  selectDownloadTrackModalOpen,
  selectEditorMenuOpen,
  selectEditWorkspaceModalOpen,
  selectFeedbackModalOpen,
  selectLayerLibraryModalOpen,
  selectOnboardingModalOpen,
  selectTurningTidesModalOpen,
  setModalOpen,
  toggleBigQueryModal,
  toggleEditorMenu,
  toggleTurningTidesModal,
} from 'features/modals/modals.slice'
import { useOnboardingAutoOpen } from 'features/onboarding/onboarding.auto-open.hooks'
import useSecretMenu, { useSecretKeyboardCombo } from 'hooks/secret-menu.hooks'
import { getRouterRef } from 'router/router-ref'
import { SAVE_WORKSPACE_BEFORE_LEAVE_KEY } from 'router/routes'
import { ROUTE_PATHS } from 'router/routes.utils'
import { getIsBrowser } from 'utils/dom'

import styles from './Modals.module.css'

const CreateWorkspaceModal = lazy(() => import('features/_map/workspace/save/WorkspaceCreateModal'))
const EditWorkspaceModal = lazy(() => import('features/_map/workspace/save/WorkspaceEditModal'))
const NewDataset = lazy(() => import('features/_map/datasets/upload/NewDataset'))
const BigQueryModal = lazy(() => import('features/_map/bigquery/BigQueryModal'))
const TurningTidesModal = lazy(() => import('features/_map/bigquery/TurningTidesModal'))
const LayerLibrary = lazy(() => import('features/_map/layer-library/LayerLibrary'))
const DebugMenu = lazy(() => import('features/debug/DebugMenu'))
const DownloadActivityModal = lazy(() => import('features/_map/download/DownloadActivityModal'))
const DownloadTrackModal = lazy(() => import('features/_map/download/DownloadTrackModal'))
const EditorMenu = lazy(() => import('features/_map/editor/EditorMenu'))
const Welcome = lazy(() => import('features/welcome/Welcome'))
const VesselGroupModal = lazy(() => import('features/_user/vessel-groups/VesselGroupModal'))
const FeedbackModal = lazy(() => import('features/feedback/FeedbackModal'))
const OnboardingModal = lazy(() => import('features/onboarding/OnboardingModal'))

const DebugMenuConfig = {
  key: 'd',
  dispatchToggle: toggleDebugMenu,
  selectMenuActive: selectDebugActive,
  guestEnabled: getIsBrowser() && window.location.hostname === 'localhost',
}

const EditorMenuConfig = {
  key: 'e',
  dispatchToggle: toggleEditorMenu,
  selectMenuActive: selectEditorMenuOpen,
}

const BigQueryMenuConfig = {
  key: 'b',
  dispatchToggle: toggleBigQueryModal,
  selectMenuActive: selectBigQueryModalOpen,
}

const TurningTidesMenuConfig = {
  key: 't',
  dispatchToggle: toggleTurningTidesModal,
  selectMenuActive: selectTurningTidesModalOpen,
}

const ResetWorkspaceConfig = {
  key: 'w',
  dispatchToggle: () => {
    getRouterRef()?.navigate({ to: ROUTE_PATHS.MAP, search: {}, replace: true })
  },
}

const AppModals = () => {
  useOnboardingAutoOpen()
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

  useSecretKeyboardCombo(ResetWorkspaceConfig)
  const downloadActivityAreaKey = useSelector(selectDownloadActivityAreaKey)
  const isVesselGroupModalOpen = useSelector(selectVesselGroupModalOpen)
  const isDatasetUploadModalOpen = useSelector(selectDatasetUploadModalOpen)
  const isLayerLibraryModalOpen = useSelector(selectLayerLibraryModalOpen)
  const downloadTrackModalOpen = useSelector(selectDownloadTrackModalOpen)
  const editWorkspaceModalOpen = useSelector(selectEditWorkspaceModalOpen)
  const createWorkspaceModalOpen = useSelector(selectCreateWorkspaceModalOpen)
  const anyAppModalOpen = useSelector(selectAnyAppModalOpen)
  const feedbackModalOpen = useSelector(selectFeedbackModalOpen)
  const welcomePopupContentKey = useSelector(selectWelcomeModalKey)
  const onboardingModalOpen = useSelector(selectOnboardingModalOpen)

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
      {isLayerLibraryModalOpen && (
        <Modal
          title={t((t) => t.common.layerLibrary, {
            defaultValue: 'Layer Library',
          })}
          isOpen
          onClose={() => dispatch(setModalOpen({ id: 'layerLibrary', open: false }))}
          contentClassName={styles.layerLibraryModal}
          size="fullscreen"
          shouldCloseOnEsc
        >
          <Suspense fallback={null}>
            <LayerLibrary />
          </Suspense>
        </Modal>
      )}
      {debugActive && !anyAppModalOpen && (
        <Modal
          title={
            <Fragment>
              Secret debug menu 🤖
              {isGFWUser && <GFWOnly userGroup="gfw" />}
            </Fragment>
          }
          isOpen
          shouldCloseOnEsc
          onClose={dispatchToggleDebugMenu}
          contentClassName={styles.debugMenuModal}
        >
          <Suspense fallback={null}>
            <DebugMenu />
          </Suspense>
        </Modal>
      )}
      {isGFWUser && editorActive && !anyAppModalOpen && (
        <Modal
          title={
            <Fragment>
              Workspace editor 📝
              <GFWOnly userGroup="gfw" />
            </Fragment>
          }
          isOpen
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <Suspense fallback={null}>
            <EditorMenu />
          </Suspense>
        </Modal>
      )}
      {(isGFWUser || jacUser) && (bigqueryActive || turningTidesActive) && !anyAppModalOpen && (
        <Fragment>
          <Modal
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
            <Suspense fallback={null}>
              <BigQueryModal />
            </Suspense>
          </Modal>
          <Modal
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
            <Suspense fallback={null}>
              <TurningTidesModal />
            </Suspense>
          </Modal>
        </Fragment>
      )}
      {!isVesselGroupModalOpen && isDatasetUploadModalOpen && (
        <Suspense fallback={null}>
          <NewDataset />
        </Suspense>
      )}
      {editWorkspaceModalOpen && (
        <Suspense fallback={null}>
          <EditWorkspaceModal />
        </Suspense>
      )}
      {createWorkspaceModalOpen && (
        <Suspense fallback={null}>
          <CreateWorkspaceModal />
        </Suspense>
      )}
      {downloadActivityAreaKey && (
        <Suspense fallback={null}>
          <DownloadActivityModal />
        </Suspense>
      )}
      {downloadTrackModalOpen && (
        <Suspense fallback={null}>
          <DownloadTrackModal />
        </Suspense>
      )}
      {feedbackModalOpen && (
        <Suspense fallback={null}>
          <FeedbackModal
            isOpen
            onClose={() => dispatch(setModalOpen({ id: 'feedback', open: false }))}
          />
        </Suspense>
      )}
      {!readOnly && isWorkspaceReady && (
        <Fragment>
          {/* Please don't judge this piece of code, it is needed to avoid race-conditions in the useLocalStorage internal hook */}
          {welcomePopupContentKey === 'vessel-profile' && (
            <Suspense fallback={null}>
              <Welcome contentKey="vessel-profile" />
            </Suspense>
          )}
          {welcomePopupContentKey === 'deep-sea-mining' && (
            <Suspense fallback={null}>
              <Welcome contentKey="deep-sea-mining" />
            </Suspense>
          )}
        </Fragment>
      )}
      {onboardingModalOpen && (
        <Suspense fallback={null}>
          <OnboardingModal />
        </Suspense>
      )}
      {isVesselGroupModalOpen && (
        <Suspense fallback={null}>
          <VesselGroupModal />
        </Suspense>
      )}
    </Fragment>
  )
}

export default AppModals
