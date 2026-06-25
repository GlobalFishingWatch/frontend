import { render } from '@testing-library/react'

import UserAdditionalFields from './user-additional-fields'

describe('UserAdditionalFields', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserAdditionalFields />)
    expect(baseElement).toBeTruthy()
  })
})
