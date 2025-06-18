import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { fetchPosts } from '../utils/posts'

export const Route = createFileRoute('/posts')({
  loader: async () =>
    fetchPosts({
      locale: 'es',
    }),
  component: PostsComponent,
})

function PostsComponent() {
  const posts = Route.useLoaderData()
  console.log('🚀 ~ PostsComponent ~ posts:', posts)

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-8">
      <div className="w-1/3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Posts</h2>
        <ul className="space-y-2">
          {posts.map((post) => {
            return (
              <li key={post.documentId}>
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.documentId,
                  }}
                  className="block px-4 py-2 rounded-md transition-colors hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                  activeProps={{
                    className: 'bg-blue-100 text-blue-900 font-medium',
                  }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="w-2/3">
        <Outlet />
      </div>
    </div>
  )
}
