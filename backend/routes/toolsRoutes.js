import express from "express";
import protectAPI from "../middleware/protectApi.js";

import {
    getTools,
    getMainTool
} from "../controllers/toolsController.js";

const router = express.Router();

router.get("/tools", getTools);

router.get("/mainTools/:id", protectAPI, getMainTool);

export default router;