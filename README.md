# What React 19 means for React Router

This repository serves as a playground for my Epic Web Conf talk exploring the relationship between React 19 and React Router.

## Repository Structure

This is a monorepo containing two applications:

- `react-18/` - Implementation using React 18 and React Router
- `react-19/` - Implementation using React 19 and React Router

Each application demonstrates the same features but highlights the differences in implementation between React versions.

## Talk Overview

Now that React 19 is officially stable, what does that mean for React Router?

The introduction of Remix, a web standards-based framework built on React Router, pushed the React ecosystem forward and helped make server-side rendering, forms, and #useThePlatform cool again.

Not long after, React began sharing plans to introduce an API for creating composable server-client React applications, a.k.a React Server Components. Now, four years later, all Remix features have been fully merged into React Router, React 19 is out, and the future is bright.

In this talk, Brooks will walk through the history and evolution of React Router. He will highlight how RSC and many other new features of React 19 make React Router even better. React Router has new tools, but the same goal: to help you build better websites and make the web epic.

## Playground Structure

This repository contains a fake ecommerce store in two versions (React 18 and React 19) that showcases how React 19 features integrate with React Router. The store includes:

- Product listing and details pages
- Shopping cart with form actions
- User reviews system with deferred loading
- Blog section with isolated stylesheets
- Light/dark mode theme toggle
- Custom elements integration

Each feature is designed to demonstrate specific React 19 capabilities and how they enhance React Router applications.

## Talk Overview

### React Compiler

Not really a React 19 feature, and still in beta at the time of this talk. However, it's so simple to drop in and gives you benefits immediate benefits, so why not[^1]?

[React Compiler Docs](https://react.dev/learn/react-compiler)

```shell
pnpm --filter react-19 add -D vite-plugin-babel babel-plugin-react-compiler@beta
```

```ts
// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";

export default defineConfig({
  plugins: [
    reactRouter(),
    babel({
      filter: /app\/.*\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript"], // if you use TypeScript
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
```

Note: You should probably also add `eslint-plugin-react-compiler@beta` to your project as well, but I'm not using linting in this project.

[^1]: Why not is because it's still in beta, so you _may_ encounter some issues, but so far I've heard really good things

### Custom Elements Example

**Before React 19:** Challenges integrating Web Components with React's rendering lifecycle and event system.

**After React 19:**

- Theme Toggle using Web Components

Big thanks to [this example](https://stackblitz.com/~/github.com/aleks-elkin/react-web-components) which helped me get started with this example.

<details>
<summary>color-scheme-picker.js</summary>

```tsx
class ColorSchemePickerMenu extends HTMLElement {
  #open = false;
  #currentScheme = "system";
  #container = null;

  static get observedAttributes() {
    return ["current-scheme"];
  }

  get open() {
    return this.#open;
  }

  set open(value) {
    this.#open = value;
    this.update();
  }

  constructor() {
    super();
    this.#container = document.createElement("div");
    this.#container.className =
      "absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 hidden";
  }

  connectedCallback() {
    this.appendChild(this.#container);
    this.update();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "current-scheme") {
      this.#currentScheme = newValue || "system";
      this.update();
    }
  }

  update() {
    if (!this.#open) {
      this.#container.classList.add("hidden");
      return;
    }

    this.#container.classList.remove("hidden");
    this.#container.innerHTML = `
      <div class="py-1">
        <button
          data-scheme="light"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "light"
              ? "bg-gray-100 dark:bg-gray-700"
              : ""
          }"
        >
          <span>☀️</span> Light
        </button>
        <button
          data-scheme="dark"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "dark" ? "bg-gray-100 dark:bg-gray-700" : ""
          }"
        >
          <span>🌙</span> Dark
        </button>
        <button
          data-scheme="system"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            this.#currentScheme === "system"
              ? "bg-gray-100 dark:bg-gray-700"
              : ""
          }"
        >
          <span>💻</span> System
        </button>
      </div>
    `;

    // Add event listeners
    const buttons = this.#container.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const scheme = button.getAttribute("data-scheme");
        this.dispatchEvent(
          new CustomEvent("change", {
            detail: { scheme },
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }
}

if (!customElements.get("color-scheme-picker-menu")) {
  customElements.define("color-scheme-picker-menu", ColorSchemePickerMenu);
}
```

