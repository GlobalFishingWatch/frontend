import { z } from 'zod'

const vesselInput = z
  .object({
    name: z.string().describe('Name').nullable().optional(),
    imo: z.string().describe('IMO').nullable().optional(),
    mmsi: z.string().describe('MMSI').nullable().optional(),
  })
  .nullable()
  .optional()

const portInput = z
  .object({
    name: z.string().describe('Port name').nullable().optional(),
    country: z.string().describe('Country').nullable().optional(),
  })
  .nullable()
  .optional()

export const configurationSchema = z.object({
  start_date: z.string().describe('Start date').nullable().optional(),
  end_date: z.string().describe('End date').nullable().optional(),
  area: z.string().describe('Area').nullable().optional(),
  area_type: z.string().describe('Area type').nullable().optional(),
  buffer: z.boolean().describe('Buffer').nullable().optional(),
  dataset: z.string().describe('Dataset').nullable().optional(),
  filters: z
    .object({
      flags: z.array(z.string()).describe('Flags').nullable().optional(),
      vessel_types: z.array(z.string()).describe('Vessel types').nullable().optional(),
      gear_types: z.array(z.string()).describe('Geartypes').nullable().optional(),
    })
    .nullable()
    .optional(),
  vessel: vesselInput,
  port: portInput,
})

export type ConfigurationParams = z.infer<typeof configurationSchema>
export type VesselParams = z.infer<typeof vesselInput>
export type PortParams = z.infer<typeof portInput>
