import type { ErrorComponentProps } from '@tanstack/react-router'
import { createFileRoute, ErrorComponent, Link } from '@tanstack/react-router'

import { fetchPost } from '../utils/posts'

import { NotFound } from '~/components/NotFound'
import { getStrapiMedia } from '~/utils/strapi'

export const Route = createFileRoute('/posts/$postId')({
  loader: ({ params: { postId } }) => fetchPost({ data: postId }),
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>
  },
})

export function PostErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}

function PostComponent() {
  const post = Route.useLoaderData()
  console.log('🚀 ~ PostComponent ~ post:', post)
  const coverUrl = getStrapiMedia(post.cover?.url)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Hero Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
        <img
          src={coverUrl ?? undefined}
          alt={post.cover?.alternativeText}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>

        <div className="flex items-center text-sm text-gray-500">
          <time dateTime={post.publishedAt}>{formattedDate}</time>
        </div>

        <p className="text-lg text-gray-700">{post.description}</p>

        <Link
          to="/posts/$postId/deep"
          params={{
            postId: post.documentId,
          }}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Read Full Article
        </Link>
      </div>
    </article>
  )
}
