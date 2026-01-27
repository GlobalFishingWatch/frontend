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

import Section from '../shared/Section'

import VesselGroupLayerPanel from './VesselGroupsLayerPanel'

import styles from 'features/workspace/shared/Section.module.css'

// Use this when needs to highlight a section instead of a dataview
// const MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION = {
//   id: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
// }

function VesselGroupSection(): React.ReactElement<any> {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataviews = useSelector(selectVesselGroupDataviews)
  const visibleDataviews = dataviews?.filter((dataview) => dataview.config?.visible === true)
  const hasVisibleDataviews = visibleDataviews.length >= 1
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)
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
    <Section
      id={DataviewCategory.VesselGroups}
      data-testid="vessel-groups-section"
      hasVisibleDataviews={hasVisibleDataviews}
      title={
        <span>
          {t((t) => t.vesselGroup.vesselGroups)}
          {hasVisibleDataviews && (
            <span className={styles.layersCount}>{` (${visibleDataviews.length})`}</span>
          )}
        </span>
      }
      headerOptions={
        <>
          {!readOnly && (
            <div
              className={cx(styles.sectionButtons, styles.sectionButtonsSecondary, 'print-hidden')}
            >
              <UserLoggedIconButton
                type="border"
                icon="vessel-group"
                size="medium"
                tooltip={t((t) => t.vesselGroup.createNewGroup)}
                tooltipPlacement="top"
                onClick={onAddVesselGroupClick}
              />
            </div>
          )}
          <div className={styles.sectionButtons}>
            <IconButton
              icon="plus"
              type="border"
              size="medium"
              tooltip={t((t) => t.vesselGroup.addToWorkspace)}
              tooltipPlacement="top"
              onClick={onAddClick}
            />
          </div>
        </>
      }
    >
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
              {t((t) => t.workspace.emptyStateVesselGroups)}
            </div>
            {/* <LayerPanelContainer dataview={MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION}>
              <span className={styles.highlightSpan}></span>
            </LayerPanelContainer> */}
          </div>
        )}
      </SortableContext>
    </Section>
  )
}

export default VesselGroupSection
