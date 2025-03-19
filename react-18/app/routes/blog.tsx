import { href, Link } from "react-router";
import { getDb } from "~/db/data.server";
import type { Route } from "./+types/blog";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  return { posts: db.blogPosts };
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Blog Posts
      </h1>
      <div className="space-y-8">
        {loaderData.posts.map((post) => (
          <Link
            key={post.id}
            to={href("/blog/:slug", { slug: post.slug })}
            className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              {post.content.slice(0, 200)}...
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <span>by {post.author}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
