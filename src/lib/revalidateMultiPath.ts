import { revalidatePath } from "next/cache";

export function revalidateMultiPath(paths: string[]) {
  paths.map((p) => revalidatePath(p));
}
