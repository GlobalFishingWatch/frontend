import { render } from '@testing-library/react'

import RequireAdditionalInfo from './require-additional-info'

describe('RequireAdditionalInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RequireAdditionalInfo />)
    expect(baseElement).toBeTruthy()
  })
})
