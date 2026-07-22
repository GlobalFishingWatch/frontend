export type MenuLink = {
  id: string
  label: string
  href: string
}

export const defaultLinks: MenuLink[] = [
  { id: 'topics', label: 'Topics', href: 'https://globalfishingwatch.org/topics/' },
  { id: 'map-data', label: 'Map & data', href: 'https://globalfishingwatch.org/map-and-data/' },
  { id: 'programs', label: 'Programs', href: 'https://globalfishingwatch.org/programs/' },
  { id: 'newsroom', label: 'Newsroom', href: 'https://globalfishingwatch.org/newsroom/' },
  { id: 'about-us', label: 'About Us', href: 'https://globalfishingwatch.org/about-us/' },
  {
    id: 'help',
    label: 'Help',
    href: 'https://globalfishingwatch.org/help-faqs/',
  },
  {
    id: 'terms-of-use',
    label: 'Terms of use',
    href: 'https://globalfishingwatch.org/terms-of-use/',
  },
  {
    id: 'privacy-policy',
    label: 'Privacy policy',
    href: 'https://globalfishingwatch.org/privacy-policy/',
  },
]
