import {
  unstable_createContext,
  type unstable_RouterContextProvider,
} from "react-router";

import type { Route } from "../+types/root";
import type { Database, DatabaseMethods } from "./schema";

// Base data
const baseData: Omit<Database, keyof DatabaseMethods> = {
  products: [
    {
      id: "1",
      name: "Load in Parallel T-shirt",
      description: "Heavyweight, relaxed fit. Screenprinted graphic on chest",
      price: 29.99,
      images: [
        "/assets/T-Shirt - Load in Parallel - Black.png",
        "/assets/T-Shirt - Load in Parallel - Back - Black.png",
      ],
      category: "apparel",
    },
    {
      id: "2",
      name: "Remix Engineering Hoodie",
      description:
        "Premium heavyweight, oversized fit. Screenprinted graphics on chest, sleeves, and back. No drawcord for a cleaner, modern look",
      price: 59.99,
      images: [
        "/assets/Hoodie - Remix Engineering - Front.png",
        "/assets/Hoodie - Remix Engineering - Back.png",
        "/assets/Hoodie - Remix Engineering - Side.png",
      ],
      category: "apparel",
    },
    {
      id: "3",
      name: "Remix Sticker Pack",
      description:
        "A pack of 6 stickers featuring the Remix and React Router logos.",
      price: 9.99,
      images: [
        "/assets/Remix Sticker Pack No1 - Packaged.png",
        "/assets/Remix Sticker Pack No1 - Loose.png",
      ],
      category: "accessories",
    },
  ],
  reviews: [
    {
      id: "1",
      productId: "1",
      userId: "1",
      rating: 5,
      comment:
        "Love the design! The parallel lines are so clean and the fabric quality is top notch.",
      date: "2024-03-15",
    },
    {
      id: "2",
      productId: "1",
      userId: "2",
      rating: 4,
      comment: "Great fit and super soft. Wish it came in more colors!",
      date: "2024-03-14",
    },
    {
      id: "3",
      productId: "2",
      userId: "3",
      rating: 5,
      comment:
        "This hoodie is incredible. The engineering details on the sleeves are a conversation starter at every meetup.",
      date: "2024-03-13",
    },
    {
      id: "4",
      productId: "2",
      userId: "1",
      rating: 5,
      comment:
        "Perfect weight for coding sessions. The oversized fit is exactly what I was looking for.",
      date: "2024-03-12",
    },
    {
      id: "5",
      productId: "2",
      userId: "2",
      rating: 4,
      comment:
        "Love the minimal design without the drawstrings. Sleeves could be a bit longer but overall great quality.",
      date: "2024-03-11",
    },
    {
      id: "6",
      productId: "3",
      userId: "3",
      rating: 5,
      comment:
        "These stickers are awesome! The holographic effect on some of them is a nice touch.",
      date: "2024-03-10",
    },
    {
      id: "7",
      productId: "3",
      userId: "1",
      rating: 5,
      comment:
        "High quality stickers that actually last. Already decorated my laptop and water bottle.",
      date: "2024-03-09",
    },
  ],
  cart: [],
  users: [
    {
      id: "1",
      name: "Michael Jackson",
      email: "michael@shopify.com",
      themePreference: "light" as const,
    },
    {
      id: "2",
      name: "Ryan Florence",
      email: "ryan@shopify.com",
      themePreference: "dark" as const,
    },
    {
      id: "3",
      name: "Brooks Lybrand",
      email: "brooks@shopify.com",
      themePreference: "light" as const,
    },
  ],
};

// Simulate network delay
const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

// Database methods
const db: Database = {
  ...baseData,

  async getUser(id: string) {
    await delay();
    return this.users.find((user) => user.id === id);
  },

  async getProductReviews(productId: string) {
    await delay(1000); // Longer delay for reviews
    return this.reviews.filter((review) => review.productId === productId);
  },

  async getProduct(id: string) {
    await delay();
    return this.products.find((p) => p.id === id);
  },

  async addToCart(productId: string) {
    await delay();
    const product = await this.getProduct(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const existingItem = this.cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cart.push({
        id: String(Date.now()),
        productId,
        quantity: 1,
      });
    }
  },

  async removeFromCart(productId: string) {
    await delay();
    const index = this.cart.findIndex((item) => item.productId === productId);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  },

  async getCartWithProducts() {
    await delay();
    const items = await Promise.all(
      this.cart.map(async (item) => {
        const product = await this.getProduct(item.productId);
        if (!product) throw new Error("Product not found");
        return { ...item, product };
      }),
    );

    return items;
  },

  async getCartTotal() {
    await delay();
    const items = await this.getCartWithProducts();
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  },
};

const dbContext = unstable_createContext<Database>(db);

export const dbMiddleware: Route.unstable_MiddlewareFunction = ({
  context,
}) => {
  context.set(dbContext, db);
};

export function getDb(context: unstable_RouterContextProvider) {
  return context.get(dbContext);
}
