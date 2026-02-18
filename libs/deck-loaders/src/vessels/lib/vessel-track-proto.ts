import protobuf from 'protobufjs'

const { parse } = protobuf

// TODO: catchup with backed to update to edition 2024
// as protobufjs 8.0.0 now supports it
const proto = `
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

export const DeckTrack = parse(proto).root.lookupType('DeckTrack')
