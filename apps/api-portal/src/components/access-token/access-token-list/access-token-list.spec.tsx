import { render } from '@testing-library/react'

import AccessTokenList from './access-token-list'

describe('AccessTokenList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AccessTokenList />)
    expect(baseElement).toBeTruthy()
  })
})
