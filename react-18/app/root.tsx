import { useEffect, useState } from "react";
import {
  href,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { db } from "~/db/data";
import { dbMiddleware } from "./db/middleware";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const unstable_middleware = [dbMiddleware];

export async function loader() {
  // In a real app, we'd get the user from a session
  const user = db.users[0];
  return { user };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData<typeof loader>();
  const [theme, setTheme] = useState<"light" | "dark">(user.themePreference);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <nav className="bg-gray-100 dark:bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex gap-4">
                <Link
                  to={href("/")}
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Home
                </Link>
                <Link
                  to={href("/products")}
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Products
                </Link>
                <Link
                  to={href("/blog")}
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Blog
                </Link>
              </div>
              <div className="flex gap-4 items-center">
                <Link
                  to={href("/cart")}
                  className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                >
                  Cart ({db.cart.length})
                </Link>
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </button>
              </div>
            </div>
          </nav>
          <main className="container mx-auto p-4">{children}</main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
