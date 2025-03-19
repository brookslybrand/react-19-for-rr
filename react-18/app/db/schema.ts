export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
};

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  slug: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  themePreference: "light" | "dark";
};

export interface DatabaseMethods {
  getUser(id: string): Promise<User | undefined>;
  getProductReviews(productId: string): Promise<Review[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  addToCart(productId: string): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  getCartWithProducts(): Promise<(CartItem & { product: Product })[]>;
  getCartTotal(): Promise<number>;
}

export type Database = {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  blogPosts: BlogPost[];
  users: User[];
} & DatabaseMethods;
