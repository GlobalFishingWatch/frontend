import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { selectAllVisibleVesselGroups } from 'features/user/user.selectors'
import { getVesselGroupLabel } from 'features/vessel-groups/vessel-groups.utils'

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectAllVisibleVesselGroups)

  return useMemo(() => {
    const vesselGroupsOptions: MultiSelectOption[] = vesselGroups.map((vesselGroup) => ({
      id: vesselGroup.id.toString(),
      label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
        name: getVesselGroupLabel(vesselGroup),
        count: vesselGroup.vessels.length,
      }) as string,
    }))
    return vesselGroupsOptions
  }, [t, vesselGroups])
}
