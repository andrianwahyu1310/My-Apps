import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import session from 'express-session';
import fs from 'fs/promises'; 
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import cors from 'cors'; 
import multer from 'multer';
import nodemailer from 'nodemailer';
import { isValidUsername, isValidPassword } from './utils/validator';

const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USER_FILE = path.join(__dirname, 'data', 'users.json');
const DATA_NEWS_PATH = path.join(__dirname, 'data', 'article.json');

// ⁡⁣⁣⁢--- 𝗠𝗜𝗗𝗗𝗟𝗘𝗪𝗔𝗥𝗘 𝗖𝗢𝗥𝗦 ---⁡
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(session({
    secret: process.env.TOKEN_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        httpOnly: true,
        maxAge: 3600000
    }
}));

// ⁡⁣⁣⁢--- 𝗠𝗜𝗗𝗗𝗟𝗘𝗪𝗔𝗥𝗘 𝗣𝗘𝗥𝗧𝗔𝗛𝗔𝗡𝗔𝗡 𝗔𝗣𝗜 ---⁡
const protectAPI = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.status(401).json({ success: false, message: 'Akses ditolak, silakan login terlebih dahulu!' });
};

// ⁡⁢⁣⁣𝗛𝗲𝗹𝗽𝗲𝗿 𝗶𝗻𝘁𝗲𝗿𝗻𝗮𝗹 𝗽𝗲𝗺𝗯𝗮𝗰𝗮 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲 𝗝𝗦𝗢𝗡⁡
const getUsers = async () => {
    try {
        const data = await fs.readFile(USER_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveUsers = async (data) => {
    await fs.writeFile(USER_FILE, JSON.stringify(data, null, 2));
};

// Menyimpan gambar di memori buffer sementara agar bisa langsung dikirim ke email tanpa mengotori penyimpanan server
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Membatasi ukuran gambar maksimal 5MB demi keadilan server
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Backend berjalan normal.' });
});

// =========================================================================
// ✉️ CONFIGURATION NODEMAILER (GERBANG PENGIRIMAN EMAIL)
// =========================================================================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =========================================================================
//  ⁡⁣⁣⁢𝗘𝗡𝗗𝗣𝗢𝗜𝗡𝗧 𝗔𝗥𝗦𝗜𝗣 𝗔𝗥𝗧𝗜𝗞𝗘𝗟 𝗕𝗘𝗥𝗗𝗔𝗦𝗔𝗥𝗞𝗔𝗡 𝗞𝗔𝗧𝗘𝗚𝗢𝗥𝗜 (𝗙𝗜𝗫𝗘𝗗 & 𝗦𝗘𝗖𝗨𝗥𝗘)⁡
// =========================================================================
app.get('/api/artikel/:namaKategori', async (req, res) => {
    try {
        if (!req.params.namaKategori) {
            return res.status(400).json({
                success: false,
                message: "Parameter kategori tidak boleh kosong."
            });
        }

        const kategoriDilewati = req.params.namaKategori.toLowerCase();

        // ⁡⁢⁣⁢Validasi keberadaan berkas secara asinkron⁡
        try {
            await fs.access(DATA_NEWS_PATH);
        } catch (err) {
            console.error(`[ERROR] File database tidak ditemukan di path absolut: ${DATA_NEWS_PATH}`);
            return res.status(404).json({
                success: false,
                message: "Database arsip berita tidak ditemukan di server."
            });
        }

        // ⁡⁢⁣⁢Membaca file secara asinkron⁡
        const rawData = await fs.readFile(DATA_NEWS_PATH, 'utf-8');
        
        if (!rawData.trim()) {
            return res.status(200).json({
                success: true,
                namaKategori: req.params.namaKategori,
                articles: []
            });
        }

        const databaseBerita = JSON.parse(rawData);

        // ⁡⁢⁣⁣Debugging akan tercetak di terminal⁡
        console.log(`\n[DEBUG ACCESSED] Parameter URL dicari: "${req.params.namaKategori}"`);
        console.log(`[DEBUG ACCESSED] Jumlah total data mentah di JSON: ${databaseBerita.length} artikel.`);

        // ⁡⁢⁣⁢FILTER DATA BERDASARKAN KATEGORI⁡
        const hasilFilterBerita = databaseBerita.filter(artikel => {
            if (!artikel.kategori) return false;
            return artikel.kategori.trim().toLowerCase() === kategoriDilewati.trim();
        });

        console.log(`[DEBUG ACCESSED] Hasil setelah difilter: ${hasilFilterBerita.length} artikel.\n`);

        res.status(200).json({
            success: true,
            namaKategori: req.params.namaKategori, 
            articles: hasilFilterBerita
        });

    } catch (error) {
        console.error("Kesalahan Server Internal:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi gangguan sistem internal saat memproses data kategori."
        });
    }
});

