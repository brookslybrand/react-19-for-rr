import { redirect } from "react-router";
import { getDb } from "~/db/middleware";
import type { Route } from "./+types/cart";

export async function action({ request, context }: Route.ActionArgs) {
  const db = getDb(context);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const productId = formData.get("productId");

  if (typeof productId !== "string") {
    throw new Error("Invalid product ID");
  }

  if (intent === "add") {
    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = db.cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      db.cart.push({
        id: String(Date.now()),
        productId,
        quantity: 1,
      });
    }
  } else if (intent === "remove") {
    const index = db.cart.findIndex((item) => item.productId === productId);
    if (index > -1) {
      db.cart.splice(index, 1);
    }
  }

  return redirect("/cart");
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  const cartItems = db.cart.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) throw new Error("Product not found");
    return { ...item, product };
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return { cartItems, total };
}

export default function Cart({ loaderData }: Route.ComponentProps) {
  const { cartItems, total } = loaderData;

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Add some products to your cart to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your Cart
      </h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {item.product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Quantity: {item.quantity}
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <form method="post">
              <input type="hidden" name="productId" value={item.productId} />
              <button
                type="submit"
                name="intent"
                value="remove"
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${total.toFixed(2)}
          </span>
        </div>
        <button
          className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            alert("Checkout not implemented!");
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
