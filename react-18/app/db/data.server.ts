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
      name: "Mechanical Keyboard",
      description: "A premium mechanical keyboard with RGB lighting",
      price: 149.99,
      image: "https://picsum.photos/seed/keyboard/400/300",
      category: "electronics",
    },
    {
      id: "2",
      name: "Ergonomic Mouse",
      description: "Wireless ergonomic mouse for all-day comfort",
      price: 79.99,
      image: "https://picsum.photos/seed/mouse/400/300",
      category: "electronics",
    },
    {
      id: "3",
      name: "Ultra-wide Monitor",
      description: '34" curved ultra-wide monitor for productivity',
      price: 499.99,
      image: "https://picsum.photos/seed/monitor/400/300",
      category: "electronics",
    },
  ],
  reviews: [
    {
      id: "1",
      productId: "1",
      userId: "1",
      rating: 5,
      comment: "Best keyboard I've ever used!",
      date: "2024-03-15",
    },
    {
      id: "2",
      productId: "1",
      userId: "2",
      rating: 4,
      comment: "Great build quality, a bit loud though",
      date: "2024-03-14",
    },
  ],
  cart: [],
  blogPosts: [
    {
      id: "1",
      title: "The Future of Web Development",
      content: "Lorem ipsum dolor sit amet...",
      date: "2024-03-10",
      author: "Brooks Lybrand",
      slug: "future-of-web-development",
    },
    {
      id: "2",
      title: "Why React Router is Awesome",
      content: "Lorem ipsum dolor sit amet...",
      date: "2024-03-12",
      author: "Brooks Lybrand",
      slug: "why-react-router-is-awesome",
    },
  ],
  users: [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      themePreference: "light" as const,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      themePreference: "dark" as const,
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

  async getBlogPost(slug: string) {
    await delay();
    return this.blogPosts.find((p) => p.slug === slug);
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
