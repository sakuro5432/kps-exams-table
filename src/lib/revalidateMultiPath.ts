import "server-only";
import { revalidatePath } from "next/cache";

export function revalidateMultiPath(
  paths: string[],
  type: "page" | "layout" = "page"
) {
  paths.forEach((pathname) => revalidatePath(pathname, type));
}
