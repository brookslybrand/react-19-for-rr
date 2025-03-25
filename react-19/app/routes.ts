import { type RouteConfig, index, route } from "@react-router/dev/routes";
import fs from "fs";
import path from "path";

const blogPostsDir = path.join(process.cwd(), "app/blog-posts");
const mdxFiles = fs
  .readdirSync(blogPostsDir)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => ({
    path: file.replace(".mdx", ""),
    file: `blog-posts/${file}`,
  }));

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:id", "routes/product-details.tsx"),
  route("blog", "routes/blog-layout.tsx", [
    index("routes/blog-home.tsx"),
    ...mdxFiles.map(({ path: routePath, file }) => route(routePath, file)),
  ]),
  route("cart", "routes/cart.tsx"),
  route("resources/color-scheme", "routes/resources/color-scheme.ts"),
] satisfies RouteConfig;
