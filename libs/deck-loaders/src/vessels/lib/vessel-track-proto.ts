import protobuf from 'protobufjs'
import { VesselTrackData } from './types'

export const proto = `
syntax = "proto3";
package vessels;

message DeckTrackAttribute {
  repeated float value = 1;
  uint32 size = 2;
}

message DeckTrackAttributeStruct {
  DeckTrackAttribute getPath = 1;
  DeckTrackAttribute getTimestamp = 2;
  DeckTrackAttribute getSpeed = 3;
  DeckTrackAttribute getElevation = 4;
  DeckTrackAttribute getCourse = 5;
}

message DeckTrack {
  uint32 length = 1;
  repeated uint32 startIndices = 2;
  DeckTrackAttributeStruct attributes = 3;
}
`

const root = protobuf.parse(proto).root
const DeckTrack = root.lookupType('DeckTrack')

function deckTrackDecoder(arrayBuffer: ArrayBuffer) {
  const track = DeckTrack.decode(new Uint8Array(arrayBuffer)) as any
  return {
    ...track,
    attributes: {
      getPath: {
        value: new Float32Array(track.attributes.getPath.value),
        size: track.attributes.getPath.size,
      },
      getTimestamp: {
        value: new Float32Array(track.attributes.getTimestamp.value),
        size: track.attributes.getTimestamp.size,
      },
    },
  } as VesselTrackData
}

export { deckTrackDecoder }

export { DeckTrack }
