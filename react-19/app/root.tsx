import { useEffect, useRef, useState } from "react";
import {
  href,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetcher,
  useLoaderData,
} from "react-router";
import { dbMiddleware, getDb } from "./db/data.server";

import { ColorSchemeScript, useColorScheme } from "color-scheme";
import { parseColorScheme } from "color-scheme/cookie.server";
import { preinitModule } from "react-dom";
import type { Route } from "./+types/root";
import "./styles/app.css";

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

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  preinitModule("/color-scheme-picker.js");
  return await serverLoader();
}

clientLoader.hydrate = true as const;

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
          <Navigation cartTotal={cartTotal} />
          <main className="container mx-auto px-4 py-8" role="main">
            {children}
          </main>
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
    <main
      className="min-h-[50vh] flex flex-col items-center justify-center p-4 container mx-auto"
      role="alert"
    >
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {message}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          {details}
        </p>
        {stack && (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-700 dark:text-gray-300">
              <code>{stack}</code>
            </pre>
          </div>
        )}
        <Link
          to={href("/")}
          className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}

function Navigation({ cartTotal }: { cartTotal: number }) {
  return (
    <nav
      className="bg-gray-100 dark:bg-gray-800 p-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <Link
            to={href("/")}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Home
          </Link>
          <Link
            to={href("/products")}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Products
          </Link>
          <Link
            to={href("/blog")}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Blog
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            to={href("/cart")}
            className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            aria-label={`Cart with ${cartTotal} items`}
          >
            Cart ({cartTotal})
          </Link>
          <ColorSchemePicker />
        </div>
      </div>
    </nav>
  );
}

function ColorSchemePicker() {
  const fetcher = useFetcher();
  const { colorScheme } = useLoaderData<typeof loader>();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const menu = document.querySelector("color-scheme-picker-menu");

      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        menu &&
        !menu.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (value: string) => {
    fetcher.submit(
      { colorScheme: value },
      { method: "post", action: "/resources/color-scheme" },
    );
    setIsOpen(false);
  };

  return (
    <div className="relative" role="menu" aria-label="Color scheme menu">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="sr-only">Toggle color scheme</span>
        {colorScheme === "light" ? "☀️" : colorScheme === "dark" ? "🌙" : "💻"}
      </button>

      {/* @ts-ignore not part of this demo */}
      <color-scheme-picker-menu
        open={isOpen}
        current-scheme={colorScheme}
        onChange={(e: any) => {
          handleChange(e.nativeEvent.detail.scheme);
        }}
      />
    </div>
  );
}
