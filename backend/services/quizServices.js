import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { BRAIN_TEASER_PATH } from "../config/path.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Map untuk menyimpan Cache per Mapel di RAM (misal: 'umum' -> data JSON)
const mapelCache = new Map();
let brainTeaserCache = null;

/**
 * Helper untuk membaca file JSON per mapel secara dinamis
 */
const getMapelData = async (mapel) => {
  const mapelKey = mapel.toLowerCase();

  // Jika data mapel sudah ada di RAM Cache, langsung kembalikan
  if (mapelCache.has(mapelKey)) {
    return mapelCache.get(mapelKey);
  }

  // Tentukan path file secara dinamis: src/data/questions/<mapel>.json
  const mapelPath = path.join(__dirname, `../data/questions/${mapelKey}.json`);

  try {
    const rawData = await fs.readFile(mapelPath, "utf-8");
    const parsedData = JSON.parse(rawData);

    // Simpan ke Cache agar request berikutnya tidak membaca disk lagi
    mapelCache.set(mapelKey, parsedData);
    return parsedData;
  } catch (error) {
    // Jika file mapel.json tidak ditemukan / error
    console.error(`File soal untuk mapel '${mapelKey}' tidak ditemukan:`, error.message);
    return null;
  }
};

/**
 * Helper untuk membaca Brain Teaser
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
    const database = await getMapelData(mapel);

    if (!database) {
      return []; // Mengembalikan array kosong jika file mapel tidak ada
    }

    // Akses array soal berdasarkan tingkat kesulitan
    const soal = database[kesulitan.toLowerCase()] || [];

    if (soal.length === 0) {
      return [];
    }

    // Clone array agar tidak merusak data asli di cache saat diacak
    const hasil = [...soal];

    // Algoritma Fisher-Yates Shuffle
    for (let i = hasil.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
    }

    return hasil.slice(0, limit);
  } catch (error) {
    console.error("Gagal memproses quiz questions:", error);
    return [];
  }
};

// =========================================
// Mengambil Brain Teaser
// =========================================
export const getBrainTeaserById = async (id) => {
  try {
    const database = await getBrainTeaserData();
    return database.find((item) => Number(item.id) === Number(id)) || null;
  } catch (error) {
    console.error("Gagal membaca file brain teaser:", error);
    return null;
  }
};