import { Fragment } from 'react'
import { I18nextProvider } from 'react-i18next'
import { render } from '@testing-library/react'

import i18n from 'features/i18n/i18n'

import { SearchEmptyState, SearchNoResultsState, SearchNotAllowed } from './SearchPlaceholders'

jest.mock('features/i18n/i18n')
// This is to setup i18n provider for the test
render(
  <I18nextProvider i18n={i18n}>
    <Fragment />
  </I18nextProvider>
)

describe('<SearchNoResultsState />', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows SearchNoResultsState', () => {
    const component = render(<SearchNoResultsState className="foobar" />)
    expect(component.asFragment()).toMatchSnapshot()
  })
})

describe('<SearchEmptyState />', () => {
  it('shows SearchEmptyState', () => {
    const component = render(<SearchEmptyState className="foobar" />)
    expect(component.asFragment()).toMatchSnapshot()
  })
})

describe('<SearchNotAllowed />', () => {
  it('shows SearchNotAllowed', () => {
    const component = render(<SearchNotAllowed className="foobar" />)
    expect(component.asFragment()).toMatchSnapshot()
  })
})
