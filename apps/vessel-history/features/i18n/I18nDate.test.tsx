import { render } from '@testing-library/react'

import { I18nSpecialDate } from './i18nDate'

jest.mock('features/i18n/i18n')

describe('<I18nSpecialDate />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('formats TMT date only with year', () => {
    const component = render(<I18nSpecialDate date={19800000} />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('formats TMT date with month and year', () => {
    const component = render(<I18nSpecialDate date={19801100} />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('formats TMT date with day, month and year', () => {
    const component = render(<I18nSpecialDate date={19801121} />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('formats date from ISO format', () => {
    const component = render(<I18nSpecialDate date={'2021-01-01T03:59:51Z'} />)
    expect(component.asFragment()).toMatchSnapshot()
  })

  it('formats date from timestamp', () => {
    const component = render(<I18nSpecialDate date={1378094391000} />)
    expect(component.asFragment()).toMatchSnapshot()
  })
})
