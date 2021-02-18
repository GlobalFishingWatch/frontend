// Wrapper function to mock uiseTranslation until we implement i18n
// so that i18n setup is easier
export function useTranslation() {
  return {
    t: (code: string, default_value: string) => default_value,
  }
}
