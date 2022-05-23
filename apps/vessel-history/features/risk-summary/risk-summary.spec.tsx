import { render } from '@testing-library/react'
import RiskSummary from './risk-summary'

describe('RiskSummary', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RiskSummary />)
    expect(baseElement).toBeTruthy()
  })
})
