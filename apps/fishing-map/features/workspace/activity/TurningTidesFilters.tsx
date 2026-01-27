import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { MultiSelectOnChange } from '@globalfishingwatch/ui-components'
import { Button, MultiSelect } from '@globalfishingwatch/ui-components'

import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from '../shared/LayerFilters.module.css'

type LayerFiltersProps = {
  dataview: UrlDataviewInstance
  onConfirmCallback?: () => void
}

function TurningTidesFilters({
  dataview,
  onConfirmCallback,
}: LayerFiltersProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const [vesselsSelected, setVesselsSelected] = useState<string[]>(
    dataview.config?.filters?.id || []
  )
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const vesselsOptions = vesselDataviews.map((d) => ({
    id: d.id.replace(VESSEL_LAYER_PREFIX, ''),
    label: d.config?.name || d.id,
  }))

  const vesselOptionsSelected = vesselsOptions.filter((d) => vesselsSelected.includes(d.id))

  const onConfirmFilters = () => {
    const allVesselsSelected = vesselDataviews.flatMap((dataview) => {
      const id = dataview.id.replace(VESSEL_LAYER_PREFIX, '')
      if (vesselsSelected.includes(id)) {
        return [id, ...(dataview.config?.relatedVesselIds || [])]
      }
      return []
    })
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { id: allVesselsSelected.length ? allVesselsSelected : undefined } },
    })
    if (onConfirmCallback) {
      onConfirmCallback()
    }
  }

  const onSelectVesselsClick: MultiSelectOnChange = (vessel) => {
    setVesselsSelected([...vesselsSelected, vessel.id])
  }

  const onRemoveVesselsClick: MultiSelectOnChange = (vessel) => {
    setVesselsSelected((prev) => prev?.filter((id: string) => id !== vessel.id))
  }

  const onCleanClick = () => {
    setVesselsSelected([])
  }

  if (!vesselDataviews?.length) {
    return (
      <p className={styles.placeholder}>{t((t) => t.trackCorrection.selectAtLeastOneVessel)}</p>
    )
  }

  return (
    <Fragment>
      <MultiSelect
        testId="turning-tides-filters"
        label={t((t) => t.common.vessels) as string}
        placeholder={getPlaceholderBySelections({
          selection: vesselOptionsSelected.map(({ id }) => id),
          options: vesselsOptions,
        })}
        options={vesselsOptions}
        labelContainerClassName={styles.labelContainer}
        selectedOptions={vesselOptionsSelected}
        onSelect={onSelectVesselsClick}
        onRemove={vesselOptionsSelected?.length > 0 ? onRemoveVesselsClick : undefined}
        onCleanClick={onCleanClick}
      />
      <div className={cx(styles.footer)}>
        <Button onClick={() => onConfirmFilters()}>{t((t) => t.common.confirm)}</Button>
      </div>
    </Fragment>
  )
}

export default TurningTidesFilters
