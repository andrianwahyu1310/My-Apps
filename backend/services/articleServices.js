import fs from "fs/promises";
import { DATA_NEWS_PATH } from "../config/path.js";

// ===============================
// Mengambil artikel berdasarkan kategori
// ===============================
export const getArticlesByCategory = async (kategori) => {

    await fs.access(DATA_NEWS_PATH);

    const rawData = await fs.readFile(DATA_NEWS_PATH, "utf-8");

    if (!rawData.trim()) {
        return [];
    }

    const articles = JSON.parse(rawData);

    return articles.filter(article =>

        article.kategori &&
        article.kategori.trim().toLowerCase() ===
        kategori.trim().toLowerCase()

    );
};

// ===============================
// Mengambil seluruh kategori
// ===============================
export const getAllCategories = () => {

    return [
        {
            id: "olahraga",
            nama: "Olahraga",
            gambar: "olahraga.webp"
        },
        {
            id: "teknologi",
            nama: "Teknologi",
            gambar: "teknologi.webp"
        },
        {
            id: "hiburan",
            nama: "Hiburan",
            gambar: "hiburan.webp"
        },
        {
            id: "politik",
            nama: "Politik",
            gambar: "politik.webp"
        },
        {
            id: "bisnis",
            nama: "Bisnis",
            gambar: "bisnis.webp"
        }
    ];

};