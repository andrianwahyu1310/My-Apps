import {
    getArticlesByCategory,
    getAllCategories
} from "../services/articleServices.js";

// ===================================================
// Mengambil artikel berdasarkan kategori
// ===================================================
export const getArticleByCategory = async (req, res) => {

    try {

        const { namaKategori } = req.params;

        if (!namaKategori) {
            return res.status(400).json({
                success: false,
                message: "Parameter kategori tidak boleh kosong."
            });
        }

        console.log(
            `[ARTICLE] Memuat kategori: ${namaKategori}`
        );

        const articles =
            await getArticlesByCategory(namaKategori);

        console.log(
            `[ARTICLE] Ditemukan ${articles.length} artikel`
        );

        return res.status(200).json({

            success: true,

            namaKategori,

            articles

        });

    } catch (err) {

        console.error("ARTICLE ERROR:", err);

        return res.status(500).json({

            success: false,

            message:
                "Terjadi gangguan sistem internal saat memproses artikel."

        });

    }

};

// ===================================================
// Mengambil daftar kategori
// ===================================================
export const getCategories = (req, res) => {

    try {

        const categories = getAllCategories();

        return res.status(200).json(categories);

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Gagal memuat kategori."

        });

    }

};