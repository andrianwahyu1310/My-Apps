import fs from "fs/promises";
import {
    QUIZ_PATH,
    BRAIN_TEASER_PATH
} from "../config/path.js";


// =========================================
// Mengambil soal quiz
// =========================================
export const getQuizQuestions = async (
    mapel,
    kesulitan,
    limit = 5
) => {

    const rawData = await fs.readFile(
        QUIZ_PATH,
        "utf-8"
    );

    const database = JSON.parse(rawData);

    const soal =
        database[mapel.toLowerCase()]
        ?.[kesulitan.toLowerCase()] || [];

    if (soal.length === 0) {
        return [];
    }

    const hasil = [...soal];

    for (let i = hasil.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [hasil[i], hasil[j]] =
            [hasil[j], hasil[i]];
    }

    return hasil.slice(0, limit);

};


// =========================================
// Mengambil Brain Teaser
// =========================================
export const getBrainTeaserById = async (id) => {

    const rawData = await fs.readFile(
        BRAIN_TEASER_PATH,
        "utf-8"
    );

    const database = JSON.parse(rawData);

    return database.find(item => item.id === id);

};