</details>

### Hydration Improvements Example (Theme Toggle)

**Before React 19:** Poor hydration mismatch messages and hydration errors when third-party extensions modify the DOM, requiring complex workarounds.

**After React 19:**

- Light/dark mode implementation showcasing React 19's improved hydration
- Demo of React 19's improved hydration warnings
- Demonstration of React 19's ability to handle third-party scripts and browser extensions

This was a very common issue before:

- [React 18 : Hydration failed because the initial UI does not match what was rendered on the server.](https://github.com/remix-run/remix/issues/2570)
- [Hydration failed because external script changes DOM](https://github.com/remix-run/remix/discussions/3179)
- [Remix Docs](https://remix.run/docs/en/main/guides/gotchas#browser-extensions-injecting-code)
- [Solve React hydration errors in Remix/Next apps](https://www.jacobparis.com/content/remix-hydration-errors)

### Document Metadata Example (Blog)

**Before React 19:** Reliance on `links` and `meta` exports to add metadata to the document.

**After React 19:**

- Blog section using the `link` component and `preload` to isolate stylesheets
- Implementation of new metadata patterns in React Router
- Demo showing removal of `links` and `meta` exports

Previously you had to rely on special React Router exports to add metadata to the document. Now you can use JSX directly in your components:

```tsx
// Before
export const meta: Route.MetaFunction = () => {
  return [
    { title: "Blog | Remix Store" },
    {
      name: "description",
      content: "Articles about React Router...",
    },
  ];
};

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: blogCss },
];
```

Now you can use JSX directly in your components:

```tsx
// After
export default function Blog() {
  return (
    <>
      <title>Blog | Remix Store</title>
      <meta name="description" content="Articles about React Router..." />
      <link href={blogCss} rel="stylesheet" />
      {/* Rest of your component */}
    </>
  );
}
```

Overall this is much more composable and declarative, and what you write ends up looking much closer to the final HTML. You can also declare metadata in MDX files, which is pretty cool.

Debatable if the links one is better, but it's more composable and nice for 3rd party components that define their own stylesheets.

### `use` API Example (Product Details & Reviews)

**Before React 19:** Leverages `Async` and `Suspense` to defer loading of reviews section.

**After React 19:**

- Product details page with deferred loading of reviews section
- Demo of the new `use` API for reading resources in render
- Implementation of conditional data fetching with `use`
- Comparison with previous approaches (useEffect, useContext, etc.)

### Actions Example (Shopping Cart)

**Before React 19:** Uses `useForm`.

**After React 19:**

- Implementation of cart functionality using React 19's Actions API
- Demo of async transitions with `useTransition` for handling pending states
- Example of form handling with `useActionState` and `<form action={actionFunction}>`
- Implementation of optimistic UI updates with `useOptimistic` when adding/removing items
- Showcase of `useFormStatus` for loading states in cart buttons

### Honorable Mentions

- `useLayoutEffect` warning is gone in SSR
- RSC/server actions integration
- Better Error Reporting
- cleanup function for refs
- Context as a provider
- ref as a prop
- `prerender` optimization for static pages

## Technical Setup

### Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server for React 18 version:

```bash
pnpm --filter react-18 dev
```

Start the development server for React 19 version:

```bash
pnpm --filter react-19 dev
```

Your applications will be available at:

- React 18: `http://localhost:5173`
- React 19: `http://localhost:5174`

### Building for Production

Create production builds:

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter react-18 build
pnpm --filter react-19 build
```

## Resources

- [React 19 Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Epic Web Conf](https://epicweb.dev/conf)
