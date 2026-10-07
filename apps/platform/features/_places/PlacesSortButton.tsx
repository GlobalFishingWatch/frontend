import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Popover } from '@globalfishingwatch/ui-components/popover'

import type { PlaceCategory } from 'features/_places/places.loaders'
import { DEFAULT_PLACES_SORT } from 'features/_places/places.loaders'
import type { PlacesSort } from 'features/_places/places.types'
import { useAppSearch, useReplaceQueryParams } from 'router/routes.hook'

import styles from './PlacesSortButton.module.css'

/** Sort icon that opens the list orders; the choice lives in the URL as `placesSort`. */
function PlacesSortButton({ category }: { category: PlaceCategory }) {
  const { t } = useTranslation()
  const search = useAppSearch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const [open, setOpen] = useState(false)
  const sort = search.placesSort ?? DEFAULT_PLACES_SORT[category]
  // Activity is hours for areas, port visits for ports; ports have no size
  const options: { id: PlacesSort; label: string }[] =
    category === 'ports'
      ? [
          { id: 'activity', label: t((t) => t.places.sortByPortVisits) },
          { id: 'name', label: t((t) => t.places.sortByName) },
        ]
      : [
          { id: 'activity', label: t((t) => t.places.sortByActivity) },
          { id: 'area', label: t((t) => t.places.sortByArea) },
          { id: 'name', label: t((t) => t.places.sortByName) },
        ]

  const onSelect = (id: PlacesSort) => {
    // The default stays out of the URL
    replaceQueryParams({ placesSort: id === DEFAULT_PLACES_SORT[category] ? undefined : id })
    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      placement="bottom-end"
      showArrow={false}
      content={
        <ul>
          {options.map(({ id, label }) => (
            <li key={id}>
              <button
                className={cx(styles.sortOption, { [styles.sortOptionActive]: id === sort })}
                onClick={() => onSelect(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      }
    >
      <div>
        <IconButton
          icon="sort"
          type="border"
          tooltip={options.find(({ id }) => id === sort)?.label}
          onClick={() => setOpen(!open)}
        />
      </div>
    </Popover>
  )
}

export default PlacesSortButton
