export const getGreeting = () => cy.get('h1')

export const getVmsActivityLayerPanel = () =>
  cy.getBySelLike('activity-layer-panel-vms-', { timeout: 20000 })

export const switchLanguage = (language: string) => {
  const currentLanguage = localStorage.getItem('i18nextLng')
  if (currentLanguage !== language) {
    localStorage.setItem('i18nextLng', language)
    cy.reload()
  }
}
