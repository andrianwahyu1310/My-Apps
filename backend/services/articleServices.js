import fs from "fs/promises";
import path from "path";
import { DATA_NEWS_PATH } from "../config/path.js";

// =========================================================
// 1. MENGAMBIL ARTIKEL PER KATEGORI (FILE TERPISAH + PAGINATION)
// =========================================================
/**
 * @param {string} kategori - ID Kategori (contoh: 'olahraga', 'bisnis')
 * @param {number} page - Halaman ke-berapa (default: 1)
 * @param {number} limit - Jumlah artikel per halaman (default: 12)
 */
export const getArticlesByCategory = async (kategori, page = 1, limit = 12) => {
    try {
        const idClean = kategori.trim().toLowerCase();
        
        // Membaca file spesifik di folder data/articles/ (contoh: data/articles/bisnis.json)
        const filePath = path.join(DATA_NEWS_PATH, `${idClean}.json`);

        // Cek keberadaan file
        await fs.access(filePath);
        const rawData = await fs.readFile(filePath, "utf-8");

        const allCategoryArticles = rawData.trim() ? JSON.parse(rawData) : [];

        // Hitung Matematika Offset Pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 12);

        const totalArticles = allCategoryArticles.length;
        const totalPages = Math.ceil(totalArticles / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;

        // Potong array sesuai batch halaman yang diminta
        const paginatedArticles = allCategoryArticles.slice(startIndex, endIndex);

        // --- ALGORITMA SHUFFLE FISHER-YATES (Acak khusus batch yang diambil) ---
        const shuffledBatch = [...paginatedArticles];
        for (let i = shuffledBatch.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledBatch[i], shuffledBatch[j]] = [shuffledBatch[j], shuffledBatch[i]];
        }

        return {
            articles: shuffledBatch,
            pagination: {
                currentPage: pageNum,
                limit: limitNum,
                totalArticles,
                totalPages,
                hasMore: pageNum < totalPages
            }
        };

    } catch (error) {
        // Jika file JSON kategori belum dibuat atau tidak ditemukan
        console.warn(`[ARTICLE WARNING] File data untuk kategori '${kategori}' tidak ditemukan/rusak:`, error.message);
        return {
            articles: [],
            pagination: {
                currentPage: 1,
                limit,
                totalArticles: 0,
                totalPages: 0,
                hasMore: false
            }
        };
    }
};

// =========================================================
// 2. MENGAMBIL SELURUH KATEGORI MASTER
// =========================================================
export const getAllCategories = () => {
    return [
        { id: "olahraga", nama: "Olahraga", gambar: "olahraga.webp" },
        { id: "teknologi", nama: "Teknologi", gambar: "teknologi.webp" },
        { id: "hiburan", nama: "Hiburan", gambar: "hiburan.webp" },
        { id: "politik", nama: "Politik", gambar: "politik.webp" },
        { id: "bisnis", nama: "Bisnis", gambar: "bisnis.webp" }
    ];
};