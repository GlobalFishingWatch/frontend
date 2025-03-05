import { Trans, useTranslation } from 'react-i18next'
import { render } from '@testing-library/react'

import TerminologyFishingEvents from './terminology-fishing-events'

jest.mock('react-i18next')

describe('TerminologyFishingEvents', () => {
  const mockUseTranslation: jest.Mock = useTranslation as jest.Mock
  const mockTrans: jest.Mock = Trans as jest.Mock
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (_ns: any, fallback: any) => fallback,
    })
    mockTrans.mockImplementation(({ i18nKey, children }) => children)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should render successfully', () => {
    const { baseElement } = render(<TerminologyFishingEvents />)
    expect(baseElement).toMatchSnapshot()
  })
})
