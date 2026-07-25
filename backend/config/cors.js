import cors from "cors";

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://andrianwahyu1310.github.io",
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL
]
  .filter(Boolean)
  .map(url => url.replace(/\/$/, ""));

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa origin (Postman/Server-to-server)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Jangan kirim new Error(), cukup return false agar server tidak melempar 500 error
    return callback(null, false);
  },
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
  optionsSuccessStatus: 200 // Memastikan respons status 200 untuk browser lama/preflight
};

export default cors(corsOptions);