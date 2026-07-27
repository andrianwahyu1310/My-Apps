import fs from "fs/promises";
import { QUIZ_PATH, BRAIN_TEASER_PATH } from "../config/path.js";

// Variable Cache untuk menyimpan data di RAM server
let quizCache = null;
let brainTeaserCache = null;

/**
 * Helper untuk membaca file Quiz JSON dengan Caching
 */
const getQuizData = async () => {
  if (!quizCache) {
    const rawData = await fs.readFile(QUIZ_PATH, "utf-8");
    quizCache = JSON.parse(rawData);
  }
  return quizCache;
};

/**
 * Helper untuk membaca file Brain Teaser JSON dengan Caching
 */
const getBrainTeaserData = async () => {
  if (!brainTeaserCache) {
    const rawData = await fs.readFile(BRAIN_TEASER_PATH, "utf-8");
    brainTeaserCache = JSON.parse(rawData);
  }
  return brainTeaserCache;
};

// =========================================
// Mengambil Soal Quiz
// =========================================
export const getQuizQuestions = async (
  mapel,
  kesulitan,
  limit = 5
) => {
  try {
    const database = await getQuizData();

    // Akses property mapel dan kesulitan secara safe
    const soal =
      database[mapel.toLowerCase()]?.[kesulitan.toLowerCase()] || [];

    if (soal.length === 0) {
      return [];
    }

    // Clone array agar tidak mengubah data asli di cache
    const hasil = [...soal];

    // Algoritma Fisher-Yates Shuffle untuk mengacak soal
    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }

    return hasil.slice(0, limit);
  } catch (error) {
    console.error("Gagal membaca file quiz questions:", error);
    return [];
  }
};

// =========================================
// Mengambil Brain Teaser
// =========================================
export const getBrainTeaserById = async (id) => {
  try {
    const database = await getBrainTeaserData();
    
    // Memastikan pencocokan ID aman (terkadang req.params bertipe String)
    return database.find((item) => Number(item.id) === Number(id)) || null;
  } catch (error) {
    console.error("Gagal membaca file brain teaser:", error);
    return null;
  }
};