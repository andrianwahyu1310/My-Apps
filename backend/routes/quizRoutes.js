import express from "express";

import {
    quizQuestions,
    brainTeaser
} from "../controllers/quizControllers.js";

import {
    protectAPI
} from "../middleware/protectApi.js";

const router = express.Router();

router.get(
    "/quiz-questions",
    protectAPI,
    quizQuestions
);

router.get(
    "/container-brain-teaser/:id",
    protectAPI,
    brainTeaser
);

export default router;