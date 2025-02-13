import { Fragment, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'

import type { Report } from '@globalfishingwatch/api-types'
import { Locale } from '@globalfishingwatch/api-types'
import { IconButton, InputText, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  deleteReportThunk,
  fetchReportsThunk,
  selectReportsStatus,
  selectReportsStatusId,
} from 'features/reports/reports.slice'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { selectUserReports } from 'features/user/selectors/user.permissions.selectors'
import { resetWorkspaceSlice } from 'features/workspace/workspace.slice'
import { REPORT } from 'routes/routes'
import { AsyncReducerStatus } from 'utils/async-slice'
import { sortByCreationDate } from 'utils/dates'
import { getHighlightedText } from 'utils/text'

import styles from './User.module.css'

function getUserGuideReportLinkByLocale(locale: Locale) {
  if (locale === Locale.es) {
    return 'https://globalfishingwatch.org/es/guia-de-usuario/#An%C3%A1lisis%20y%20reportes%20din%C3%A1micos'
  } else if (locale === Locale.fr) {
    return 'https://globalfishingwatch.org/user-guide-french/#Analyses%20et%20rapports%20dynamiques'
  }
  return 'https://globalfishingwatch.org/user-guide/#Analysis%20and%20dynamic%20reports'
}

function UserReports() {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const reports = useSelector(selectUserReports)
  const reportsStatus = useSelector(selectReportsStatus)
  const reportsStatusId = useSelector(selectReportsStatusId)

  const [searchQuery, setSearchQuery] = useState('')

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    dispatch(fetchReportsThunk([]))
  }, [dispatch])

  const onReportClick = useCallback(
    (report: Report) => {
      dispatch(resetWorkspaceSlice())
      dispatch(resetReportData())
    },
    [dispatch]
  )

  const onDeleteClick = useCallback(
    (report: Report) => {
      const confirmation = window.confirm(
        `${t(
          'analysis.confirmRemove',
          'Are you sure you want to permanently delete this report?'
        )}\n${report.name}`
      )
      if (confirmation) {
        dispatch(deleteReportThunk(report))
      }
    },
    [dispatch, t]
  )
  const loading = reportsStatus === AsyncReducerStatus.Loading

  // TODO:CVP2 group reports by type when this PR https://github.com/GlobalFishingWatch/api-monorepo-node/pull/289 is merged
  return (
    <Fragment>
      <div className={styles.search}>
        <InputText
          type="search"
          value={searchQuery}
          onChange={onSearchQueryChange}
          placeholder="Search"
        />
      </div>
      <div className={styles.views}>
        <div className={styles.viewsHeader}>
          <label>{t('common.reports', 'Reports')}</label>
        </div>
        {loading ? (
          <div className={styles.placeholder}>
            <Spinner size="small" />
          </div>
        ) : reports && reports.length > 0 ? (
          <ul>
            {sortByCreationDate<Report>(reports).map((report) => {
              const label = report.name
              if (!label.toLowerCase().includes(searchQuery.toLowerCase())) {
                return null
              }
              return (
                <li className={styles.dataset} key={report.id}>
                  <Link
                    className={styles.workspaceLink}
                    to={{
                      type: REPORT,
                      payload: { reportId: report.id },
                      query: {},
                    }}
                    onClick={() => onReportClick(report)}
                  >
                    <span className={styles.workspaceTitle}>
                      {getHighlightedText(label as string, searchQuery, styles)}
                    </span>
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
            })}
          </ul>
        ) : (
          <div className={styles.placeholder}>
            <p>
              {t(
                'analysis.createReportHelp',
                'To explore how activity and environmental data changes over time, you can create a dynamic report containing analysis for any area. Dynamic reports offer a rapid way to access and understand more information about any ocean area, exclusive economic zone, marine protected area or area of interest. Dynamic reports help you understand how much activity is happening in each area, including which vessels and flag States are active.'
              )}{' '}
              <a
                className={styles.link}
                href={getUserGuideReportLinkByLocale(i18n.language as Locale)}
                target="_blank"
                rel="noreferrer"
              >
                {t('analysis.createReportHelpLink', 'Learn more.')}
              </a>
            </p>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default UserReports
