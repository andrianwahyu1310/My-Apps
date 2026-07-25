import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsConfig from "./config/cors.js";
import sessionConfig from "./config/sessions.js";
import path from "path";
import { fileURLToPath } from "url";

// =========================
// ROUTES
// =========================
import authRoutes from "./routes/authRoutes.js";
import toolRoutes from "./routes/toolsRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// =========================
// __dirname
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// APP LOCALS
// =========================
app.locals.toolsFile = path.join(__dirname, "data", "tools.json");

// =========================
// CORS
// =========================
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://andrianwahyu1310.github.io", // Ditambahkan langsung sebagai cadangan aman
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL
]
  .filter(Boolean)
  .map(url => url.replace(/\/$/, "")); // Menghapus tanda '/' di akhir URL jika ada

app.use(corsConfig({
    origin(origin, callback) {
        // Postman / Thunder Client / Server-to-Server
        if (!origin) {
            return callback(null, true);
        }

        const cleanOrigin = origin.replace(/\/$/, "");

        if (allowedOrigins.includes(cleanOrigin)) {
            return callback(null, true);
        }

        return callback(new Error("Origin tidak diizinkan oleh CORS."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// =========================
// BODY PARSER
// =========================
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// =========================
// STATIC FILE
// =========================
app.use(express.static(path.join(__dirname, "public")));

// =========================
// SESSION
// =========================
const isProduction = process.env.NODE_ENV === "production";

app.use(sessionConfig({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: isProduction, // Wajib true jika sameSite: "none"
        sameSite: isProduction ? "none" : "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

// =========================
// HEALTH CHECK
// =========================
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend berjalan normal."
    });
});

// =========================
// ROUTES
// =========================
app.use("/api", authRoutes);
app.use("/api", toolRoutes);
app.use("/api", articleRoutes);
app.use("/api", quizRoutes);
app.use("/api", accountRoutes);
app.use("/api", contactRoutes);

// =========================
// 404 API
// =========================
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint API tidak ditemukan!"
    });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server."
    });
});

export default app;