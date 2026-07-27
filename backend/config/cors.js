import cors from "cors";

// Daftar Origin yang Diizinkan (Lokal & Production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://andrianwahyu1310.github.io",
  "https://www.andrianwahyu1310.github.io",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean) // Menghapus nilai undefined/null jika env tidak diisi
  .map(url => url.replace(/\/$/, "")); // Menghapus trailing slash di akhir URL (misal: /)

const corsOptions = {
  origin: (origin, callback) => {
    // 💡 1. Izinkan request tanpa origin (seperti Postman, cURL, atau Server-to-Server)
    if (!origin) {
      return callback(null, true);
    }

    // Bersihkan trailing slash pada origin request yang masuk
    const cleanOrigin = origin.replace(/\/$/, "");

    // 💡 2. Cek apakah origin ada di dalam allowedOrigins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // 💡 3. Jika ditolak, kembalikan Error Objek agar dicatat jelas oleh Express/Browser
    return callback(new Error(`Akses CORS Ditolak: Domain '${origin}' tidak diizinkan.`));
  },

  // Wajib 'true' agar Cookie / Session / Authorization Header diizinkan lalu-lalang cross-domain
  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers"
  ],

  // Memberikan respon status 200/204 untuk request Preflight (OPTIONS)
  optionsSuccessStatus: 200
};

export default cors(corsOptions);