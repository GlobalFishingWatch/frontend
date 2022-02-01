/**
 *
 * @export
 * @interface APIDataset
 */
export interface APIDataset {
  id: string
  pipeline: string
  eventsTable: string
  tracksTable: string
  startDate: string
  endDate: string
  vesselsTable: string
  vesselIndex: string
  supportedEventTypes: string[]
}
