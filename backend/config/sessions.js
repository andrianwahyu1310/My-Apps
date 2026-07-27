import session from "express-session";

// 💡 PERBAIKAN: Hanya bernilai true JIKA process.env.NODE_ENV benar-benar "production"
const isProduction = process.env.NODE_ENV === "production";

/**
 * Konfigurasi Express Session untuk Lokal (HTTP) & Production/Railway (HTTPS)
 */
const sessionConfig = (options = {}) =>
  session({
    secret: options.secret || process.env.TOKEN_SECRET || "login-secret-base/23-1244-Sd-34",
    resave: false,
    saveUninitialized: false,
    proxy: isProduction, // Dipasang true hanya di Production/Railway
    cookie: {
      secure: isProduction, // false di lokal (HTTP), true di Railway (HTTPS)
      sameSite: isProduction ? "none" : "lax", // 'lax' di lokal, 'none' di Railway
      httpOnly: true, // Mencegah akses cookie melalui JavaScript (XSS Protection)
      maxAge: 1000 * 60 * 60 * 24, // Masa berlaku cookie (1 hari)
      ...options.cookie,
    },
    ...options,
  });

export default sessionConfig;