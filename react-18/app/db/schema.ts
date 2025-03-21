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

export type User = {
  id: string;
  name: string;
  email: string;
};

export interface DatabaseMethods {
  getUser(id: string): Promise<User | undefined>;
  getProductReviews(productId: string): Promise<Review[]>;
  getProduct(id: string): Promise<Product | undefined>;
  addToCart(productId: string): Promise<void>;
  removeFromCart(productId: string): Promise<void>;
  getCartWithProducts(): Promise<(CartItem & { product: Product })[]>;
  getCartTotal(): Promise<number>;
}

export type Database = {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  users: User[];
} & DatabaseMethods;
