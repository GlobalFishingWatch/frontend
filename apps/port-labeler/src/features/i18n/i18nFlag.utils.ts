import { useTranslation } from 'react-i18next'

export const useI18nFlag = (iso: string) => {
  const { t } = useTranslation('flags')
  return t(iso as any)
}
