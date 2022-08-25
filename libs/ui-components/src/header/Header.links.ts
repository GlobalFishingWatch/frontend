import React from 'react'

export type MenuItem = {
  className?: string
  link?: string
  label: string | React.ReactNode
  mini?: boolean
  childs?: MenuItem[]
  onClick?: React.MouseEventHandler
}

const navigation: MenuItem[] = [
  {
    link: 'https://globalfishingwatch.org/topics/',
    label: 'Topics',
    childs: [
      {
        link: 'https://globalfishingwatch.org/commercial-fishing/',
        label: 'Commercial Fishing',
        childs: [],
      },
      {
        link: 'https://globalfishingwatch.org/marine-protected-areas/',
        label: 'Marine Protected Areas',
        childs: [],
      },
      { link: 'https://globalfishingwatch.org/transshipment/', label: 'Transshipment', childs: [] },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/map-and-data/',
    label: 'Map & data',
    childs: [
      { link: 'https://globalfishingwatch.org/our-technology/', label: 'Our Technology' },
      { link: 'https://globalfishingwatch.org/our-map/', label: 'Our Map' },
      { link: 'https://globalfishingwatch.org/our-apis/', label: 'Our Apis' },
      {
        link: 'https://globalfishingwatch.org/carrier-vessel-portal/',
        label: 'Carrier Vessel Portal',
      },
      {
        link: 'https://globalfishingwatch.org/marine-manager-portal/',
        label: 'Marine Manager Portal',
      },
      { link: 'https://globalfishingwatch.org/datasets-and-code/', label: 'Datasets and Code' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/programs/',
    label: 'Programs',
    childs: [
      {
        link: 'https://globalfishingwatch.org/research/',
        label: 'Research',
        childs: [
          { link: 'https://globalfishingwatch.org/our-analysis/', label: 'Analysis' },
          { link: 'https://globalfishingwatch.org/publications/', label: 'Publications' },
        ],
      },
      {
        link: 'https://globalfishingwatch.org/transparency/',
        label: 'Transparency',
        childs: [
          {
            link: 'https://globalfishingwatch.org/transparency-program-africa/',
            label: 'Africa',
          },
          { link: 'https://globalfishingwatch.org/transparency-program-asia/', label: 'Asia' },
          {
            link: 'https://globalfishingwatch.org/transparency-program-latin-america/',
            label: 'Latin America',
          },
          {
            link: 'https://globalfishingwatch.org/transparency-program-mediterranean/',
            label: 'Mediterranean',
          },
          {
            link: 'https://globalfishingwatch.org/transparency-program-pacific/',
            label: 'Pacific',
          },
        ],
      },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/newsroom/',
    label: 'Newsroom',
    childs: [
      { link: 'https://globalfishingwatch.org/blog/', label: 'Blog' },
      { link: 'https://globalfishingwatch.org/multimedia/', label: 'Multimedia' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/about-us/',
    label: 'About Us',
    mini: true,
    childs: [
      { link: 'https://globalfishingwatch.org/leadership/', label: 'Board of Directors' },
      { link: 'https://globalfishingwatch.org/meet-the-team/', label: 'Team' },
      { link: 'https://globalfishingwatch.org/careers/', label: 'Careers' },
      { link: 'https://globalfishingwatch.org/financials/', label: 'Financials' },
    ],
  },
  {
    link: 'https://globalfishingwatch.org/help-faqs/"',
    label: 'Help',
    childs: [
      { link: 'https://globalfishingwatch.org/help-faqs/', label: 'FAQ' },
      { link: 'https://globalfishingwatch.org/tutorials/', label: 'Tutorials' },
      { link: 'https://globalfishingwatch.org/contact-us/', label: 'Contact Us' },
    ],
  },
]

export default navigation
