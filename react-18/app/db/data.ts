import type { Database } from "./schema";

export const db: Database = {
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
      themePreference: "light",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      themePreference: "dark",
    },
  ],
};
