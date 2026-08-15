import { render } from 'test/appTestUtils'
import {
  activeTocTitle,
  DATA_UPDATES_FIXTURE,
  highlightedTexts,
  imagesWithSrc,
  landingSection,
  MARKDOWN_IMAGE_URL,
  SEARCH_TERM,
  spinners,
  tocRowButtons,
  tocRowTitles,
  USE_CASES_FIXTURE,
  USER_GUIDE_FIXTURE,
} from 'test/utils/help-hub'
import { navigateToHelpHub } from 'test/utils/navigation/navigateToHelpHub'
import { navigateToHelpHubSection } from 'test/utils/navigation/navigateToHelpHubSection'
import { defaultState } from 'test/utils/store'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'

import { HELP_HUB, HELP_HUB_SECTION } from 'router/routes'
import { makeStore } from 'store'

// WHY: the Help Hub renders Strapi content through three RTK Query endpoints, each of which
// dynamically imports its CMS loader. Stubbing the loaders — rather than the query hooks — keeps the
// query lifecycle real, which is what the loading and error specs assert on. `vi.hoisted` gives a
// mutable holder the hoisted `vi.mock` factories can close over, so each spec can swap the response.
const cms = vi.hoisted(() => ({
  userGuide: (() => Promise.resolve({ data: [] })) as () => Promise<unknown>,
  useCases: (() => Promise.resolve({ data: [] })) as () => Promise<unknown>,
  dataUpdates: (() => Promise.resolve({ data: [] })) as () => Promise<unknown>,
}))

vi.mock('features/cms/loaders/user-guide', () => ({
  getUserGuideContent: () => cms.userGuide(),
}))
vi.mock('features/cms/loaders/use-case', () => ({
  getUseCaseContent: () => cms.useCases(),
}))
vi.mock('features/cms/loaders/data-update', () => ({
  getDataUpdateContent: () => cms.dataUpdates(),
}))

async function renderLandingPage() {
  const store = makeStore(defaultState)
  const rendered = await render({ store })
  await rendered.router.navigate(navigateToHelpHub())
  return rendered
}

async function renderSectionPage(params?: Parameters<typeof navigateToHelpHubSection>[0]) {
  const store = makeStore(defaultState)
  const rendered = await render({ store })
  await rendered.router.navigate(navigateToHelpHubSection(params))
  return rendered
}

/** Landing sections are only reachable by their heading, so wait for it before scoping to it. */
async function waitForLandingSection(title: string) {
  await expect.poll(() => landingSection(title)).toBeDefined()
  return page.elementLocator(landingSection(title)!)
}

