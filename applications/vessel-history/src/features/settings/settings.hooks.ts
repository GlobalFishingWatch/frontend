import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import {
  selectSettings,
  Settings,
  SettingsEvents,
  SettingsPortVisits,
  updateSettings,
} from './settings.slice'

export const useSettingsConnect = () => {
  const dispatch = useDispatch()
  const settings = useSelector(selectSettings)

  const onlyUnique = useCallback(
    (value: MultiSelectOption, index: number, self: MultiSelectOption[]) => {
      return self.map((item) => item.id).indexOf(value.id) === index
    },
    []
  )

  const EEZ_OPTIONS: MultiSelectOption[] = useSelector(selectEEZs) ?? []
  const RFMOS_OPTIONS: MultiSelectOption[] = (useSelector(selectRFMOs) ?? []).filter(onlyUnique)
  const MPAS_OPTIONS: MultiSelectOption[] = useSelector(selectMPAs) ?? []

  const mergeSettings = (
    settingType: string,
    updatedSectionSettings: SettingsEvents | SettingsPortVisits
  ) => {
    const newSettings = {
      ...settings,
      [settingType]: updatedSectionSettings,
    }
    dispatch(updateSettings(newSettings))
  }

  const setSettingOptions = (section: string, field: string, values: MultiSelectOption[]) => {
    const key = section as keyof Settings
    const newSettings = {
      ...settings[key],
      [field]: values.map((v) => v.id),
    }
    mergeSettings(section, newSettings)
  }

  const setSetting = (section: string, field: string, value: number) => {
    const key = section as keyof Settings
    const newSettings = {
      ...settings[key],
      [field]: value,
    }
    mergeSettings(section, newSettings)
  }

  return {
    setSetting,
    setSettingOptions,
    EEZ_OPTIONS,
    RFMOS_OPTIONS,
    MPAS_OPTIONS,
  }
}
