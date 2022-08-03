import { render } from '@testing-library/react'
import ActivityByType from './activity-by-type'

describe('ActivityByType', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ActivityByType />)
    expect(baseElement).toBeTruthy()
  })
})
