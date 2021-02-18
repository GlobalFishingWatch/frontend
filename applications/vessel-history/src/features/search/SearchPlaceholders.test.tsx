import { render } from '@testing-library/react'
import { SearchEmptyState, SearchNoResultsState, SearchNotAllowed } from './SearchPlaceholders'

describe('<SearchNoResultsState />', () => {
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
