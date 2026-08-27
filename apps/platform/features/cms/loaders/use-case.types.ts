import type { StrapiBaseAttributes, StrapiImage } from 'features/cms/strapi.types'

export const USE_CASE_ROLES_CONFIG = {
  government: 'Government',
  'monitoring-control-and-surveillance-mcs': 'Monitoring, Control & Surveillance (MCS)',
  'fisheries-management': 'Fisheries Management',
  'marine-protection-mpas': 'Marine Protection (MPAs)',
  'port-authorities': 'Port Authorities',
  researchers: 'Researchers',
  'non-profits': 'Non-profits',
  journalists: 'Journalists',
  'private-sector': 'Private Sector',
} as const

export type UseCaseSectionSlug = keyof typeof USE_CASE_ROLES_CONFIG

export type UseCaseRole = (typeof USE_CASE_ROLES_CONFIG)[UseCaseSectionSlug]

export type UseCaseContent = UseCaseSection[]

export type UseCaseSection = StrapiBaseAttributes & {
  role: UseCaseRole
  slug: UseCaseSectionSlug
  thumbnail?: StrapiImage
  body?: string
  subsections?: UseCaseSubSection[]
}

export type UseCaseSubSection = StrapiBaseAttributes & {
  title: string
  body: string
  slug: string
}
