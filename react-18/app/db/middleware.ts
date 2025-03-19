import {
  unstable_createContext,
  type unstable_RouterContextProvider,
} from "react-router";
import { db } from "./data";

import type { Route } from "../+types/root";
import type { Database } from "./schema";

const dbContext = unstable_createContext<Database>(db);

export const dbMiddleware: Route.unstable_MiddlewareFunction = ({
  context,
}) => {
  context.set(dbContext, db);
};

export function getDb(context: unstable_RouterContextProvider) {
  return context.get(dbContext);
}
