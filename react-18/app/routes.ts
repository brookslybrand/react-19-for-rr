import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:id", "routes/product-details.tsx"),
  route("blog", "routes/blog.tsx"),
  route("blog/:slug", "routes/blog-post.tsx"),
  route("cart", "routes/cart.tsx"),
] satisfies RouteConfig;