// =========================================================================
//  ⁡⁣⁣⁢⁡⁣⁣⁢𝗘𝗡𝗗𝗣𝗢𝗜𝗡𝗧 TEMA BERDASARKAN PILIHAN USER⁡
// =========================================================================
// ⁡⁢⁣⁣1. Endpoint untuk menyimpan tema pilihan user yang sedang login⁡
app.post('/api/user/setTheme', protectAPI, async (req, res) => {
    try {
        const { theme } = req.body;
        const currentUsername = req.session.user;

        if (!theme) {
            return res.status(400).json({ success: false, message: "Tema tidak boleh kosong." });
        }

        const users = await getUsers();
        const userIndex = users.findIndex(u => u.username === currentUsername);

        if (userIndex !== -1) {
            users[userIndex].theme = theme;
            await saveUsers(users);
            return res.json({ success: true, message: `Tema berhasil diperbarui ke ${theme} di server.` });
        }

        res.status(404).json({ success: false, message: "User tidak ditemukan." });
    } catch (error) {
        console.error("Gagal menyimpan tema di server:", error);
        res.status(500).json({ success: false, message: "Kesalahan server internal." });
    }
});

// ⁡⁢⁣⁣2. Endpoint untuk mengambil tema saat user berhasil login (bisa dipanggil di auth-check)⁡
app.get('/api/user/setTheme', protectAPI, async (req, res) => {
    try {
        const users = await getUsers();
        const userFound = users.find(u => u.username === req.session.user);
        
        // ⁡⁢⁣⁢Kembalikan tema yang tersimpan, jika belum ada default ke 'dark'⁡
        const userTheme = userFound?.theme || 'dark';
        res.json({ success: true, theme: userTheme });
    } catch (error) {
        res.status(500).json({ success: false, theme: 'dark' });
    }
});

app.get('/api/quiz-questions', protectAPI, async (req, res) => {
    try {
        // 1. Tangkap parameter kueri dari frontend
        const { mapel, kesulitan, limit } = req.query;
        const jumlahLimit = parseInt(limit) || 5;

        // Validasi input awal demi keadilan sistem
        if (!mapel || !kesulitan) {
            return res.status(400).json({ success: false, message: "Parameter mapel dan kesulitan wajib diisi!" });
        }

        // 2. Baca basis data JSON dari folder internal backend
        const pathBerkas = path.join(__dirname, 'data', 'quizQuestions.json');
        const rawData = await fs.readFile(pathBerkas, 'utf-8');
        const databaseKuis = JSON.parse(rawData);

        // 3. Ambil paket soal berdasarkan kategori target
        const soalMentah = databaseKuis[mapel.toLowerCase()]?.[kesulitan.toLowerCase()] || [];

        if (soalMentah.length === 0) {
            return res.status(444).json({ success: false, message: "Paket soal belum tersedia di server!" });
        }

        // 4. 🛡️ Taktik Fisher-Yates Shuffle di sisi Server (Aman dari manipulasi client)
        const soalDiacak = [...soalMentah];
        for (let i = soalDiacak.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [soalDiacak[i], soalDiacak[j]] = [soalDiacak[j], soalDiacak[i]];
        }

        // 5. Potong sesuai jumlah limit permintaan user
        const soalFinal = soalDiacak.slice(0, jumlahLimit);

        // 6. Kirimkan paket data rahasia ke frontend secara aman
        res.status(200).json({
            success: true,
            message: "Paket soal berhasil dienkripsi dan dikirim.",
            data: soalFinal
        });

    } catch (error) {
        console.error("🚨 Galat Fase 2 Kuis Backend:", error.message);
        res.status(500).json({ success: false, message: "Terjadi sengketa internal server saat memuat soal." });
    }
});

