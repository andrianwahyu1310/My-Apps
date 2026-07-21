import session from "express-session";

const sessionConfig = (options = {}) => session({
    secret: options.secret || process.env.TOKEN_SECRET || "fallback-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        ...options.cookie
    },
    ...options
});

export default sessionConfig;