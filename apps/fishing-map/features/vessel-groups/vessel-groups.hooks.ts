import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { selectAllVisibleVesselGroups } from 'features/user/user.selectors'

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectAllVisibleVesselGroups)

  return useMemo(() => {
    const vesselGroupsOptions: MultiSelectOption[] = vesselGroups.map(({ id, name, vessels }) => ({
      id: id.toString(),
      label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
        name,
        count: vessels.length,
      }),
    }))
    return vesselGroupsOptions
  }, [t, vesselGroups])
}
