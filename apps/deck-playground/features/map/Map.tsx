import { useState, useMemo, Fragment } from 'react'
import { DeckGL } from '@deck.gl/react'
import { BitmapLayer } from '@deck.gl/layers'
import { TileLayer } from '@deck.gl/geo-layers'
import VesselLayer from '../../layers/vessel/VesselTrack'
import { trackLoader } from '../../loaders/trackLoader'

const INITIAL_VIEW_STATE = {
  longitude: -71,
  latitude: 40,
  zoom: 6,
}

const basemap = new TileLayer({
  id: 'basemap',
  data: 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  minZoom: 0,
  maxZoom: 12,
  tileSize: 256,
  renderSubLayers: (props) => {
    const {
      bbox: { west, south, east, north },
    } = props.tile
    return new BitmapLayer(props, {
      data: null,
      image: props.data,
      bounds: [west, south, east, north],
    })
  },
})

const STEP = 10000000000

const IDS = [
  'fc3854132-25d3-7d65-e371-b8cec35efa0d',
  'f7cb85b36-6f36-2347-7da4-b4b5f6e55b8a',
  'f74328981-1a96-ec8f-e3bb-a8c6e231c399',
  'f47687c40-09a8-395f-4416-249d643a2715',
  'f475b284d-dc3f-82c4-9e6f-1565d731af21',
  'f1a81b01f-f4f3-9448-2f7a-48c7f4f3f1d5',
  'ef76fe319-9521-8980-e3bc-c650fb354a04',
  'ee161d4a4-4636-97a9-c1cf-f439c2ec1c43',
  'ebfbe044c-cc43-3dc8-ace5-88a208439fcf',
  'ea38dc6c1-1882-b347-0bdf-2b2b6ab88fca',
  'e69d3d981-1e04-ae9e-b814-8dba4c7cb6ba',
  'e66987d14-4909-c4c1-bccd-6da43405ccb8',
  'e079af647-7c61-7594-0c1e-8e1cbf5f343d',
  'e0613c0eb-bfef-c59f-4fbe-3dff4b8f34b8',
  'e04a0cc39-95c2-8ba5-7c3f-e6bf329c4ae5',
  'dd7b624e0-0a00-240d-4539-ac3db1f7cae0',
  'dd228ee94-4380-1b54-00a7-d6f1fbc7e241',
  'd80a44c0f-f938-c5c8-095e-1ac3064bf2fb',
  // "d3f8ce311-1a18-689e-3fa2-bc7ec605d7dd",
  // "cf243e900-004c-f2b5-bf35-7ce41acc7a04",
  // "ce804bd67-7dc9-f270-1e66-3826efed1f84",
  // "c5fc5dbd0-0185-d2d6-e599-2107d8bc5731",
  // "c482db75f-fd9f-5db3-7a0f-c6ebb094c6ef",
  // "c2b23a0a9-987e-2af6-abb9-5354e86e6403",
  // "c2378906e-e0ae-d7ff-b979-0e7f639f7c45",
  // "c1f4e9b10-078b-0a9f-6b1e-5898182b15b9",
  // "c1009ddb6-6712-eb7d-c9b6-ddebab8314dc",
  // "bf1b9272e-e3ae-6523-ea60-d3a49e0c01b2",
  // "bedfd97d1-1332-60b7-74f1-0eebf38d1c76",
  // "bdd9b64fe-e3e7-596f-53db-29909c9cd026",
  // "bd0b882f9-9de5-ab38-5f76-90e38e2bc888",
  // "b7bc134b9-9a63-5e4d-6e37-c982edeaed55",
  // "b3cd4bed0-06d7-b06c-fa2b-cb5002574850",
  // "b113c1854-449f-dfeb-06d1-68bd754f1644",
  // "af8b444d4-47ef-749a-d55b-e754d3354b2f",
  // "adc4015e8-8d6f-bf19-e0d1-c662f5b616e7",
  // "abb052596-6076-4d5b-c936-1f09e0c99c45",
  // "ab3b3f373-3093-9e7a-a883-0207ba1ed021",
  // "aab3fbd04-4325-5e57-c7e2-b690d2d49808",
  // "a32287431-10d7-e976-c257-3d0718c3b990",
  // "a23612f23-3c2f-420e-67b9-90e47c6487af",
  // "a1d57da82-2ea2-387d-a71b-cd3c7b87664d",
  // "9d1f043be-eec1-548f-4b75-75bc4cdd836c",
  // "9c972a1c1-1988-e365-e999-4ec106f7b3f9",
  // "9b85af654-4ce3-182c-8a7b-09954a925888",
  // "97a104f5a-a63a-d5a0-5872-e2c581a86dfe",
  // "94a9943b8-8f5c-d1d9-ff09-f734e54acb43",
  // "940a0b8be-e4cd-2262-669e-f10546dc4916",
  // "8fb027944-49ba-e289-7a34-2af66edaa87a",
  // "8e949c6e9-9c1f-720c-bde4-2c9d00928500",
  // "8e62b5df3-3f50-3c87-1e8c-dec5b771b6a2",
  // "8c78d9147-709c-1fbc-cc08-ebddc41f00c1",
  // "8a9988d11-100f-7d21-6a1b-3957bf51eeb6",
  // "8933d7164-4cd5-773b-b25f-811ebc5f797b",
  // "88b935166-649a-02f9-10cd-da61fbf77cb6",
  // "886aeb4bd-dd92-b414-8918-0c2cd74e6662",
  // "840d81654-4e80-9368-9ce5-6ba24cd579c9",
  // "7be6aa6ea-a08e-39db-7787-c693615863cf",
  // "7ab398cb6-668e-643e-e70b-db7898dce7d5",
  // "7a8cd41cf-f8a6-caa4-22a0-8368fe2b7a74",
  // "7917e94e3-3ac8-e72a-1a53-883190a143a9",
  // "7703fe352-2006-3272-91c4-ed55cf08a2bf",
  // "7531696dd-d1fe-9efc-a4d3-8b9d9528c3a6",
  // "7380f0ab3-32c7-d8a7-6e0f-c0283d022f87",
  // "7280cd900-09db-5fe2-6cf4-d0b59b272f78",
  // "6fe199af2-2efd-daf9-70b8-1f284cf8d67a",
  // "6bb565027-7ebf-1135-78ba-b18a1f02dd7c",
  // "6b96c9b8e-e06c-1716-2de8-ec4a7c1f65fc",
  // "6b5c226d2-2ea9-c1af-75e2-e2c28c653dd2",
  // "65a79a1d7-7638-3aed-ada0-3fdb9cec8517",
  // "6593dee82-21fb-5512-c3db-603484e9e442",
  // "64670e1fe-e4ba-d758-5c99-56bd9efcb386",
  // "5f49e4fd5-5c39-19da-bd90-e277cdd83ab2",
  // "5b5187e80-0062-b375-b4a8-b79547aca41e",
  // "562b4587c-cb5b-72fe-0492-6efc9ca22dad",
  // "559f52593-3c3d-b5fa-42c8-c74643a3bade",
  // "47dc136ba-a7a0-9a87-3a8b-a86ef688c162",
  // "46be96ce4-4e08-a7cf-9453-fcc83c33ca8d",
  // "4595a3d16-6a23-846a-d4a0-b414b31da435",
  // "43d4d6d98-8dff-d77f-6a07-b6bb462a6829",
  // "42fcd334a-ae7a-5c09-34f9-1c52947d385c",
  // "42bcec051-1110-5491-4006-9f0e1391f76b",
  // "3ee686119-989b-41e9-c891-dcd894e8c6f1",
  // "3c6e38bd7-7121-b9c8-2a9b-09a93947e289",
  // "3ac6a42f5-540b-011c-b90e-c522df48220e",
  // "397f6580e-e55d-a7af-6fbd-b117c903131e",
  // "376eb361b-b23f-9a83-65e6-d513b5f9d03f",
  // "3682cb23a-a5b4-316d-0a73-2c88711b0477",
  // "2ee7eb6a7-7c3f-70b0-ad0b-9b57d52c9b35",
  // "2b76d4b10-04e2-39bb-e3aa-dc7a7f45a05f",
  // "2b299a095-53b9-f871-a179-45d7fddd2714",
  // "291cbf41f-fa8e-6448-b93f-0800e9386ac2",
  // "24edf9375-5f78-078b-99d4-398fb17329a6",
  // "243d8e5fb-b5c7-f357-ab70-07ba536826fc",
  // "21cc93630-0610-e309-59fa-e2b26301e278",
  // "1c5b5829d-dd10-7d5e-b4ee-3804f9d8f53a",
  // "1b7826208-8753-c046-e747-3aa626854656",
  // "1b44727c2-23c0-fd97-abdd-85bc11848656",
  // "19fd51370-0d8b-90d7-574f-518a7d14808d",
  // "194ae62f7-750b-d96a-13b1-795528f48b8e",
  // "186d770ff-fd17-cc31-8743-4146d64363e2",
  // "1309958ce-ef17-e227-dc44-7a20d0411f94",
  // "0e7059d05-56e2-9c72-a3cd-6ad4011a99e9",
  // "0d3029ec3-3b5b-4ecf-5735-ca66843500e3",
  // "0cc688a55-5cae-cda7-3f61-6826b711b14a",
  // "0cbc3fc3e-eeb2-7423-0a0d-79218eed813b",
  // "0a9ca9e79-95c1-827d-6c1c-51b812b6d256",
  // "08cc89805-59f0-e379-4d04-a27e04d05db1",
  // "0561b0a47-7a04-db66-19db-6fd94e14316b",
  // "04dec18cd-d1a1-a22e-75e7-d090592cc943",
  // "029bbab3f-fbb5-8bb7-8117-30e7008526bb"
]

