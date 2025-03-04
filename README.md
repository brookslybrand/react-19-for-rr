# What React 19 means for React Router

This repository serves as a playground for my Epic Web Conf talk exploring the relationship between React 19 and React Router.

## Talk Overview

Now that React 19 is officially stable, what does that mean for React Router?

The introduction of Remix, a web standards-based framework built on React Router, pushed the React ecosystem forward and helped make server-side rendering, forms, and #useThePlatform cool again.

Not long after, React began sharing plans to introduce an API for creating composable server-client React applications, a.k.a React Server Components. Now, four years later, all Remix features have been fully merged into React Router, React 19 is out, and the future is bright.

In this talk, Brooks will walk through the history and evolution of React Router. He will highlight how RSC and many other new features of React 19 make React Router even better. React Router has new tools, but the same goal: to help you build better websites and make the web epic.

## Playground Structure

This repository contains examples and demonstrations that showcase:

- The evolution of React Router
- How React 19 features integrate with React Router
- Practical implementations of React Server Components with React Router
- Performance comparisons and optimization techniques

_Note: This structure will evolve as the talk preparation progresses_

## Talk Structure

### Actions Example

- Demo of async transitions with `useTransition` for handling pending states
- Example of form handling with `useActionState` and `<form action={actionFunction}>`
- Implementation of optimistic UI updates with `useOptimistic`
- Showcase of `useFormStatus` for design system components
- TODO: Create before/after code samples showing simplified data mutation patterns

### Use API Example

- Demo of the new `use` API for reading resources in render
- Example showing conditional context consumption with `use`
- Comparison with previous approaches (useContext, etc.)
- TODO: Build sample implementation showing practical use cases with React Router

### Document Metadata Example

- Demo showing removal of `links` and `meta` exports
- Implementation of new metadata patterns in React Router
- TODO: Create before/after code samples

### Hydration Improvements Example

- Demo of React 19's improved hydration warnings
- Example showing recovery from 3rd party extension conflicts
- TODO: Create reproducible hydration issue examples

### Custom Elements Example

- Demo integrating Web Components with React Router
- TODO: Build sample implementation with performance metrics

### Other

- RSC/server actions
- `prerender`

## Technical Setup

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Building for Production

Create a production build:

```bash
npm run build
```

## Resources

- [React 19 Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Epic Web Conf](https://epicweb.dev/conf)
