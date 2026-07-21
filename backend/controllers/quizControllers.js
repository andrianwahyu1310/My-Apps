import {
    getQuizQuestions,
    getBrainTeaserById
} from "../services/quizServices.js";


// =========================================
// GET QUIZ QUESTIONS
// =========================================
export const quizQuestions = async (req, res) => {

    try {

        const {
            mapel,
            kesulitan,
            limit
        } = req.query;

        if (!mapel || !kesulitan) {

            return res.status(400).json({

                success: false,

                message:
                    "Parameter mapel dan kesulitan wajib diisi!"

            });

        }

        const soal =
            await getQuizQuestions(
                mapel,
                kesulitan,
                parseInt(limit) || 5
            );

        if (soal.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Paket soal belum tersedia."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Paket soal berhasil dimuat.",

            data: soal

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Terjadi kesalahan server."

        });

    }

};


// =========================================
// GET BRAIN TEASER
// =========================================
export const brainTeaser = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const data =
            await getBrainTeaserById(id);

        if (!data) {

            return res.status(404).json({

                success: false,

                message:
                    "Permainan tidak ditemukan."

            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Data permainan berhasil dimuat.",

            data

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message:
                "Terjadi kesalahan server."

        });

    }

};