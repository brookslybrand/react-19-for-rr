import type { Route } from "./+types/blog-post";
import { getDb } from "~/db/middleware";

export async function loader({ params, context }: Route.LoaderArgs) {
  const db = getDb(context);
  const post = db.blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return { post };
}

export default function BlogPost({ loaderData }: Route.ComponentProps) {
  const { title, content, date, author } = loaderData.post;

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <div className="flex items-center gap-4 mt-4 text-gray-500 dark:text-gray-400">
          <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
          <span>by {author}</span>
        </div>
      </header>
      <div className="prose dark:prose-invert">
        {content.split("\n").map((paragraph, i) => (
          <p key={i} className="text-gray-600 dark:text-gray-300 mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
