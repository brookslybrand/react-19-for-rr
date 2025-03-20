import { useState } from "react";
import { href, Link } from "react-router";
import type { Product } from "~/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const showSecondImage = isHovered && product.images.length > 1;

  return (
    <Link
      to={href("/products/:id", { id: product.id })}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square">
        <img
          src={showSecondImage ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain rounded-t-lg bg-white dark:bg-gray-800 transition-opacity duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
