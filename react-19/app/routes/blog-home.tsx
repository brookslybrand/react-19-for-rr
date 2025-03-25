import { Link } from "react-router";
import { getFeaturedPosts } from "~/posts.server";
import type { Route } from "./+types/blog-home";

export async function loader({ context }: Route.LoaderArgs) {
  const posts = await getFeaturedPosts();
  return { posts };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <title>Blog | Remix Store</title>
      <meta
        name="description"
        content="Articles about React Router, web development, and modern web architecture"
      />
      <div>
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
          A collection of articles about React Router, web development, and
          modern web architecture.
        </p>

        <div className="space-y-8">
          {loaderData.posts.map((post) => (
            <article
              key={post.slug}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <Link to={post.slug} className="block p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.frontmatter.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-3">
                      {post.frontmatter.description}
                    </p>
                    <time className="text-sm text-gray-500 dark:text-gray-400 mt-4 block">
                      {new Date(
                        post.frontmatter.published,
                      ).toLocaleDateString()}
                    </time>
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
