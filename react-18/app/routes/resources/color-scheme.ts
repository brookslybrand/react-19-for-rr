import { data, type ActionFunctionArgs } from "react-router";
import {
  serializeColorScheme,
  validateColorScheme,
} from "color-scheme/cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let colorScheme = formData.get("colorScheme");
  if (!validateColorScheme(colorScheme)) {
    throw new Response("Bad Request", { status: 400 });
  }

  return data(colorScheme, {
    headers: { "Set-Cookie": await serializeColorScheme(colorScheme) },
  });
}
