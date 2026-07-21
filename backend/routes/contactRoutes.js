import express from "express";
// import upload from "../config/multer.js";
import { report } from "../controllers/contactControllers.js";
import { protectAPI } from "../middleware/protectApi.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/contact/report",
    protectAPI,
    upload.single("screenshot"),
    report
);

export default router;