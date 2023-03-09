import { useCallback, useState } from 'react'
import { event as uaEvent } from 'react-ga'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { batch, useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { VesselWithDatasets } from 'features/search/search.slice'
import TooltipContainer from 'features/workspace/shared/TooltipContainer'
import { getEventLabel } from 'utils/analytics'
import {
  setVesselGroupEditId,
  setNewVesselGroupSearchVessels,
  setVesselGroupsModalOpen,
  MAX_VESSEL_GROUP_VESSELS,
} from 'features/vessel-groups/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectUserGroupsPermissions } from 'features/user/user.selectors'
import { ReportVesselWithDatasets } from 'features/reports/reports.selectors'
import styles from './VesselGroupAddButton.module.css'

function VesselGroupAddButton({
  vessels,
  showCount = true,
}: {
  vessels: (VesselWithDatasets | ReportVesselWithDatasets)[]
  showCount?: boolean
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const hasUserGroupsPermissions = useSelector(selectUserGroupsPermissions)
  const vesselGroupOptions = useVesselGroupsOptions()
  const [vesselGroupsOpen, setVesselGroupsOpen] = useState(false)
  const tooManyVessels = vessels?.length > MAX_VESSEL_GROUP_VESSELS

  const toggleVesselGroupsOpen = useCallback(() => {
    setVesselGroupsOpen(!vesselGroupsOpen)
  }, [vesselGroupsOpen])

  const onAddToVesselGroup = useCallback(
    async (vesselGroupId?: string) => {
      const vesselsWithDataset = vessels.map((vessel) => ({
        ...vessel,
        id: (vessel as VesselWithDatasets)?.id || (vessel as ReportVesselWithDatasets)?.vesselId,
        dataset:
          (vessel as VesselWithDatasets)?.dataset?.id ||
          (vessel as ReportVesselWithDatasets)?.infoDataset?.id,
      }))
      if (vesselsWithDataset?.length) {
        batch(() => {
          if (vesselGroupId) {
            dispatch(setVesselGroupEditId(vesselGroupId))
            uaEvent({
              category: 'Vessel groups',
              action: `Use the 'add to vessel group' functionality from report`,
              label: getEventLabel([
                vesselsWithDataset.length.toString(),
                ...vesselsWithDataset.map((vessel) => vessel.id),
              ]),
            })
          }
          dispatch(setNewVesselGroupSearchVessels(vesselsWithDataset))
          dispatch(setVesselGroupsModalOpen(true))
        })
      } else {
        console.warn('No related activity datasets founds for', vesselsWithDataset)
      }
    },
    [dispatch, vessels]
  )
  return (
    <TooltipContainer
      visible={vesselGroupsOpen}
      onClickOutside={toggleVesselGroupsOpen}
      component={
        <ul className={styles.groupOptions}>
          <li
            className={cx(styles.groupOption, styles.groupOptionNew)}
            onClick={() => onAddToVesselGroup()}
            key="new-group"
          >
            {t('vesselGroup.createNewGroup', 'Create new group')}
          </li>
          {vesselGroupOptions.map((group) => (
            <li
              className={styles.groupOption}
              key={group.id}
              onClick={() => onAddToVesselGroup(group.id)}
            >
              {group.label}
            </li>
          ))}
        </ul>
      }
    >
      <div>
        {hasUserGroupsPermissions && (
          <Button
            type="secondary"
            className={styles.button}
            onClick={toggleVesselGroupsOpen}
            disabled={!vessels?.length || tooManyVessels}
            tooltip={
              tooManyVessels
                ? t('vesselGroup.tooManyVessels', {
                    count: MAX_VESSEL_GROUP_VESSELS,
                    defaultValue: 'Maximum number of vessels is {{count}}',
                  })
                : ''
            }
            tooltipPlacement="top"
          >
            {t('vesselGroup.add', 'Add to group')}
            {showCount ? ` (${vessels.length})` : ''}
          </Button>
        )}
      </div>
    </TooltipContainer>
  )
}

export default VesselGroupAddButton
