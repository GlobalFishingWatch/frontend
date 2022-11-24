import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import DownloadActivityCsv from 'feature/download-activity-csv/download-activity-csv'
import { Button, Icon, IconButton, ButtonType } from '@globalfishingwatch/ui-components'
import { selectFilterUpdated } from 'features/event-filters/filters.selectors'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectCurrentUserProfileHasInsurerPermission } from 'features/profile/profile.selectors'
import DateRangeLabel from 'features/date-range-label/date-range-label'
import { selectFilters } from './filters.slice'
import styles from './EventFiltersButton.module.css'

interface ButtonProps {
  className?: string
  type?: ButtonType
  onClick?: () => void
  onDownloadAllActivityCsv?: () => void
  onDownloadFilteredActivityCsv?: () => void
  onReadmeClick?: () => void
}

const EventFiltersButton: React.FC<ButtonProps> = ({ className, ...props }): React.ReactElement => {
  const { t } = useTranslation()
  const filtersApplied = useSelector(selectFilterUpdated)
  const filters = useSelector(selectFilters)
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)

  return (
    <Fragment>
      {currentProfileIsInsurer && <DateRangeLabel type={props.type} className={className} />}
      {!currentProfileIsInsurer && !filtersApplied && (
        <IconButton
          type={props?.type === 'default' ? 'map-tool' : 'solid'}
          icon={'filter-off'}
          size="medium"
          tooltip={t('map.filters', 'Filter events')}
          onClick={props?.onClick ?? (() => void 0)}
        />
      )}
      {!currentProfileIsInsurer && filtersApplied && (
        <Button {...props} className={cx(styles.filterBtn, className)}>
          <Icon type="default" icon={filtersApplied ? 'filter-on' : 'filter-off'} />
          <FiltersLabel filters={filters} />
        </Button>
      )}
      {!currentProfileIsInsurer &&
        (props.onDownloadAllActivityCsv !== undefined ||
          props.onDownloadFilteredActivityCsv !== undefined ||
          props.onReadmeClick !== undefined) && (
          <DownloadActivityCsv
            filtersApplied
            onDownloadAllActivityCsv={props.onDownloadAllActivityCsv}
            onDownloadFilteredActivityCsv={props.onDownloadFilteredActivityCsv}
            onReadmeClick={props.onReadmeClick}
          />
        )}
    </Fragment>
  )
}

export default EventFiltersButton
