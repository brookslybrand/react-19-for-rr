// Still paying dividends: https://github.com/pcattori/remix-blog-mdx/tree/main/app/routes

export type Frontmatter = {
  title: string;
  description: string;
  published: string; // YYYY-MM-DD
  featured: boolean;
};

export type PostMeta = {
  slug: string;
  frontmatter: Frontmatter;
};

export const getPosts = async (): Promise<PostMeta[]> => {
  const modules = import.meta.glob<{ frontmatter: Frontmatter }>(
    "./blog-posts/*.mdx",
    { eager: true },
  );

  // @ts-expect-error -- this should be typed at this point, I'm doing something wrong
  const build = await import("virtual:react-router/server-build");

  const posts = Object.entries(modules).map(([file, post]) => {
    const id = file.replace("./", "").replace(/\.mdx$/, "");
    const slug = build.routes[id].path;

    if (slug === undefined) throw new Error(`No route for ${id}`);

    return {
      slug,
      frontmatter: post.frontmatter,
    };
  });
  return sortBy(posts, (post) => post.frontmatter.published, "desc");
};

export const getFeaturedPosts = async (): Promise<PostMeta[]> => {
  const posts = await getPosts();
  return posts.filter((post) => post.frontmatter.featured);
};

function sortBy<T>(
  arr: T[],
  key: (item: T) => any,
  dir: "asc" | "desc" = "asc",
) {
  return arr.sort((a, b) => {
    const res = compare(key(a), key(b));
    return dir === "asc" ? res : -res;
  });
}

function compare<T>(a: T, b: T): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}
