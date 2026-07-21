import transporter from "../config/mailer.js";

export const sendReportEmail = async ({
    username,
    subject,
    message,
    sendVia,
    file
}) => {

    const mapSubjek = {
        bug: "🐛 Laporan Masalah Sistem (Bug)",
        buku: "💡 Usulan Fitur Baru",
        akun: "🔐 Kendala Akun & Keanggotaan",
        lainnya: "📁 Lainnya"
    };

    const namaKategori =
        mapSubjek[subject] || subject;

    console.log(
        `[REPORT] ${username} mengirim laporan melalui ${sendVia}`
    );

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("[REPORT] Email belum dikonfigurasi, laporan hanya dicatat di server.");
        return;
    }

    const mailOptions = {

        from: `"Sistem Pengaduan (${username})" <${process.env.EMAIL_USER}>`,

        to: process.env.EMAIL_USER,

        subject:
            `[${sendVia.toUpperCase()}] ${namaKategori} - Dari ${username}`,

        text:
`PENGADUAN LAYANAN SISTEM

Nama Pengguna : ${username}
Kategori       : ${namaKategori}
Metode Kirim   : ${sendVia}

Isi Laporan :

${message}

----------------------------------------
Laporan dikirim otomatis oleh sistem.`,

        attachments: file
            ? [
                {
                    filename: file.originalname,
                    content: file.buffer
                }
            ]
            : []

    };

    await transporter.sendMail(mailOptions);

};