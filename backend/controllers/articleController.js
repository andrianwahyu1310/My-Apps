import {
    getArticlesByCategory,
    getAllCategories
} from "../services/articleServices.js";

// ===================================================
// Mengambil artikel berdasarkan kategori (Dengan Pagination)
// ===================================================
export const getArticleByCategory = async (req, res) => {
    try {
        const { namaKategori } = req.params;

        // Ambil query parameter `page` dan `limit` dari URL (misal: /api/artikel/olahraga?page=1&limit=12)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;

        if (!namaKategori) {
            return res.status(400).json({
                success: false,
                message: "Parameter kategori tidak boleh kosong."
            });
        }

        console.log(
            `[ARTICLE] Memuat kategori: ${namaKategori} (Halaman: ${page}, Limit: ${limit})`
        );

        // Panggil service dengan parameter pagination
        const result = await getArticlesByCategory(namaKategori, page, limit);

        // Cari detail nama kategori asli jika diperlukan untuk UI
        const categories = getAllCategories();
        const categoryDetail = categories.find(
            (c) => c.id.toLowerCase() === namaKategori.toLowerCase()
        );

        console.log(
            `[ARTICLE] Mengembalikan ${result.articles.length} artikel dari total ${result.pagination.totalArticles}`
        );

        return res.status(200).json({
            success: true,
            namaKategori: categoryDetail ? categoryDetail.nama : namaKategori,
            articles: result.articles,
            pagination: result.pagination
        });

    } catch (err) {
        console.error("ARTICLE ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Terjadi gangguan sistem internal saat memproses artikel."
        });
    }
};

// ===================================================
// Mengambil daftar kategori
// ===================================================
export const getCategories = (req, res) => {
    try {
        const categories = getAllCategories();

        return res.status(200).json({
            success: true,
            data: categories
        });

    } catch (err) {
        console.error("CATEGORY ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Gagal memuat kategori."
        });
    }
};