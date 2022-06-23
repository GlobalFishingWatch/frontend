import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { Button, Spinner, IconButton, Modal } from '@globalfishingwatch/ui-components'
import { VesselGroup } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectVesselGroupsStatus,
  selectVesselGroupsStatusId,
  deleteVesselGroupThunk,
} from 'features/vesselGroup/vessel-groups.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectUserVesselGroups } from './user.selectors'
import styles from './User.module.css'

function UserVesselGroups() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselGroups = useSelector(selectUserVesselGroups)
  const vesselGroupsStatus = useSelector(selectVesselGroupsStatus)
  const vesselGroupStatusId = useSelector(selectVesselGroupsStatusId)
  const loading = vesselGroupsStatus === AsyncReducerStatus.Loading
  console.log(vesselGroupsStatus, vesselGroupStatusId)

  const onDeleteClick = useCallback(
    (vesselGroup: VesselGroup) => {
      const confirmation = window.confirm(
        `${t(
          'vesselGroup.confirmRemove',
          'Are you sure you want to permanently delete this vessel group?'
        )}\n${vesselGroup.name}`
      )
      if (confirmation) {
        dispatch(deleteVesselGroupThunk(vesselGroup.id.toString()))
      }
    },
    [dispatch, t]
  )

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('vesselGroup.vesselGroups', 'Vessel Groups')}</label>
      </div>
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {vesselGroups && vesselGroups.length > 0 ? (
            vesselGroups.map((vesselGroup) => {
              return (
                <li className={styles.dataset} key={vesselGroup.id}>
                  {vesselGroup.name}
                  <div>
                    {/* <InfoError
                      error={datasetError}
                      loading={datasetImporting}
                      tooltip={infoTooltip}
                      onClick={() => onInfoClick(dataset)}
                    />
                    {!datasetImporting && !datasetError && (
                      <IconButton
                        icon="edit"
                        tooltip={t('dataset.edit', 'Edit dataset')}
                        onClick={() => onEditClick(dataset)}
                      />
                    )} */}
                    <IconButton
                      icon="delete"
                      type="warning"
                      loading={vesselGroup.id === vesselGroupStatusId}
                      tooltip={t('vesselGroup.remove', 'Remove vessel group')}
                      onClick={() => onDeleteClick(vesselGroup)}
                    />
                  </div>
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>
              {t('vesselGroup.emptyState', 'Your vessel groups will appear here')}
            </div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserVesselGroups
