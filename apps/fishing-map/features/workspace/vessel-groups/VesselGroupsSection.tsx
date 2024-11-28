import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from 'features/workspace/shared/Sections.module.css'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import VesselGroupListTooltip from 'features/vessel-groups/VesselGroupListTooltip'
import { selectVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectVesselGroupsStatusId,
  selectWorkspaceVesselGroupsStatus,
} from 'features/vessel-groups/vessel-groups.slice'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import { NEW_VESSEL_GROUP_ID } from 'features/vessel-groups/vessel-groups.hooks'
import { AsyncReducerStatus } from 'utils/async-slice'
import { getVesselGroupDataviewInstance } from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import LayerPanelContainer from '../shared/LayerPanelContainer'
import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from '../highlight-panel/highlight-panel.content'
import { setWorkspaceSuggestSave } from '../workspace.slice'
import VesselGroupLayerPanel from './VesselGroupsLayerPanel'

const MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION = {
  id: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
}

function VesselGroupSection(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataviews = useSelector(selectVesselGroupDataviews)
  const workspaceVesselGroupsStatus = useSelector(selectWorkspaceVesselGroupsStatus)
  const vesselGroupsStatusId = useSelector(selectVesselGroupsStatusId)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const hasVisibleDataviews = dataviews?.some((dataview) => dataview.config?.visible === true)
  const readOnly = useSelector(selectReadOnly)

  const onAddVesselGroupClick = useCallback(
    (vesselGroupId: string) => {
      if (vesselGroupId === NEW_VESSEL_GROUP_ID) {
        dispatch(setVesselGroupsModalOpen(true))
      } else {
        trackEvent({
          category: TrackCategory.VesselGroups,
          action: 'Click to add vessel group to workspace',
        })

        const dataviewInstance = getVesselGroupDataviewInstance(vesselGroupId)
        if (dataviewInstance) {
          upsertDataviewInstance(dataviewInstance)
        }
      }
      dispatch(setWorkspaceSuggestSave(true))
    },
    [dispatch, upsertDataviewInstance]
  )

  return (
    <div className={cx(styles.container, { 'print-hidden': !hasVisibleDataviews })}>
      <div className={cx('print-hidden', styles.header)}>
        <h2 className={styles.sectionTitle}>{t('vesselGroup.vesselGroups', 'Vessel groups')}</h2>
        {!readOnly && (
          <VesselGroupListTooltip onAddToVesselGroup={onAddVesselGroupClick}>
            <UserLoggedIconButton
              type="border"
              icon="vessel-group"
              size="medium"
              tooltip={t('vesselGroup.addToWorkspace', 'Add vessel group to workspace')}
              tooltipPlacement="top"
            />
          </VesselGroupListTooltip>
        )}
        <LayerPanelContainer dataview={MOCKED_DATAVIEW_TO_HIGHLIGHT_SECTION}>
          <span className={styles.highlightSpan}></span>
        </LayerPanelContainer>
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
          <div className={styles.emptyState}>
            {t(
              'workspace.emptyStateVesselGroups',
              'Add vessel groups to see group presence and operation footprint.'
            )}
          </div>
        )}
      </SortableContext>
    </div>
  )
}

export default VesselGroupSection
