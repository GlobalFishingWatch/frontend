import { render } from '@testing-library/react'

import AccessTokenCreate from './access-token-create'

describe('AccessTokenCreate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AccessTokenCreate />)
    expect(baseElement).toBeTruthy()
  })
})
