import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import qs from 'qs'
import axios from 'redaxios'

import { getStrapiURL } from '~/utils/strapi'

const BASE_API_URL = getStrapiURL()

interface StrapiArrayResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface StrapiResponse<T> {
  data: T
}

interface CoverImage {
  url: string
  alternativeText: string
}

export type PostType = {
  id: number
  documentId: string
  title: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  cover: CoverImage
  blocks: any[]
}

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((d: string) => d)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`)

    const path = '/api/topics/' + data
    const url = new URL(path, BASE_API_URL)

    url.search = qs.stringify({
      populate: '*',
      // cover: {
      //   fields: ['url', 'alternativeText'],
      // },
      // tools: {
      //   populate: '*',
      // },
    })

    const post = await axios
      .get<StrapiResponse<PostType>>(url.href)
      .then((r) => {
        // console.dir(r.data, { depth: null });
        return r.data.data
      })
      .catch((err) => {
        console.error(err)
        if (err.status === 404) {
          throw notFound()
        }
        throw err
      })

    return post
  })

export const fetchPosts = createServerFn({ method: 'GET' }).handler(async ({ locale = 'en' }) => {
  console.info('Fetching posts...')

  const path = '/api/topics'
  const url = new URL(path, BASE_API_URL)

  url.search = qs.stringify({
    locale: 'en',
    populate: '*',
  })

  return axios.get<StrapiArrayResponse<PostType>>(url.href).then((r) => {
    console.dir(r.data, { depth: null })
    return r.data.data // Extract the data array from the Strapi response
  })
})
