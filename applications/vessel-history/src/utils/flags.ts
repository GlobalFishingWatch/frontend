import flags from 'data/flags'

type Flag = { id: string; label: string }
export const getFlagById = (id: string): Flag | undefined => {
  const flag = flags.find((f) => f.id === id)
  if (!flag) return flag
  return {
    ...flag,
    label: flag.label,
  }
}
