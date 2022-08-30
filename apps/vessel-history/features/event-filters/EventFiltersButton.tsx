import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Icon, IconButton, ButtonType } from '@globalfishingwatch/ui-components'
import { selectFilterUpdated } from 'features/event-filters/filters.selectors'
import FiltersLabel from 'features/filters-label/filters-label'
import { selectFilters } from './filters.slice'
import styles from './EventFiltersButton.module.css'

interface ButtonProps {
  className?: string
  type?: ButtonType
  onClick?: () => void
}

const EventFiltersButton: React.FC<ButtonProps> = ({ className, ...props }): React.ReactElement => {
  const { t } = useTranslation()
  const filtersApplied = useSelector(selectFilterUpdated)
  const filters = useSelector(selectFilters)

  return (
    <Fragment>
      {!filtersApplied && (
        <IconButton
          type={props?.type === 'default' ? 'map-tool' : 'solid'}
          icon={'filter-off'}
          size="medium"
          tooltip={t('map.filters', 'Filter events')}
          onClick={props?.onClick ?? (() => void 0)}
        />
      )}
      {filtersApplied && (
        <Button {...props} className={cx(styles.filterBtn, className)}>
          <Icon type="default" icon={filtersApplied ? 'filter-on' : 'filter-off'} />
          <FiltersLabel filters={filters} />
        </Button>
      )}
    </Fragment>
  )
}

export default EventFiltersButton
