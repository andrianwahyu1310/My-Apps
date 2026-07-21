import express from "express";
import protectAPI from "../middleware/protectApi.js";
import { detail } from "../controllers/detailControllers.js";
import { setTheme, getSetTheme } from "../controllers/authControllers.js";

const router = express.Router();

router.get("/detail", protectAPI, detail);
router.post("/user/setTheme", protectAPI, setTheme);
router.get("/user/getSetTheme", protectAPI, getSetTheme);

export default router;