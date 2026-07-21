const DEFAULT_API_URL = "http://localhost:3000";
const PROD_API_URL = "https://my-apps-backend.vercel.app";
const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? DEFAULT_API_URL
    : PROD_API_URL);

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_URL ? `${API_URL}${normalizedPath}` : normalizedPath;
};

export const apiFetch = async (path, options = {}) => {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Accept", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return { response, data };
};

export default API_URL;