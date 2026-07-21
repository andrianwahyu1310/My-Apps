import { sendReportEmail } from "../services/contactServices.js";

export const report = async (req, res) => {

    try {

        const {
            username,
            subject,
            message,
            sendVia
        } = req.body;

        await sendReportEmail({

            username,

            subject,

            message,

            sendVia,

            file: req.file

        });

        return res.status(200).json({

            success: true,

            message:
                "Laporan berhasil dikirim ke email pengembang."

        });

    }

    catch (err) {

        console.error("REPORT ERROR:", err);

        return res.status(500).json({

            success: false,

            message:
                "Terjadi kesalahan saat mengirim laporan."

        });

    }

};