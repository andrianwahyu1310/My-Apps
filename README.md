# 💬 Public Service & Bug Report App (React SPA)

Sistem Layanan Pengaduan & Pelaporan Bug berbasis Web Application yang dibangun menggunakan **React (SPA)**. Aplikasi ini memungkinkan pengguna terotentikasi untuk menyampaikan keluhan, laporan kendala teknis (bug), maupun usulan fitur langsung kepada tim pengembang melalui dua saluran utama: **Email** atau **WhatsApp**.

---

## 📸 Fitur Utama

- 🔐 **Otentikasi & Keamanan Akses**: Proteksi halaman pengaduan yang mewajibkan status login (`AuthContext`).
- 📨 **Multi-Channel Delivery**:
  - **Email API**: Pengiriman pesan langsung ke backend server menggunakan `FormData` (mendukung *attachment* gambar).
  - **WhatsApp Direct Link**: Redirect otomatis ke obrolan WhatsApp pengembang dengan format pesan yang telah terstruktur secara rapi.
- 🖼️ **File Upload & Preview**: Dukungan pengunggahan bukti screenshot bug (maksimal 5MB) lengkap dengan fitur *live preview*.
- 🔔 **Sistem Notifikasi Toast**: Umpan balik visual interaktif untuk setiap aksi pengguna.
- 🎨 **Responsive & Dark/Light Theme Ready**: Desain antarmuka modern yang memanfaatkan CSS Custom Properties (`var(--...)`).

---

## 🛠️ Fitur & Spesifikasi Teknis

* **Frontend**: React.js (Vite / CRA), React Router DOM
* **State & Context**: React Context API (`AuthContext`), `useState`, `useEffect`
* **Icons & Styling**: Bootstrap Icons / CSS Modules / Custom CSS Variables
* **API Handling**: Custom Fetch Wrapper (`apiFetch`) untuk komunikasi *backend* aman (`credentials: 'include'`)

---

## 📂 Struktur Direktori Komponen

```text
src/
├── components/
│   └── Contact.jsx        # Komponen utama form pengaduan & kontak
├── contexts/
│   └── AuthContext.js     # Pengelola state otentikasi pengguna
├── config/
│   └── api.js             # Utility konfigurasi API Fetch
└── utils/
    └── toasted.js         # Handler notifikasi Toast