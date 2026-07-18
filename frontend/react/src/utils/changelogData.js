// frontend/src/data/changelogData.js

export const databaseChangelog = {
    'v2.2': {
        tanggal: '20 Juli 2026',
        updates: [
            'Memindahkan basis data kuis dari file database lokal frontend ke lingkungan internal server backend',
            'Meningkatkan keamanan data secara mutlak (Anti-Curang); kunci jawaban dan kumpulan soal tidak bisa lagi diintip oleh pengguna lewat fitur Inspect Element atau tab Network browser.',
            'Proses pengacakan dan pemotongan jumlah soal kini diproses secara adil.',
            'Sistem Keamanan Lintas Port (Cross-Origin Session Tracking)'
        ],
        fixes: [
            'Memasang status pengunci state (Click Lock Guard) untuk membekukan fungsi klik segera setelah opsi pertama dipilih hingga soal berikutnya berhasil termuat sempurna.',
            'Melenyapkan seluruh fungsi event dan memindahkan kontrol visual sepenuhnya ke CSS murni',
            'Menghubungkan jembatan komunikasi antar port secara presisi menggunakan jalur pemanggilan URL absolut'
        ]
    },
    'v2.0': {
        tanggal: '8 Juli 2026',
        updates: [
            'Menambahkan menu permainan (Asah Otak)',
            'Menambahkan alat konversi baru',
            'Menambahkan glosarium pada alat konversi',
            'Pada alat konversi, kini bisa mengitung otomatis'
        ],
        fixes: [
            'Penanganan Kegagalan Ambil Data Spesifik Alat (Dynamic ID Routing Fix):',
            'Arsitektur Pembacaan Berkas Asinkron Menu Tools'
        ]
    },
    'v1.2.5': {
        tanggal: '8 Juni 2026',
        updates: [
            'Menambahkan beberapa qoute baru.',
            'Menambahkan pesan peringatan pada halaman login dan registrasi',
            'Menambahkan warna border atas pada content display sesuai dengan tab yang dipilih (hijau untuk updates, merah untuk fixes).',
            'Menambahkan card untuk berita',
            'Menambahkan tools dan beberapa alat konversi',
            'Menambahkan deskripsi penjelasan pada tools'
        ],
        fixes: [
            'Perbaikan tampilan pada layar kecil.',
            "Menghapus cursor saat kalimat sapaan telah selesai di proses",
            'Memperbaiki fitur pilih wilayah pada widget cuaca. Sekarang wilayah yang terplih akan tersimpan',
            "Menyesuaikan tampilan widget cuaca dan changelog",
            'Memperbaiki tool konversi kurs dengan masalah urutan pemuatan dan sinskronisasi fungsi',
            'Memperbarui tampilan (layout) serta pembacaan latex'
        ]
    },
    'v1.2.0': {
        tanggal: '7 Juni 2026',
        updates: [
            'Sistem tema permanen via localStorage.',
            'Widget Kutipan Motivasi interaktif berganti otomatis tiap 5 detik.',
            'Widget Cuaca Dinamis.',
        ],
        fixes: [
            'Perbaikan status Guest setelah refresh.',
            'Perbaikan flash putih saat ganti tema.',
            'Perbaikan dropdown.',
        ]
    },
    'v1.1.0': {
        tanggal: '28 Mei 2026',
        updates: [
            'Integrasi Express + EJS.',
            'Sidebar dan Navbar.',
            'Session Login.'
        ],
        fixes: [
            'Perbaikan 404.',
            'Perbaikan path CSS.'
        ]
    },
    'v1.0.0': {
        tanggal: '15 Mei 2026',
        updates: [
            'Inisialisasi proyek.',
            'Konfigurasi Express.',
            'Pembuatan halaman Dashboard statis.',
            'Pembuatan halaman Login dan Register statis.',
            'Pembuatan halaman About, Contact, dan Detail statis.',
            'Pembuatan halaman 404 dan 500 statis.',
            'Pembuatan halaman 404 dan 500 statis.',
            'Pemambahkan middleware proteksi URL.',
            'Implementasi session untuk login.',
            'Implementasi fitur login dan register sederhana.',
            'Implementasi fitur logout.',
        ],
        fixes: [
            'Memperbaiki bug pada halaman login dan register yang tidak bisa submit dengan tombol enter.',
            'Memperbaiki bug pada halaman login dan dashboard yang tetap menampilkan username setelah logout.',
            'Memperbaiki bug pada halaman dashboard yang tetap menampilkan username setelah refresh.',
            'Memperbaiki bug pada halaman dashboard yang tetap menampilkan notifikasi setelah ganti tema.',
        ]
    }
};