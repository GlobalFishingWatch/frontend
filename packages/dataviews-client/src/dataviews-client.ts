import { Dataview, WorkspaceDataview } from './types'

export default class DataviewsClient {
  _fetch: (url: string) => Promise<Response>

  constructor(_fetch: (url: string) => Promise<Response>) {
    this._fetch = _fetch
  }

  getDataviews(
    ids: string[] = [],
    workspaceDataviews: WorkspaceDataview[] = []
  ): Promise<Dataview[]> {
    const dataviewsUrl = ids.length ? `/dataviews/${ids.join(',')}` : '/dataviews/'
    console.log(dataviewsUrl)
    const fetchDataviews = this._fetch(dataviewsUrl)
      .then((response: Response) => response.json())
      .then((data: unknown) => {
        return data as Dataview[]
      })

    return fetchDataviews
  }

  // addDataview(dataview: Dataview): Promise<Dataview> {}

  // updateDataview(dataview: Dataview): Promise<Dataview> {}

  // getData(dataviews: Dataview[]): Promise<Dataview>[] {

  // }
}
