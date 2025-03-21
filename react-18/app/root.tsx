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
  useFetcher,
} from "react-router";
import { dbMiddleware, getDb } from "./db/data.server";

import type { Route } from "./+types/root";
import "./styles/app.css";
import { parseColorScheme } from "color-scheme/cookie.server";
import { ColorSchemeScript, useColorScheme } from "color-scheme";

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

export async function loader({ request, context }: Route.LoaderArgs) {
  const db = getDb(context);

  const [user, cartTotal, colorScheme] = await Promise.all([
    db.getUser("3"),
    db.getCartTotal(),
    parseColorScheme(request),
  ]);

  return { user, cartTotal, colorScheme };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { cartTotal } = useLoaderData<typeof loader>();
  let colorScheme = useColorScheme();

  return (
    <html lang="en" className={colorScheme === "dark" ? "dark" : ""}>
      <head>
        <ColorSchemeScript />
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
                  Cart ({cartTotal})
                </Link>
                <ColorSchemePicker />
              </div>
            </div>
          </nav>
          <main className="container mx-auto px-4 py-8">{children}</main>
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

function ColorSchemePicker() {
  const fetcher = useFetcher();
  const { colorScheme } = useLoaderData<typeof loader>();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    fetcher.submit(
      { colorScheme: value },
      { method: "post", action: "/resources/color-scheme" },
    );
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
        aria-label="Toggle color scheme"
      >
        {colorScheme === "light" ? "☀️" : colorScheme === "dark" ? "🌙" : "💻"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleChange("light")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              role="menuitem"
            >
              <span>☀️</span> Light
            </button>
            <button
              onClick={() => handleChange("dark")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              role="menuitem"
            >
              <span>🌙</span> Dark
            </button>
            <button
              onClick={() => handleChange("system")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              role="menuitem"
            >
              <span>💻</span> System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
