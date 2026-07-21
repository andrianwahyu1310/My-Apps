import { findUserById } from "../services/userServices.js";

export const detail = async (req, res) => {
    try {

        const user = await findUserById(req.session.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Data akun tidak ditemukan."
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                theme: user.theme,
                status: user.status,
                createdAt: user.createdAt
            }
        });

    } catch (err) {

        console.error("DETAIL ERROR:", err);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server."
        });

    }
};