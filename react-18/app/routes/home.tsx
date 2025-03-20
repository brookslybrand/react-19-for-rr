import type { Route } from "./+types/home";
import { getDb } from "~/db/data.server";
import { ProductCard } from "~/components/product-card";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  return {
    featuredProducts: db.products.slice(0, 3),
  };
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const { featuredProducts } = loaderData;

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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
