import { Suspense, useState } from "react";
import { Await, useFetcher } from "react-router";
import { getDb } from "~/db/data.server";
import type { Review } from "~/db/schema";
import type { Route } from "./+types/product-details";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = getDb(context);
  const product = await db.getProduct(params.id);

  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    product,
    reviews: db.getProductReviews(params.id),
  };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, reviews } = loaderData;
  const fetcher = useFetcher();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageCarousel images={product.images} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            {product.description}
          </p>
          <fetcher.Form method="post" action="/cart">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="intent" value="add" />
            <button
              className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              type="submit"
            >
              Add to Cart
            </button>
          </fetcher.Form>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Reviews
        </h2>
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          }
        >
          <Await resolve={reviews}>
            {(resolvedReviews) => <Reviews reviews={resolvedReviews} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt="Product"
        className="w-full h-96 object-contain rounded-lg bg-white dark:bg-gray-800"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1))
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1))
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75"
            aria-label="Next image"
          >
            →
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-gray-600 dark:text-gray-300">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <div className="text-yellow-400">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
