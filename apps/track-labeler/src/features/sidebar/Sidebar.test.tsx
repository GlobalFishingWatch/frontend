// import React, { CSSProperties } from 'react'
// import {
//   render,
//   cleanup,
//   fireEvent,
//   waitFor,
//   screen,
//   waitForElementToBeRemoved,
//   RenderResult,
// } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import { Settings } from 'luxon'
// import { Provider } from 'react-redux'
// import { mockOffsetSize } from 'setupTests'
// import store from 'store'
// import { UserHookType } from './features/user/user.hooks'
// import Sidebar from './Sidebar'
// import someVesselTrack from './__mocks__/235072411.track.json'

// jest.mock('./features/user/user.hooks', () => ({
//   useUser: () =>
//     ({
//       allowedAppAccess: true,
//       allowedProjectAccess: true,
//       logged: true,
//       projects: [{ id: '1', name: 'foo' }],
//       user: null,
//     } as UserHookType),
// }))

// afterEach(cleanup)

// // configure locales to use always these when running the tests
// Settings.defaultZoneName = 'America/New_York'
// Settings.defaultLocale = 'en-us'

// const _store = store
// describe('<Sidebar />', () => {
//   const renderComponent = (width = 100, height = 200) => {
//     const containerStyle: CSSProperties = {
//       width: width + 'px',
//       height: height + 'px',
//     }
//     return render(
//       <Provider store={_store}>
//         <div style={containerStyle}>
//           <Sidebar />
//         </div>
//       </Provider>
//     )
//   }

//   beforeEach(() => {
//     mockOffsetSize(100, 200)
//   })

//   xtest('render', () => {
//     const wrapper = renderComponent()
//     expect(wrapper.container).toMatchSnapshot()
//   })

//   /* @todo: Skipped until we can fix it */
//   xtest('render tracks', async () => {
//     const wrapper = renderComponent()
//     fireEvent.change(screen.getByLabelText(/import/i), {
//       target: {
//         files: [
//           new File([JSON.stringify(someVesselTrack)], 'my_track.json', {
//             type: 'application/json',
//           }),
//         ],
//       },
//     })

//     await waitFor(() => expect(wrapper.getByTestId('segments').children.length > 0).toBeTruthy())
//     expect(wrapper.container).toMatchSnapshot()
//   })

//   /* @todo: Skipped until we can fix it */
//   xtest('unlabel segment', async () => {
//     const wrapper = renderComponent()
//     expect(wrapper).not.toBeNull()

//     fireEvent.change(screen.getByLabelText(/import/i), {
//       target: {
//         files: [
//           new File([JSON.stringify(someVesselTrack)], 'my_track.json', {
//             type: 'application/json',
//           }),
//         ],
//       },
//     })

//     await waitFor(() => expect(wrapper.getByTestId('segments').children.length > 0).toBeTruthy())

//     const getSegmentAction = (element: RenderResult) => {
//       const segment = element.queryByTestId('segment-0')
//       const segmentActionID = segment?.querySelector('div:nth-child(2) label')?.getAttribute('for')
//       return element.getByTestId('segment-0').querySelector('#' + segmentActionID)
//     }
//     const segmentAction = getSegmentAction(wrapper)
//     !!segmentAction && fireEvent.click(segmentAction)

//     const currentAction = segmentAction?.textContent ?? ''
//     expect(currentAction).toEqual('Dredging')

//     const selectedAction = wrapper.getByRole('option', { name: currentAction })
//     !!selectedAction && fireEvent.click(selectedAction)

//     await waitForElementToBeRemoved(selectedAction).catch(jest.fn())
//     const newAction = getSegmentAction(wrapper)

//     expect(newAction?.textContent).toEqual('Select an option')
//     expect(wrapper.getByTestId('segment-0')).toMatchSnapshot()
//   })
// })
