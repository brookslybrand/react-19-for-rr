import { href, Link } from "react-router";
import { getDb } from "../db/middleware";

import type { Route } from "./+types/products";

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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-4">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
