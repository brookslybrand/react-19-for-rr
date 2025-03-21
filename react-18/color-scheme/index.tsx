import { useLayoutEffect, useMemo } from "react";
import { useNavigation, useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "~/root";

export type ColorScheme = "dark" | "light" | "system";

export function useColorScheme(): ColorScheme {
  const rootLoaderData = useRouteLoaderData<typeof rootLoader>("root");
  const rootColorScheme = rootLoaderData?.colorScheme ?? "system";

  const { formData } = useNavigation();
  const optimisticColorScheme = formData?.has("colorScheme")
    ? (formData.get("colorScheme") as ColorScheme)
    : null;
  return optimisticColorScheme || rootColorScheme;
}

function syncColorScheme(media: MediaQueryList | MediaQueryListEvent) {
  if (media.matches) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ColorSchemeScript() {
  const colorScheme = useColorScheme();
  // This script automatically adds the dark class to the document element if
  // colorScheme is "system" and prefers-color-scheme: dark is true.
  const script = useMemo(
    () => `
        const colorScheme = ${JSON.stringify(colorScheme)};
        if (colorScheme === "system") {
          const media = window.matchMedia("(prefers-color-scheme: dark)")
          if (media.matches) document.documentElement.classList.add("dark");
        }
      `,
    [], // eslint-disable-line -- we don't want this script to ever change
  );

  // Set
  useLayoutEffect(() => {
    switch (colorScheme) {
      case "light":
        document.documentElement.classList.remove("dark");
        break;
      case "dark":
        document.documentElement.classList.add("dark");
        break;
      case "system": {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        syncColorScheme(media);
        media.addEventListener("change", syncColorScheme);
        return () => media.removeEventListener("change", syncColorScheme);
      }
      default:
        console.error("Impossible color scheme state:", colorScheme);
    }
  }, [colorScheme]);

  // always sync the color scheme if "system" is used
  // this accounts for the docs pages adding some classnames to documentElement in root
  useLayoutEffect(() => {
    if (colorScheme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      syncColorScheme(media);
    }
  });

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
