import { Trans, useTranslation } from 'react-i18next'
import { render } from '@testing-library/react'

import TerminologyIuu from './terminology-iuu'

jest.mock('react-i18next')

describe('TerminologyIuu', () => {
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
    const { baseElement } = render(<TerminologyIuu />)
    expect(baseElement).toMatchSnapshot()
  })
})
