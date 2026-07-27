import dotenv from "dotenv";
dotenv.config();

import express from "express";
import corsMiddleware from "./config/cors.js";
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
const isProduction = process.env.NODE_ENV === "production";

// =========================
// __dirname
// =========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// APP LOCALS
// =========================
app.locals.toolsFile = path.join(__dirname, "data", "tools.json");

// 💡 1. TRUST PROXY (Hanya diaktifkan saat Production di Railway/HTTPS)
if (isProduction) {
  app.set("trust proxy", 1);
}

// =========================
// 2. CORS MIDDLEWARE
// =========================
app.use(corsMiddleware);
app.options(/(.*)/, corsMiddleware);

// =========================
// 3. BODY PARSER
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// 4. SESSION MIDDLEWARE (Sangat disarankan dipasang sebelum file statis & routes)
// =========================
app.use(
  sessionConfig({
    secret: process.env.TOKEN_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: isProduction, // Wajib true jika sameSite: "none"
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // Ditingkatkan ke 24 jam agar sesi lebih stabil
    }
  })
);

// =========================
// 5. STATIC FILE
// =========================
app.use(express.static(path.join(__dirname, "public")));

// =========================
// 6. CHECK SESSION ENDPOINTS
// =========================
app.get("/api/me", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  return res.status(401).json({ success: false, message: "Tidak ada sesi" });
});

app.get("/api/test-session", (req, res) => {
  req.session.test = "Halo";
  res.json({
    success: true,
    id: req.sessionID
  });
});

// =========================
// 7. HEALTH CHECK
// =========================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend berjalan normal."
  });
});

// =========================
// 8. API ROUTES
// =========================
app.use("/api", authRoutes);
app.use("/api", toolRoutes);
app.use("/api", articleRoutes);
app.use("/api", quizRoutes);
app.use("/api", accountRoutes);
app.use("/api", contactRoutes);

// =========================
// 9. 404 API HANDLER
// =========================
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint API tidak ditemukan!"
  });
});

// =========================
// 10. GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message || err);

  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server."
  });
});

export default app;