import { Suspense } from "react";
import { Await, useFetcher } from "react-router";
import { db } from "../db/data";
import type { Route } from "./+types/product-details";
import { getDb } from "~/db/middleware";
import type { Review } from "~/db/schema";

// TODO: move this to a method on the DB
async function getProductReviews(productId: string) {
  // Simulate slow API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return db.reviews.filter((review) => review.productId === productId);
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = getDb(context);
  const product = db.products.find((p) => p.id === params.id);

  if (!product) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    product,
    reviews: getProductReviews(params.id),
  };
}

export default function Product({ loaderData }: Route.ComponentProps) {
  const { product, reviews } = loaderData;
  const fetcher = useFetcher();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
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
