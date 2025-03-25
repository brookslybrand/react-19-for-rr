import clsx from "clsx";
import { href, Link } from "react-router";
import type { Product } from "~/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const images = product.images.slice(0, 2);
  return (
    <div className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow group relative">
      <div className="relative aspect-square">
        {images.length === 2 ? (
          images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={index === 0 ? product.name : undefined}
              className={
                index === 0
                  ? "opacity-100 group-hover:opacity-0"
                  : "opacity-0 group-hover:opacity-100"
              }
            />
          ))
        ) : (
          <Image key={images[0]} src={images[0]} alt={product.name} />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <Link to={href("/products/:id", { id: product.id })}>
            <span className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function Image({
  src,
  alt,
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        "w-full h-full object-contain rounded-t-lg bg-white dark:bg-gray-800 absolute",
        className,
      )}
    />
  );
}