// =========================================================================
// ⁡⁣⁣⁢ENDPOINT AUTENTIKASI (API REGISTRASI & LOGIN)⁡
// =========================================================================
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const userExists = users.find(u => u.username === username);

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Username sudah ada!' });
        }

        if (!isValidUsername(username)) {
            return res.status(400).json({ success: false, message: 'Username tidak valid!' });
        }

        if (!isValidPassword(password)) {
            return res.status(401).json({ success: false, message: 'Format password salah!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ username, password: hashedPassword });
        await saveUsers(users);

        req.session.isLoggedIn = true;
        req.session.user = username;
        res.json({ success: true, message: 'Register berhasil!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal register sistem internal' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const userFound = users.find(u => u.username === username);

        if (!isValidUsername(username) || !isValidPassword(password)) {
            return res.status(400).json({ success: false, message: 'Format username atau password salah!' });
        }

        if (!userFound) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan!' });
        }

        const passwordMatch = await bcrypt.compare(password, userFound.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Password salah!' });
        }

        req.session.isLoggedIn = true;
        req.session.user = username;
        req.session.save((err) => {
            if (err) {
                console.error("Gagal menyimpan session:", err);
                return res.status(500).json({ success: false, message: 'Gagal memproses sesi login' });
            }
            return res.json({ success: true, message: 'Login berhasil!', user: username });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal login sistem internal' });
    }
});

app.get('/api/auth-check', (req, res) => {
    // Jika tidak login, kembalikan status 200 dengan flag loggedIn false agar konsol browser tetap bersih
    if (!req.session || !req.session.isLoggedIn) {
        return res.status(200).json({ 
            success: false, 
            loggedIn: false, 
            message: "Sesi tidak aktif, Senpai." 
        });
    }
    
    // Jika berhasil
    res.status(200).json({ 
        success: true, 
        loggedIn: true, 
        user: req.session.user 
    });
});

app.get('/api/logout', (req, res) => {
    res.clearCookie('connect.sid'); 
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Gagal melakukan logout." });
        }
        res.json({ success: true, message: "Logout sukses." });
    });
});

// =========================================================================
// 👤 API MENGAMBIL DETAIL AKUN SPESIFIK (TERPROTEKSI)
// =========================================================================
app.get('/api/detail', protectAPI, async (req, res) => {
    try {
        // 1. Ambil username dari sesi user yang sedang aktif di server
        const usernameAktif = req.session.user;

        // 2. Baca database berkas users.json
        const users = await getUsers();

        // 3. Cari data user yang spesifik berdasarkan nama penggunanya
        const userTerpilih = users.find(u => u.username === usernameAktif);

        if (!userTerpilih) {
            return res.status(404).json({ 
                success: false, 
                message: "Data akun tidak ditemukan dalam sistem, Senpai." 
            });
        }

        // 4. Kirimkan data spesifik tersebut ke frontend (Kecuali Password demi keamanan!)
        res.status(200).json({
            success: true,
            username: userTerpilih.username,
            statusAkses: userTerpilih.status || "Anggota Aktif", // Default jika belum ada properti status
            dedikasi: "Terproteksi oleh Fitur Keamanan Keadilan Tingkat Tinggi."
        });

    } catch (error) {
        console.error("Gagal memproses data detail akun:", error);
        res.status(500).json({ 
            success: false, 
            message: "Gagal memproses data detail akun di server." 
        });
    }
});

