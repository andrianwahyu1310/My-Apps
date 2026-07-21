import express from "express";
import {
    register,
    login,
    logout,
    authCheck
} from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/auth-check", authCheck);

export default router;