import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SortableContext } from '@dnd-kit/sortable'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@globalfishingwatch/ui-components'
import styles from 'features/workspace/shared/Sections.module.css'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectReadOnly } from 'features/app/selectors/app.selectors'
import VesselGroupListTooltip, {
  NEW_VESSEL_GROUP_ID,
} from 'features/vessel-groups/VesselGroupListTooltip'
import { getVesselGroupDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectVesselGroupDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectAllVisibleVesselGroups } from 'features/user/selectors/user.permissions.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { setVesselGroupsModalOpen } from 'features/vessel-groups/vessel-groups.slice'
import UserLoggedIconButton from 'features/user/UserLoggedIconButton'
import VesselGroupLayerPanel from './VesselGroupsLayerPanel'

function VesselGroupSection(): React.ReactElement {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataviews = useSelector(selectVesselGroupDataviews)
  const allVesselGroups = useSelector(selectAllVisibleVesselGroups)
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
      </div>
      <SortableContext items={dataviews}>
        {dataviews.length > 0 ? (
          dataviews?.map((dataview) => {
            const vesselGroup = allVesselGroups.find((vesselGroup) =>
              dataview.config?.filters?.['vessel-groups'].includes(vesselGroup.id)
            )
            return (
              <VesselGroupLayerPanel
                key={dataview.id}
                dataview={dataview}
                vesselGroup={vesselGroup}
              />
            )
          })
        ) : (
          <div className={styles.emptyState}>
            {t(
              'workspace.emptyStateVessels',
              'The vessels selected in the search or by clicking on activity grid cells will appear here.'
            )}
          </div>
        )}
      </SortableContext>
    </div>
  )
}

export default VesselGroupSection
