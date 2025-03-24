import { getDb } from "~/db/data.server";
import { ProductCard } from "~/components/product-card";
import type { Route } from "./+types/products";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Products | Remix Store" },
    {
      name: "description",
      content: "Browse our complete collection of products",
    },
  ];
};

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  return { products: db.products };
}

export default function Products({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Our Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loaderData.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
