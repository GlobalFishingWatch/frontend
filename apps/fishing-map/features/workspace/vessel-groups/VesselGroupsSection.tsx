import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import { selectVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { selectUserVesselGroups } from 'features/user/selectors/user.permissions.selectors'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import {
  selectVesselGroupsStatusId,
  selectWorkspaceVesselGroupsStatus,
} from 'features/vessel-groups/vessel-groups.slice'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import { AsyncReducerStatus } from 'utils/async-slice'

import VesselGroupLayerPanel from './VesselGroupsLayerPanel'

import styles from 'features/workspace/shared/Sections.module.css'

// Use this when needs to highlight a section instead of a dataview
// const MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION = {
//   id: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
// }

function VesselGroupSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataviews = useSelector(selectVesselGroupDataviews)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const readOnly = useSelector(selectReadOnly)
  const userDatasets = useSelector(selectUserVesselGroups)

  const onAddVesselGroupClick = useCallback(() => {
    dispatch(setVesselGroupsModalOpen(true))
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'Click to add vessel group to workspace',
    })
  }, [dispatch])

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: `Open panel to add a reference layer`,
      value: userDatasets.length,
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: DataviewCategory.VesselGroups }))
  }, [dispatch, userDatasets.length])

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx('print-hidden', styles.header)}>
        <h2 className={styles.sectionTitle}>{t('vesselGroup.vesselGroups')}</h2>
        {!readOnly && (
          <div
            className={cx(styles.sectionButtons, styles.sectionButtonsSecondary, 'print-hidden')}
          >
            <UserLoggedIconButton
              type="border"
              icon="vessel-group"
              size="medium"
              tooltip={t('vesselGroup.createNewGroup')}
              tooltipPlacement="top"
              onClick={onAddVesselGroupClick}
            />
          </div>
        )}
        <IconButton
          icon="plus"
          type="border"
          size="medium"
          tooltip={t('vesselGroup.addToWorkspace')}
          tooltipPlacement="top"
          onClick={onAddClick}
        />
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview) => {
            return (
              <VesselGroupLayerPanel
                key={dataview.id}
                dataview={dataview}
                vesselGroupLoading={
                  (!dataview.vesselGroup &&
                    workspaceVesselGroupsStatus === AsyncReducerStatus.Loading) ||
                  dataview.vesselGroup?.id === vesselGroupsStatusId
                }
              />
            )
          })
        ) : (
          <div className={cx('print-hidden', styles.header)}>
            <div className={cx(styles.emptyState, styles.emptyStateVesselGroups)}>
              {t('workspace.emptyStateVesselGroups')}
            </div>
            {/* <LayerPanelContainer dataview={MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION}>
              <span className={styles.highlightSpan}></span>
            </LayerPanelContainer> */}
          </div>
        )}
      </SortableContext>
    </div>
  )
}

export default VesselGroupSection
