import { render } from '@testing-library/react'
import RiskSection from './risk-section'

describe('RiskSection', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RiskSection />)
    expect(baseElement).toBeTruthy()
  })
})
