import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux'
import { replace } from 'redux-first-router'
import { useTranslation } from 'react-i18next'
import { Modal } from '@globalfishingwatch/ui-components'
import { selectIsGFWUser, selectIsJACUser } from 'features/user/selectors/user.selectors'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectDebugActive, toggleDebugMenu } from 'features/debug/debug.slice'
import { selectEditorActive, toggleEditorMenu } from 'features/editor/editor.slice'
import { ROOT_DOM_ELEMENT } from 'data/config'
import useSecretMenu, { useSecretKeyboardCombo } from 'hooks/secret-menu.hooks'
import { selectBigQueryActive, toggleBigQueryMenu } from 'features/bigquery/bigquery.slice'
import { selectDownloadActivityAreaKey } from 'features/download/downloadActivity.slice'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import GFWOnly from 'features/user/GFWOnly'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDatasetUploadModalOpen, setModalOpen } from 'features/modals/modals.slice'
import { selectAnyAppModalOpen, selectWelcomeModalKey } from 'features/modals/modals.selectors'
import { selectDownloadTrackModalOpen } from 'features/download/download.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import { selectLayerLibraryModalOpen } from 'features/modals/modals.slice'
import CreateWorkspaceModal from 'features/workspace/save/WorkspaceCreateModal'
import EditWorkspaceModal from 'features/workspace/save/WorkspaceEditModal'
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
  const { t } = useTranslation()
  const readOnly = useSelector(selectReadOnly)
  const gfwUser = useSelector(selectIsGFWUser)
  const jacUser = useSelector(selectIsJACUser)
  const dispatch = useAppDispatch()
  const [debugActive, dispatchToggleDebugMenu] = useSecretMenu(DebugMenuConfig)
  const [editorActive, dispatchToggleEditorMenu] = useSecretMenu(EditorMenuConfig)
  const [bigqueryActive, dispatchBigQueryMenu] = useSecretMenu(BigQueryMenuConfig)
  useSecretKeyboardCombo(ResetWorkspaceConfig)
  const downloadActivityAreaKey = useSelector(selectDownloadActivityAreaKey)
  const isVesselGroupModalOpen = useSelector(selectVesselGroupModalOpen)
  const isDatasetUploadModalOpen = useSelector(selectDatasetUploadModalOpen)
  const isLayerLibraryModalOpen = useSelector(selectLayerLibraryModalOpen)
  const downloadTrackModalOpen = useSelector(selectDownloadTrackModalOpen)
  const anyAppModalOpen = useSelector(selectAnyAppModalOpen)
  const welcomePopupContentKey = useSelector(selectWelcomeModalKey)

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
          isOpen={debugActive && !anyAppModalOpen}
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
          isOpen={editorActive && !anyAppModalOpen}
          contentClassName={styles.editorModal}
          onClose={dispatchToggleEditorMenu}
        >
          <EditorMenu />
        </Modal>
      )}
      {(gfwUser || jacUser) && (
        <Modal
          appSelector={ROOT_DOM_ELEMENT}
          title={
            <Fragment>
              Big query datasets creation 🧠
              <GFWOnly />
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
        fullScreen
      >
        <LayerLibrary />
      </Modal>
      {!isVesselGroupModalOpen && isDatasetUploadModalOpen && <NewDataset />}
      <EditWorkspaceModal />
      <CreateWorkspaceModal />
      {downloadActivityAreaKey && <DownloadActivityModal />}
      {downloadTrackModalOpen && <DownloadTrackModal />}
      {!readOnly && (
        <Fragment>
          {/* Please don't judge this piece of code, it is needed to avoid race-conditions in the useLocalStorage internal hook */}
          {welcomePopupContentKey === 'vessel-profile' && <Welcome contentKey="vessel-profile" />}
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
