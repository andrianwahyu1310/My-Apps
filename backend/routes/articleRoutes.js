import express from "express";

import {
    getArticleByCategory,
    getCategories
} from "../controllers/articleController.js";

const router = express.Router();

router.get("/artikel/:namaKategori", getArticleByCategory);

router.get("/categories", getCategories);

export default router;