// =========================================================================
// 🚀 API ROUTE: KIRIM LAPORAN PENGADUAN VIA EMAIL + ATTACHMENT GAMBAR
// =========================================================================
app.post('/api/contact/report', protectAPI, upload.single('screenshot'), async (req, res) => {
    try {
        const { username, subject, message, sendVia } = req.body;
        const fileGambar = req.file;

        const mapSubjek = {
            bug: "🐛 Laporan Masalah Sistem (Bug)",
            buku: "💡 Usulan Fitur Baru",
            akun: "🔐 Kendala Akun & Keanggotaan",
            lainnya: "📁 Lainnya"
        };
        const namaKategori = mapSubjek[subject] || subject;

        console.log(`[REPORT] Menerima pengaduan baru dari: ${username} via ${sendVia}`);

        // Konfigurasi Konten Email
       const mailOptions = {
            from: `"Sistem Pengaduan (${username})" <kolen.icikiwir1310@gmail.com>`, 
            to: 'kolen.icikiwir1310@gmail.com', 
            
            subject: `[${sendVia.toUpperCase()}] ${namaKategori} - Dari ${username}`,
            text: `PENGADUAN LAYANAN SISTEM\n\n` +
                `Nama Pengguna: ${username}\n` +
                `Kategori: ${namaKategori}\n` +
                `Metode Kirim: ${sendVia}\n\n` +
                `Isi Detail Kendala:\n${message}\n\n` +
                `-----------------------------------------\n` +
                `Laporan dikirim otomatis oleh sistem SPA.`,
            attachments: fileGambar ? [{
                filename: fileGambar.originalname,
                content: fileGambar.buffer
            }] : []
        };

        // Eksekusi pengiriman email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: "Laporan berhasil dikirim ke email pengembang!" 
        });

    } catch (error) {
        console.error("Gagal mengirim laporan email:", error);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi sengketa internal di server saat mengirim email." 
        });
    }
});

app.get('/api/categories', (req, res) => {
    const daftarKategori = [
        { id: 'olahraga', nama: 'Olahraga', gambar: 'olahraga.webp' },
        { id: 'teknologi', nama: 'Teknologi', gambar: 'teknologi.webp' },
        { id: 'hiburan', nama: 'Hiburan', gambar: 'hiburan.webp' },
        { id: 'politik', nama: 'Politik', gambar: 'politik.webp' },
        { id: 'bisnis', nama: 'Bisnis', gambar: 'bisnis.webp' }
    ];
    res.json(daftarKategori);
});

app.get('/api/tools', async (req, res) => {
    try {
        const pathBerkas = path.join(__dirname, 'data', 'tools.json');
        const rawData = await fs.readFile(pathBerkas, 'utf-8');
        res.json(JSON.parse(rawData));
    } catch (error) {
        console.error("Sengketa Menu Tools:", error.message);
        res.status(500).json({ success: false, message: "Gagal memuat daftar peralatan hitung." });
    }
});

app.get('/api/mainTools/:id', protectAPI, async (req, res) => {
    try {
        const idTarget = parseInt(req.params.id);
        const pathBerkas = path.join(__dirname, 'data', 'tools.json');
        const rawData = await fs.readFile(pathBerkas, 'utf-8');
        const allTools = JSON.parse(rawData);
        
        const toolTerpilih = allTools.find(t => t.id === idTarget);
        if (!toolTerpilih) return res.status(404).json({ success: false, message: "Alat hitung tidak terdaftar!" });
        
        res.json(toolTerpilih);
    } catch (error) {
        res.status(500).json({ success: false, message: "Gagal memproses data alat." });
    }
});

app.get('/api/container-brain-teaser/:id', protectAPI, async (req, res) => {
    try {
        const idTarget = parseInt(req.params.id);
        
        // 1. Membuka jalur berkas database JSON secara presisi
        const pathBerkas = path.join(__dirname, 'data', 'brainTeaser.json');
        const rawData = await fs.readFile(pathBerkas, 'utf-8');
        const allBrain = JSON.parse(rawData);
        
        // 2. Pencarian data spesifik berdasarkan target ID
        const brainTerpilih = allBrain.find(t => t.id === idTarget);
        
        // 3. Gerbang Proteksi: Jika ID game tidak terdaftar di database
        if (!brainTerpilih) {
            return res.status(404).json({ 
                success: false, 
                message: "Permainan asah otak tidak terdaftar di sistem!" 
            });
        }
        
        // 4. Mengembalikan respons sukses dengan struktur bungkus yang adil dan seragam
        res.status(200).json({
            success: true,
            message: "Data permainan berhasil dimuat.",
            data: brainTerpilih
        });

    } catch (error) {
        console.error("🚨 Galat internal pada rute kuis:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi sengketa internal server saat memproses data permainan." 
        });
    }
});

app.use('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint API tidak ditemukan!' });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});