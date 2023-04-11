import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect } from 'react'
import Link from 'redux-first-router-link'
import { Spinner, IconButton } from '@globalfishingwatch/ui-components'
import { Report } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { sortByCreationDate } from 'utils/dates'
import {
  deleteReportThunk,
  fetchReportsThunk,
  selectReportsStatus,
  selectReportsStatusId,
} from 'features/reports/reports.slice'
import { REPORT } from 'routes/routes'
import { selectUserReports } from 'features/user/user.selectors'
import styles from './User.module.css'

function UserReports() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const reports = useSelector(selectUserReports)
  const reportsStatus = useSelector(selectReportsStatus)
  const reportsStatusId = useSelector(selectReportsStatusId)

  useEffect(() => {
    dispatch(fetchReportsThunk([]))
  }, [dispatch])

  const onDeleteClick = useCallback(
    (report: Report) => {
      const confirmation = window.confirm(
        `${t(
          'vesselGroup.confirmRemove',
          'Are you sure you want to permanently delete this vessel group?'
        )}\n${report.name}`
      )
      if (confirmation) {
        dispatch(deleteReportThunk(report))
      }
    },
    [dispatch, t]
  )
  const loading = reportsStatus === AsyncReducerStatus.Loading

  return (
    <div className={styles.views}>
      <div className={styles.viewsHeader}>
        <label>{t('common.reports', 'Reports')}</label>
      </div>
      {loading ? (
        <div className={styles.placeholder}>
          <Spinner size="small" />
        </div>
      ) : (
        <ul>
          {reports && reports.length > 0 ? (
            sortByCreationDate<Report>(reports).map((report) => {
              return (
                <li className={styles.dataset} key={report.id}>
                  <Link
                    className={styles.workspaceLink}
                    to={{
                      type: REPORT,
                      payload: { reportId: report.id },
                      query: {},
                    }}
                  >
                    <span className={styles.workspaceTitle}>{report.name}</span>
                    <IconButton icon="arrow-right" />
                  </Link>
                  <div>
                    <IconButton
                      icon="delete"
                      type="warning"
                      loading={report.id === reportsStatusId}
                      tooltip={'Delete'}
                      onClick={() => onDeleteClick(report)}
                    />
                  </div>
                </li>
              )
            })
          ) : (
            <div className={styles.placeholder}>Your reports will appear here</div>
          )}
        </ul>
      )}
    </div>
  )
}

export default UserReports
