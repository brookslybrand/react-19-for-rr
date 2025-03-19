import { href, Link } from "react-router";
import type { Route } from "./+types/home";
import { getDb } from "~/db/middleware";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  return {
    featuredProducts: db.products.slice(0, 3),
    latestPosts: db.blogPosts.slice(0, 2),
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { featuredProducts, latestPosts } = loaderData;

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome to our Store
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Check out our latest products and blog posts.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={href("/products/:id", { id: product.id })}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Latest Blog Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={href("/blog/:slug", { slug: post.slug })}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {post.content.slice(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {new Date(post.date).toLocaleDateString()} by {post.author}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
