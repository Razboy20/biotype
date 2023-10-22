import { PrismaClient } from "@prisma/client/edge";
import { serverEnv } from "~/env/server";

// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

export const prisma = new PrismaClient({
  log: serverEnv.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
