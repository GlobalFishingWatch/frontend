import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { ButtonType } from '@globalfishingwatch/ui-components';
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'

import DateRangeLabel from 'features/date-range-label/date-range-label'
import { selectIsFilterUpdated } from 'features/event-filters/filters.selectors'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectCurrentUserProfileHasInsurerPermission } from 'features/profile/profile.selectors'

import { selectFilters } from './filters.slice'

import styles from './EventFiltersButton.module.css'

interface ButtonProps {
  className?: string
  type?: ButtonType
  onClick?: () => void
}

const EventFiltersButton: React.FC<ButtonProps> = ({ className, ...props }): React.ReactElement<any> => {
  const { t } = useTranslation()
  const filtersApplied = useSelector(selectIsFilterUpdated)
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
    </Fragment>
  )
}

export default EventFiltersButton
