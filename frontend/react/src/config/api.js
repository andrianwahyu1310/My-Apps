// URL Backend Lokal (saat testing di komputer)
const LOCAL_API_URL = "http://localhost:3000";

// URL Backend Production di Railway
const PROD_API_URL = "https://my-apps-production-219a.up.railway.app";

// Cek apakah frontend sedang dijalankan di komputer lokal (localhost / 127.0.0.1)
const isLocalhost = 
  window.location.hostname === "localhost" || 
  window.location.hostname === "127.0.0.1";

// Pilih API URL berdasarkan environment variable ATAU kondisi localhost
const API_URL =
  import.meta.env.VITE_API_URL || (isLocalhost ? LOCAL_API_URL : PROD_API_URL);

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
    credentials: "include", // Wajib agar Cookie Session terkirim otomatis!
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