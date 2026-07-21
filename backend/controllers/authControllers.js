import bcrypt from "bcrypt";
import {
    isValidUsername,
    isValidPassword
} from "../utils/validator.js";
import {
    findUserByUsername,
    createUser,
    updateUserTheme,
    findUserById
} from "../services/userServices.js";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username dan password wajib diisi!' });
        }

        if (!isValidUsername(username)) {
            return res.status(400).json({ success: false, message: 'Username tidak valid!' });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ success: false, message: 'Password tidak valid!' });
        }

        const userExists = await findUserByUsername(username);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username sudah ada!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(username, hashedPassword);

        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        req.session.user = user.username;

        req.session.save((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Gagal menyimpan session."
                });
            }

            res.json({
                success: true,
                message: "Register berhasil!"
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const login =  async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validasi input kosong
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username dan password wajib diisi!'
            });
        }

        // Validasi format
        if (!isValidUsername(username)) {
            return res.status(400).json({
                success: false,
                message: 'Format username tidak valid!'
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Format password tidak valid!'
            });
        }

        // Cari user di MongoDB
        const userFound = await findUserByUsername(username);

        if (!userFound) {
            return res.status(401).json({
                success: false,
                message: 'Username tidak ditemukan!'
            });
        }

        // Cocokkan password
        const passwordMatch = await bcrypt.compare(
            password,
            userFound.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Password salah!'
            });
        }

        // Simpan session
        req.session.isLoggedIn = true;
        req.session.user = userFound.username;
        req.session.userId = userFound._id.toString();

        req.session.save((err) => {
            if (err) {
                console.error("❌ Gagal menyimpan session:", err);

                return res.status(500).json({
                    success: false,
                    message: "Gagal memproses sesi login."
                });
            }

            console.log(`✅ ${userFound.username} berhasil login.`);

            return res.status(200).json({
                success: true,
                message: "Login berhasil!",
                user: {
                    id: userFound._id,
                    username: userFound.username,
                    theme: userFound.theme,
                    status: userFound.status
                }
            });
        });

    } catch (err) {
        console.error("❌ LOGIN ERROR");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server."
        });
    }
};

export const authCheck = async (req, res) => {
    try {
        if (!req.session?.isLoggedIn || !req.session?.userId) {
            return res.status(200).json({
                success: false,
                loggedIn: false,
                message: "Sesi tidak aktif."
            });
        }

        const user = await findUserById(req.session.userId);

        if (!user) {
            req.session.destroy(() => {});

            return res.status(200).json({
                success: false,
                loggedIn: false,
                message: "Akun tidak ditemukan."
            });
        }

        return res.status(200).json({
            success: true,
            loggedIn: true,
            user: {
                id: user._id,
                username: user.username,
                theme: user.theme,
                status: user.status
            }
        });

    } catch (err) {
        console.error("AUTH CHECK ERROR:", err);

        return res.status(500).json({
            success: false,
            loggedIn: false,
            message: "Terjadi kesalahan pada server."
        });
    }
};

export const logout = (req, res) => {

    if (!req.session) {
        return res.status(200).json({
            success: true,
            message: "Session sudah berakhir."
        });
    }

    req.session.destroy((err) => {

        if (err) {
            console.error("LOGOUT ERROR:", err);

            return res.status(500).json({
                success: false,
                message: "Gagal melakukan logout."
            });
        }

        res.clearCookie("connect.sid");

        return res.status(200).json({
            success: true,
            message: "Logout berhasil."
        });
    });
};

export const setTheme = async (req, res) => {
    try {
        const { theme } = req.body;
        const currentUsername = req.session.user;

        if (!theme) {
            return res.status(400).json({ success: false, message: "Tema tidak boleh kosong." });
        }

        const updatedUser = await updateUserTheme(currentUsername, theme);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User tidak ditemukan." });
        }

        return res.json({ success: true, message: `Tema berhasil diperbarui ke ${theme} di server.` });
    } catch (error) {
        console.error("Gagal menyimpan tema di server:", error);
        res.status(500).json({ success: false, message: "Kesalahan server internal." });
    }
};

export const getSetTheme = async (req, res) => {
    try {
        const userFound = await findUserByUsername(req.session.user);
        const userTheme = userFound?.theme || 'dark';
        res.json({ success: true, theme: userTheme });
    } catch (error) {
        console.error('Gagal mengambil tema user:', error);
        res.status(500).json({ success: false, theme: 'dark' });
    }
};