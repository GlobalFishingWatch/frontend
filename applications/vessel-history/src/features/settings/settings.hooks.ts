import { useDispatch, useSelector } from 'react-redux'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
import {
  selectSettings,
  Settings,
  SettingsEvents,
  SettingsPortVisits,
  updateSettings,
} from './settings.slice'

export const useApplySettingsConnect = () => {
  const dispatch = useDispatch()
  const settings = useSelector(selectSettings)

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
  }
}
