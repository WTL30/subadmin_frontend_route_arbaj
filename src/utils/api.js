// Resolve API base URL from environment for both dev and prod.
// Use NEXT_PUBLIC_ so it is exposed to the browser at build/runtime in Next.js.
const baseURL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  "http://localhost:3005/";

export default baseURL;