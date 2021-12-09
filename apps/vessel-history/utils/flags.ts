import flags from 'data/flags'
import i18n, { t } from 'features/i18n/i18n'

type Flag = { id: string; label: string }
export const getFlagById = (id: string): Flag | undefined => {
  const flag = flags.find((f) => f.id === id)
  if (!flag) return flag
  return {
    ...flag,
    label: flag.label,
  }
}

export const getFlags = (lng = i18n.language): Flag[] =>
  flags
    .map((flag) => {
      return {
        ...flag,
        label: t(`flags:${flag.id}`, { lng }) || flag.label,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))
