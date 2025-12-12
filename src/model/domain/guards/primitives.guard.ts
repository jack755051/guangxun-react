// sanitize text input
export function safeText(x: unknown, fallback = "") {
  return typeof x === "string" ? x.trim() || fallback : fallback;
}
// sanitize URL input
export function isHttpUrl(x: string): boolean {
  try {
    const u = new URL(x);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
