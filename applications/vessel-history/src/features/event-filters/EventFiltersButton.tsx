import React, { Fragment, useMemo } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'
import { ButtonType } from '@globalfishingwatch/ui-components/dist/button/Button'
import { selectFilterUpdated } from 'features/vessels/activity/vessels-activity.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { Filters, selectFilters } from './filters.slice'
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

  const filtersLabel = useMemo(() => {
    return (
      (Object.keys(filters) as (keyof Filters)[])
        // Exclude filters without value or false
        .filter((key) => !!filters[key])
        .map((key) => ({
          key,
          value: filters[key],
        }))
        .map(({ key, value }) => {
          if (['start', 'end'].includes(key)) {
            return `${capitalize(t(`filters.${key}` as any, key))}: ${formatI18nDate(
              value as string,
              {
                format: DateTime.DATE_SHORT,
              }
            )}`
          } else {
            return `${t(`settings.${key}.shortTitle` as any, key)}`
          }
        })
        .join(', ')
    )
  }, [filters, t])

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
          <span>{filtersLabel}</span>
        </Button>
      )}
    </Fragment>
  )
}

export default EventFiltersButton