const MapWrapper = (): React.ReactElement => {
  const [minFrame, setMinFrame] = useState(1405991600000)
  const [maxFrame, setMaxFrame] = useState(1659384595000)
  const [minHighlightedFrame, setMinHighlightedFrame] = useState(1640991600000)
  const [maxHighlightedFrame, setMaxHighlightedFrame] = useState(1645991600000)
  const [vesselLayers, setVesselLayers] = useState([basemap])
  // debugger
  useMemo(() => {
    setVesselLayers([
      ...IDS.map(
        (id) =>
          new VesselLayer({
            id: `vessel-layer-${id}`,
            vesselId: id,
            data: `https://gateway.api.dev.globalfishingwatch.org/v2/vessels/${id}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&distance-fishing=50&bearing-val-fishing=1&change-speed-fishing=10&min-accuracy-fishing=2&distance-transit=100&bearing-val-transit=1&change-speed-transit=10&min-accuracy-transit=10&datasets=public-global-fishing-tracks%3Av20201001`,
            loaders: [trackLoader() as any],
            getPath: (d) => {
              // console.log('coordinates', d.waypoints.map(p => p.coordinates));
              return d.waypoints.map((p) => p.coordinates)
            },
            getTimestamps: (d) => {
              // console.log('timestamps', d.waypoints.map(p => p.timestamp - 1465864039000));
              // deduct start timestamp from each data point to avoid overflow
              return d.waypoints.map((p) => p.timestamp)
            },
            widthUnits: 'pixels',
            widthScale: 1,
            wrapLongitude: true,
            jointRounded: true,
            capRounded: true,
            // pickable: true,
            getColor: (d) => {
              return d.waypoints.map((p) => {
                if (p.timestamp >= minHighlightedFrame && p.timestamp <= maxHighlightedFrame) {
                  return [255, 0, 0, 100]
                }
                return [0, 0, 0, 30]
              })
            },
            // getWidth: (d) => {
            //   return d.waypoints.map((p) =>
            //     p.timestamp >= minHighlightedFrame &&
            //     p.timestamp <= maxHighlightedFrame
            //       ? 2
            //       : 1
            //   );
            // },
            width: 1,
            updateTriggers: {
              getColor: [minHighlightedFrame, maxHighlightedFrame],
              // getWidth: [minHighlightedFrame, maxHighlightedFrame],
            },
            startTime: minFrame,
            endTime: maxFrame,
          })
      ),
    ])
  }, [maxFrame, minFrame, maxHighlightedFrame, minHighlightedFrame])

  const getFirstVesselData = () => {
    const vessel = vesselLayers.find((layer) => layer.id === `vessel-layer-${IDS[0]}`)
    console.log('getFirstVesselData', vessel.getSegments())
  }

  return (
    <Fragment>
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        layers={[basemap, ...vesselLayers]}
        getTooltip={({ object }) => object && `value: ${object.colorValue}`}
      />
      <div style={{ position: 'fixed', left: 0, top: '4rem', right: 0, backgroundColor: 'white' }}>
        <div>Number of tracks: {IDS.length}</div>
        <div>
          TRACK start
          <input
            type="number"
            value={minFrame}
            step={STEP}
            onChange={(e) => setMinFrame(parseInt(e.target.value))}
          />
          {new Date(minFrame).toISOString().split('T')[0]} end
          <input
            type="number"
            value={maxFrame}
            step={STEP}
            onChange={(e) => setMaxFrame(parseInt(e.target.value))}
          />
          {new Date(maxFrame).toISOString().split('T')[0]}
        </div>
        <div>
          HIGHLIGHT start
          <input
            type="number"
            value={minHighlightedFrame}
            step={STEP}
            onChange={(e) => setMinHighlightedFrame(parseInt(e.target.value))}
          />
          {new Date(minHighlightedFrame).toISOString().split('T')[0]} end
          <input
            type="number"
            value={maxHighlightedFrame}
            step={STEP}
            onChange={(e) => setMaxHighlightedFrame(parseInt(e.target.value))}
          />
          {new Date(maxHighlightedFrame).toISOString().split('T')[0]}
        </div>
        <div>
          <button onClick={getFirstVesselData}>GET FIRST VESSEL DATA</button>
        </div>
      </div>
    </Fragment>
  )
}

export default MapWrapper
