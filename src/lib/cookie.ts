import { cookies } from "next/headers";

/**
 * Get a cookie value from the server (SSR or Server Component).
 *
 * @param name - The cookie name to retrieve.
 * @param rules - Optional settings:
 *   - decode: whether to run `decodeURIComponent` on the value (default: true)
 *   - list: allowed values (if provided, only returns a value that exists in the list)
 *   - defaultValue: value to return if the cookie is not found or invalid (default: "")
 *   - trim: whether to trim spaces from the cookie name (default: true)
 * @returns The cookie value if found and valid, otherwise the defaultValue or null.
 */
export async function getServerCookie(
  name: string,
  rules?: {
    decode?: boolean;
    list?: string[];
    defaultValue?: string;
    trim?: boolean;
  }
): Promise<string | null> {
  const opts = {
    decode: true,
    defaultValue: "",
    trim: true,
    ...rules,
  };

  // Access the cookie store provided by Next.js
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(name)?.value ?? null;

  if (!rawValue) return opts.defaultValue ?? null;

  let value = rawValue;
  if (opts.trim) value = value.trim();
  if (opts.decode) value = decodeURIComponent(value);

  // If an allowed list is specified, ensure the cookie value is valid
  if (opts.list && !opts.list.includes(value)) {
    return opts.defaultValue ?? null;
  }

  return value;
}