describe('Help hub', async () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cms.userGuide = () => Promise.resolve({ data: USER_GUIDE_FIXTURE })
    cms.useCases = () => Promise.resolve({ data: USE_CASES_FIXTURE })
    cms.dataUpdates = () => Promise.resolve({ data: DATA_UPDATES_FIXTURE })
  })

  it('should click on see more and redirect', async () => {
    const store = makeStore(defaultState)
    const { router } = await render({ store })
    await router.navigate(navigateToHelpHub())

    const useCases = await waitForLandingSection('Use cases')
    await userEvent.click(useCases.getByRole('link', { name: 'See more' }))

    // WHY: assert route type + params rather than pathname — pathname carries PATH_BASENAME, params
    // are what the section page actually reads.
    await expect.poll(() => store.getState().location.type).toBe(HELP_HUB_SECTION)
    expect(store.getState().location.payload).toMatchObject({ sectionSlug: 'use-cases' })
    expect(store.getState().location.payload.topicSlug).toBeUndefined()
  })

  it('should redirect when clicking on thumbnail link', async () => {
    const { store } = await renderLandingPage()

    const toolsAndFeatures = await waitForLandingSection('Tools and features')
    // WHY: filter by text instead of an exact accessible name — the card link's name also picks up
    // the thumbnail alt text.
    await userEvent.click(toolsAndFeatures.getByRole('link').filter({ hasText: 'Vessels' }))

    await expect.poll(() => store.getState().location.type).toBe(HELP_HUB_SECTION)
    // A card links to its own topic, so the URL carries both the section and the topic.
    expect(store.getState().location.payload).toMatchObject({
      sectionSlug: 'tools-and-features',
      topicSlug: 'vessels',
    })
  })

  it('table of contents should redirect to section', async () => {
    const { store } = await renderSectionPage()

    // Only the table of contents renders topic titles as buttons; the article renders them as headings.
    await userEvent.click(page.getByRole('button', { name: 'Vessels' }))

    // WHY: the click only scrolls. The URL is rewritten by the IntersectionObserver in
    // useActiveTopicOnScroll once the topic reaches the top band of the scroll container.
    await expect
      .poll(() => store.getState().location.payload.topicSlug, { timeout: 5000 })
      .toBe('vessels')
    expect(store.getState().location.type).toBe(HELP_HUB_SECTION)
  })

  it('should have table of contents link selected according to current section', async () => {
    const { store } = await renderSectionPage({ topicSlug: 'vessels' })

    await expect.poll(() => activeTocTitle()).toBe('Vessels')
    expect(store.getState().location.payload.topicSlug).toBe('vessels')
  })

  it('should default the selected table of contents link to the first topic', async () => {
    // WHY: with no topicSlug the section page falls back to topicSlugs[0], and handleActiveChange
    // deliberately keeps that case out of the URL.
    await renderSectionPage()

    await expect.poll(() => activeTocTitle()).toBe('Introduction')
  })

  it('should only show expand button when has subsections', async () => {
    await renderSectionPage()

    // A row holds the topic button plus, only when the topic has subsections, the expand button.
    await expect.poll(() => tocRowButtons('Vessels').length).toBe(2)
    expect(tocRowButtons('Introduction')).toHaveLength(1)
    expect(tocRowButtons('Detections')).toHaveLength(1)
    expect(tocRowButtons('Disclaimer')).toHaveLength(1)
  })

  it('should show subsections when expand button is clicked', async () => {
    await renderSectionPage()

    await expect.poll(() => tocRowButtons('Vessels').length).toBe(2)
    // The subsection titles also render as headings inside the article, so scope to the button role.
    await expect.element(page.getByRole('button', { name: 'Vessel profile' })).not.toBeInTheDocument()

    await userEvent.click(page.elementLocator(tocRowButtons('Vessels')[1]))

    await expect.element(page.getByRole('button', { name: 'Vessel profile' })).toBeVisible()
    await expect.element(page.getByRole('button', { name: 'Vessel search' })).toBeVisible()
  })

  it('should show searched results highlighted', async () => {
    await renderSectionPage()

    await expect.poll(() => tocRowTitles()).toHaveLength(USER_GUIDE_FIXTURE.length)
    await userEvent.fill(page.getByRole('searchbox'), SEARCH_TERM)

    // The search filters on title + body; SEARCH_TERM only appears in the Detections body.
    await expect.poll(() => tocRowTitles()).toEqual(['Detections'])
    await expect.poll(() => highlightedTexts()).toEqual([SEARCH_TERM])
  })

  it('should expand images', async () => {
    await renderSectionPage()

    // WHY: MARKDOWN_IMAGE_URL is used by exactly one body image, so it never collides with the
    // topic thumbnails.
    await expect.poll(() => imagesWithSrc(MARKDOWN_IMAGE_URL).length).toBe(1)

    await userEvent.click(page.elementLocator(imagesWithSrc(MARKDOWN_IMAGE_URL)[0]))

    // Expanding renders a second copy of the image over a veil, carrying the `open` class.
    await expect.poll(() => imagesWithSrc(MARKDOWN_IMAGE_URL).length).toBe(2)
    expect(imagesWithSrc(MARKDOWN_IMAGE_URL).some((img) => /open/.test(img.className))).toBe(true)

    await userEvent.click(page.elementLocator(imagesWithSrc(MARKDOWN_IMAGE_URL)[1]))

    await expect.poll(() => imagesWithSrc(MARKDOWN_IMAGE_URL).length).toBe(1)
  })

  //will be superseeded by todo below
  it('should redirect to correct section when clicking on searched table of contents', async () => {
    const { store } = await renderSectionPage()

    await userEvent.fill(page.getByRole('searchbox'), SEARCH_TERM)
    await expect.poll(() => tocRowTitles()).toEqual(['Detections'])

    await userEvent.click(page.getByRole('button', { name: 'Detections' }))

    await expect
      .poll(() => store.getState().location.payload.topicSlug, { timeout: 5000 })
      .toBe('detections')
  })

  it.todo('should open searched content on searched text click')

  it('breadcrumb should redirect to correct page', async () => {
    const { store } = await renderSectionPage({ sectionSlug: 'use-cases' })

    await userEvent.click(page.getByRole('link', { name: 'Help & Resources' }))

    await expect.poll(() => store.getState().location.type).toBe(HELP_HUB)
    expect(store.getState().location.payload.sectionSlug).toBeUndefined()
  })

  it.todo('should show see more only if has more than 4 entries')

  it('should show loading state if API response is pending/idle', async () => {
    // A promise that never settles holds every query in its pending state.
    const pending = () => new Promise<never>(() => {})
    cms.userGuide = pending
    cms.useCases = pending
    cms.dataUpdates = pending

    const { router } = await renderLandingPage()

    // One spinner per landing section, in place of the card grid.
    await expect.poll(() => spinners().length).toBeGreaterThanOrEqual(3)

    await router.navigate(navigateToHelpHubSection())

    // The section page replaces its whole body with a single spinner while loading.
    await expect.poll(() => spinners()).toHaveLength(1)
    await expect.element(page.getByRole('searchbox')).not.toBeInTheDocument()
  })

  it('should show error state if strapi returns an error', async () => {
    cms.userGuide = () => Promise.reject(new Error('Strapi unavailable'))

    await renderSectionPage()

    // NOTE: the error and empty states share the same copy today, so this asserts the placeholder
    // rather than an error-specific message.
    await expect.element(page.getByText('No data')).toBeVisible()
    await expect.element(page.getByRole('searchbox')).not.toBeInTheDocument()
    await expect.poll(() => spinners()).toHaveLength(0)
  })
})
