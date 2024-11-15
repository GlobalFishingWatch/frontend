// import createTree from 'functional-red-black-tree'
// import { Segment } from '@globalfishingwatch/data-transforms'
// import { SelectedTrackType } from './features/vessels/selectedTracks.slice'
// import someVesselTrack from './features/tracks/__mocks__/vesselTrack.mock'
// import someSelectedTracks from './features/vessels/__mocks__/selectedtracks.mock'
// import {
//   getSelectedTracksTree,
//   getVesselParsedFilteredTrack,
//   getVesselParsedTrack,
// } from './tracks.selectors'

// jest.mock('./features/vessels/vessels.slice')
// jest.mock('./features/vessels/selectedTracks.slice')
// jest.mock('routes/routes.selectors')

// const someSelectedTracksTree: createTree.Tree<number, SelectedTrackType> =
//   getSelectedTracksTree.resultFunc(someSelectedTracks)
// describe('getVesselParsedTrack', () => {
//   const cases: [string, string, Segment[], createTree.Tree<number, SelectedTrackType>][] = [
//     ['empty', 'empty', [], createTree()],
//     ['some', 'empty', someVesselTrack, createTree()],
//     ['empty', 'some', [], someSelectedTracksTree],
//     ['some', 'some', someVesselTrack, someSelectedTracksTree],
//   ]

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   test.each(cases)(
//     ' called with %p tracks and %p selected tracks',
//     (trackLabel, selectedLabel, vesselTrack, selectedTracks) => {
//       const result = getVesselParsedTrack.resultFunc(vesselTrack, selectedTracks)
//       expect(result).toMatchSnapshot()
//     }
//   )
// })

// describe('getVesselParsedFilteredTrack', () => {
//   const cases: [string, string, Segment[], createTree.Tree<number, SelectedTrackType>][] = [
//     ['empty', 'empty', [], createTree()],
//     ['some', 'empty', someVesselTrack, createTree()],
//     ['empty', 'some', [], someSelectedTracksTree],
//     ['some', 'some', someVesselTrack, someSelectedTracksTree],
//   ]

//   afterEach(() => {
//     jest.clearAllMocks()
//   })

//   test.each(cases)(
//     ' called with %p tracks and %p selected tracks',
//     (trackLabel, selectedLabel, vesselTrack, selectedTracks) => {
//       const result = getVesselParsedFilteredTrack.resultFunc(vesselTrack, selectedTracks)
//       expect(result).toMatchSnapshot()
//     }
//   )
// })
