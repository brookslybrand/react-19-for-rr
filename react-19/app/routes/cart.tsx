import { redirect, useFetcher } from "react-router";
import { getDb } from "~/db/data.server";
import type { Route } from "./+types/cart";

export const meta: Route.MetaFunction = ({ data }) => {
  const numItems = data.cartItems ? data.cartItems.length : 0;
  return [
    {
      title: `Cart ${numItems ? `(${numItems})` : ""} | Remix Store`,
    },
    {
      name: "description",
      content: "View and manage items in your shopping cart",
    },
  ];
};

export async function action({ request, context }: Route.ActionArgs) {
  const db = getDb(context);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const productId = formData.get("productId");

  if (typeof productId !== "string") {
    throw new Error("Invalid product ID");
  }

  if (intent === "add") {
    await db.addToCart(productId);
    return redirect("/cart");
  } else if (intent === "remove") {
    await db.removeFromCart(productId);
    return null;
  }
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDb(context);
  const [cartItems, total] = await Promise.all([
    db.getCartWithProducts(),
    db.getCartTotal(),
  ]);

  return {
    cartItems,
    total,
  };
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
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
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

type CartItemProps = {
  item: Route.ComponentProps["loaderData"]["cartItems"][number];
};

function CartItem({ item }: CartItemProps) {
  const fetcher = useFetcher();

  return (
    <li
      key={item.id}
      className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg"
    >
      <img
        src={item.product.images[0]}
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
      <fetcher.Form method="post">
        <input type="hidden" name="productId" value={item.productId} />
        <button
          type="submit"
          name="intent"
          value="remove"
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </button>
      </fetcher.Form>
    </li>
  );
}
