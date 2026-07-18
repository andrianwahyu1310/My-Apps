import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 AKURASI KALENDER: Faktor konversi berbasis satuan dasar Detik.
// Satuan di atas hari diselaraskan dengan rata-rata tahun kabisat Gregorian (365,2425 hari/tahun)
const FAKTOR_KONVERSI_WAKTU = {
    milidetik: 0.001,
    detik: 1,
    menit: 60,
    jam: 3600,
    hari: 86400,
    minggu: 604800,
    bulan: 2629746,       // 1 bulan (rata-rata) = 30,436875 hari
    triwulan: 7889238,    // 3 bulan
    semester: 15778476,   // 6 bulan
    tahun: 31556952,      // 1 tahun (rata-rata Gregorian) = 365,2425 hari
    lustrum: 157784760,   // 5 tahun
    windu: 252455616,     // 8 tahun
    dekade: 315569520,    // 10 tahun
    abad: 3155695200,     // 100 tahun
    milenium: 31556952000 // 1.000 tahun
};

// 🌟 STRUKTUR DATA 15 OPSINYA SENPAI (Diselaraskan dengan ikon Font Awesome asli dari kode Anda)
const DAFTAR_SATUAN_WAKTU = [
    { id: 'milidetik', label: 'Milidetik (ms)', icon: 'fa-stopwatch' },
    { id: 'detik', label: 'Detik (s)', icon: 'fa-stopwatch' },
    { id: 'menit', label: 'Menit', icon: 'fa-clock' },
    { id: 'jam', label: 'Jam', icon: 'fa-clock' },
    { id: 'hari', label: 'Hari', icon: 'fa-calendar-days' },
    { id: 'minggu', label: 'Minggu', icon: 'fa-calendar-days' },
    { id: 'triwulan', label: 'Triwulan', icon: 'fa-calendar' },
    { id: 'semester', label: 'Semester', icon: 'fa-calendar' },
    { id: 'bulan', label: 'Bulan (Rata-rata)', icon: 'fa-calendar' },
    { id: 'tahun', label: 'Tahun', icon: 'fa-calendar' },
    { id: 'lustrum', label: 'Lustrum', icon: 'fa-hourglass-half' },
    { id: 'windu', label: 'Windu', icon: 'fa-hourglass-half' },
    { id: 'dekade', label: 'Dekade', icon: 'fa-hourglass-half' },
    { id: 'abad', label: 'Abad', icon: 'fa-clock-rotate-left' },
    { id: 'milenium', label: 'Milenium', icon: 'fa-clock-rotate-left' }
];

export default function KalkulatorWaktu() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('jam'); // Default jam ke menit agar langsung informatif
    const [keSatuan, setKeSatuan] = useState('menit');
    const [hasilKonversi, setHasilKonversi] = useState('');
    
    // State Kendali Dropdown Melayang
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    
    // State untuk Popup Dokumentasi
    const [isModalActive, setIsModalActive] = useState(false);

    // STRATEGI REF: Deteksi batas klik luar untuk penutupan otomatis
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    // Identifikasi Pilihan Aktif untuk Tampilan Label Dropdown
    const opsiDariTerpilih = DAFTAR_SATUAN_WAKTU.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_WAKTU[3];
    const opsiKeTerpilih = DAFTAR_SATUAN_WAKTU.find(s => s.id === keSatuan) || DAFTAR_SATUAN_WAKTU[2];

    // PERTAHANAN GLOBAL: Menutup elemen melayang secara otomatis saat klik di luar area box
    useEffect(() => {
        const tanganiKlikLuar = (event) => {
            if (bukaDariDropdown && refDropdownDari.current && !refDropdownDari.current.contains(event.target)) {
                setBukaDariDropdown(false);
            }
            if (bukaKeDropdown && refDropdownKe.current && !refDropdownKe.current.contains(event.target)) {
                setBukaKeDropdown(false);
            }
            if (isModalActive && refKontenModal.current && !refKontenModal.current.contains(event.target)) {
                setIsModalActive(false);
            }
        };

        document.addEventListener('mousedown', tanganiKlikLuar);
        return () => {
            document.removeEventListener('mousedown', tanganiKlikLuar);
        };
    }, [bukaDariDropdown, bukaKeDropdown, isModalActive]);

    // Logika Hitung Konversi Waktu (Real-time & Akurat)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam Detik) / Faktor Tujuan dalam Detik
        const nilaiDalamDetik = nilaiAngka * FAKTOR_KONVERSI_WAKTU[dariSatuan];
        const hasilAkhir = nilaiDalamDetik / FAKTOR_KONVERSI_WAKTU[keSatuan];

        // Format keluaran angka desimal
        let hasilDiformat;
        if (hasilAkhir < 1e-4 || hasilAkhir > 1e12) {
            hasilDiformat = hasilAkhir.toExponential(6);
        } else {
            hasilDiformat = Number(hasilAkhir.toFixed(6)).toString();
        }
        
        // Ekstrak token simbol jika ada di dalam label, atau gunakan teks label aslinya
        const simbolSatuan = opsiKeTerpilih.label.match(/\(([^)]+)\)/)?.[1] || opsiKeTerpilih.label;
        setHasilKonversi(`Hasil: ${hasilDiformat} ${simbolSatuan}`);
    };

    useEffect(() => {
        hitungKonversi();
    }, [inputValue, dariSatuan, keSatuan]);

    return (
        <>
            <div className="tools-page-wrapper" style={{ paddingTop: '100px' }}>
                <Link to="/mainTools" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
                </Link>

                <div className="tool-container">
                    <div className="tool-header">
                        <h2>
                            <i className="fa-solid fa-clock" style={{ marginRight: '10px' }}></i> 
                            Konversi Satuan Waktu
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Waktu" 
                            onClick={() => setIsModalActive(true)}
                        >
                            <i className="bi bi-question-lg"></i>
                        </button>
                    </div>
                    
                    {/* INPUT NILAI ANGKA */}
                    <div className="form-group">
                        <label>Masukkan Nilai Angka</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            step="any"
                            placeholder="Masukkan angka..."
                        />
                    </div>

                    {/* CUSTOM DROPDOWN: SATUAN ASAL */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownDari}>
                        <label>Satuan Asal</label>
                        <div 
                            className="form-control custom-dropdown" 
                            onClick={() => {
                                setBukaDariDropdown(!bukaDariDropdown);
                                setBukaKeDropdown(false);
                            }}
                        >
                            <div>
                                <i className={`fa-solid ${opsiDariTerpilih.icon}`}></i>
                                <span className="text-normal">{opsiDariTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaDariDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaDariDropdown && (
                            <div className="dropdown-options" style={{ display: 'block' }}>
                                {DAFTAR_SATUAN_WAKTU.map((item) => (
                                    <div 
                                        key={`dari-${item.id}`}
                                        className="option-item"
                                        onClick={() => {
                                            setDariSatuan(item.id);
                                            setBukaDariDropdown(false);
                                        }}
                                    >
                                        <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i> 
                                        <span className="text-normal">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CUSTOM DROPDOWN: KONVERSI KE */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownKe}>
                        <label>Konversi Ke</label>
                        <div 
                            className="form-control custom-dropdown" 
                            onClick={() => {
                                setBukaKeDropdown(!bukaKeDropdown);
                                setBukaDariDropdown(false);
                            }}
                        >
                            <div>
                                <i className={`fa-solid ${opsiKeTerpilih.icon}`}></i>
                                <span className="text-normal">{opsiKeTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaKeDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaKeDropdown && (
                            <div className="dropdown-options" style={{ display: 'block' }}>
                                {DAFTAR_SATUAN_WAKTU.map((item) => (
                                    <div 
                                        key={`ke-${item.id}`}
                                        className="option-item"
                                        onClick={() => {
                                            setKeSatuan(item.id);
                                            setBukaKeDropdown(false);
                                        }}
                                    >
                                        <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i> 
                                        <span className="text-normal">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* BUTTON HITUNG MANUAL */}
                    <button className="btn-hitung" onClick={hitungKonversi}>
                        Hitung Konversi
                    </button>

                    {/* BOX HASIL AKHIR */}
                    <div className="result-box">
                        {hasilKonversi}
                    </div>
                </div>
            </div>

            {/* =========================================================
                SISTEM POPUP MODAL (PANDUAN UKURAN KALENDER SINKRON)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Satuan Waktu & Kalender
                    </h3>
                    
                    <ul className="tool-list">
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-rotate"></i> Milidetik (ms)</span>
                            <div className="tool-text">
                                Milidetik (ms) adalah satuan waktu dalam Sistem Satuan Internasional (SI) yang setara dengan seperseribu detik <span className="latex-auto">($10^{-3}$</span> detik atau 0,001 detik).  Secara matematis, hubungan konversinya adalah 1 detik = 1.000 milidetik, sehingga untuk mengonversi milidetik ke detik, nilai milidetik harus dibagi 1.000.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail teknis dan aplikasinya:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Dasar: Satu milidetik sama dengan 1/1000 detik. Satuan ini termasuk dalam sub-satuan waktu yang lebih kecil dari detik, diikuti oleh mikrodetik, nanodetik, picodetik, femtodetik, attodetik, dan zeptodetik.
                                    </li>
                                    <li className="sub-item">Contoh Waktu Nyata:</li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 ms: Waktu siklus frekuensi 1 kHz; durasi cahaya dalam kabel serat optik untuk jarak ~204 km; waktu konduksi saraf neuron.
                                        </li>
                                        <li className="sub-item">
                                            2 ms: Waktu perpindahan gigi pada mobil Formula Satu.
                                        </li>
                                        <li className="sub-item">
                                            3 ms: Kecepatan kepakan sayap lalat rumah.
                                        </li>
                                        <li className="sub-item">
                                            5–80 ms: Kecepatan kepakan sayap kolibri.
                                        </li>
                                        <li className="sub-item">
                                            10 ms: Waktu siklus frekuensi 100 Hz.
                                        </li>
                                        <li className="sub-item">
                                            16,67 ms: Waktu siklus listrik AC 60 Hz.
                                        </li>
                                        <li className="sub-item">
                                            16,68 ms: Durasi satu bidang dalam video 29,97 fps.
                                        </li>
                                        <li className="sub-item">
                                            41,67 ms: Durasi satu bingkai dalam video 24 fps (bioskop).
                                        </li>
                                        <li className="sub-item">
                                            50 ms: Waktu siklus nada terendah yang dapat didengar (20 Hz).
                                        </li>
                                        <li className="sub-item">
                                            100–400 ms: Waktu mata manusia berkedip.
                                        </li>
                                        <li className="sub-item">
                                            200 ms: Waktu yang dibutuhkan otak manusia untuk mengenali emosi dalam raut wajah.
                                        </li>
                                        <li className="sub-item">
                                            1.000 ms: Sama dengan satu detik penuh. 
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Aplikasi Teknis: Milidetik sering digunakan dalam komputasi (latensi jaringan, response time layar LCD), pemrosesan sinyal, dan pengukuran presisi tinggi seperti waktu reaksi sistem atau rotasi pulsar. 
                                    </li>
                                    <li className="sub-item">
                                        Nama Alternatif: Satuan 10 milidetik dapat disebut sentidetik, dan 100 milidetik disebut desidetik, meskipun istilah ini jarang digunakan dalam praktik sehari-hari. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-rotate"></i> Detik (s)</span>
                            <div className="tool-text">
                                Detik (simbol: s) adalah satuan pokok untuk besaran waktu dalam Sistem Satuan Internasional (SI).  Secara definisi ilmiah terkini, satu detik didefinisikan sebagai durasi sepanjang 9.192.631.770 periode dari radiasi yang berkaitan dengan transisi antara dua tingkat hiperhalus keadaan dasar dari atom sesium-133 pada suhu 0 Kelvin. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Dalam penggunaan umum dan pendidikan dasar, detik diringkas sebagai:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1/60 dari satu menit.
                                    </li>
                                    <li className="sub-item">
                                        1/3.600 dari satu jam.
                                    </li>
                                    <li className="sub-item">
                                        Sejarah definisi detik mengalami evolusi dari pengukuran astronomi (berdasarkan rotasi dan revolusi Bumi) hingga penggunaan jam atom untuk akurasi yang lebih tinggi, dengan redefinisi final yang mengacu pada frekuensi atom sesium.  Satuan ini juga memiliki kelipatan dan subkelipatan SI seperti milidetik (ms), mikrodetik (µs), dan nanodetik (ns) untuk pengukuran yang lebih presisi. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-clock"></i> Menit (m)</span>
                            <div className="tool-text">
                                Menit adalah satuan waktu turunan dalam Sistem Satuan Internasional (SI) yang setara dengan 60 detik.  Kata "menit" berasal dari bahasa Latin minuta, yang berarti "kecil" atau merujuk pada pars minuta prima ("bagian kecil pertama") dari satu jam. 
                            </div>

                        <div className="sub-info-box">
                                <span className="sub-info-title">Secara matematis, hubungan konversi menit dengan satuan lain adalah:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 menit = 60 detik</li>
                                    <li className="sub-item">
                                        1 jam = 60 menit (sehingga 1 jam = 3.600 detik) 
                                    </li>
                                    <li className="sub-item">
                                        Meskipun bukan satuan dasar SI (di mana detik adalah satuan dasar), menit diakui secara internasional dan digunakan secara luas dalam kehidupan sehari-hari, matematika, dan ilmu pengetahuan. Dalam pengukuran waktu, jarum panjang pada jam analog menunjukkan satuan menit, dengan setiap angka pada dial mewakili interval 5 menit. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-clock"></i> Jam (hrs)</span>
                            <div className="tool-text">
                                Jam adalah satuan waktu yang setara dengan 1/24 dari satu hari atau 60 menit (3.600 detik).  Dalam Sistem Satuan Internasional (SI), detik merupakan satuan dasar, sehingga jam adalah satuan turunan yang diakui secara internasional untuk mengukur durasi peristiwa. <br /><br />Secara etimologi, istilah ini berasal dari bahasa Latin hora atau Yunani hora yang berarti "musim" atau "jam". Konsep pembagian hari menjadi 24 jam berasal dari Mesir kuno, yang awalnya membagi siang menjadi 10 jam menggunakan jam bayangan, ditambah dua jam untuk senja dan akhir hari, serta menggunakan rasi bintang (decans) untuk menghitung malam. Pembagian ini kemudian distandarisasi oleh Hipparchus menjadi 24 jam yang setara (equinoctial hours). 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Detail konversi dan pengukuran jam meliputi</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan Dasar: 1 jam = 60 menit; 1 jam = 3.600 detik. 
                                    </li>
                                    <li className="sub-item">
                                        Alat Ukur: Pada jam analog, jarum pendek menunjukkan posisi jam, dengan pergeseran dari satu angka ke angka berikutnya memakan waktu tepat 1 jam.
                                    </li>
                                    <li className="sub-item">
                                        Format Waktu: Untuk mengonversi dari format 24 jam ke 12 jam, kurangi waktu dengan 12 jika nilai jam lebih dari 12 (misalnya, pukul 15.00 menjadi pukul 3.00 sore). 
                                    </li>
                                    <li className="sub-item">
                                        Konteks Harian: Satu hari penuh terdiri dari 24 jam, yang setara dengan 1.440 menit atau 86.400 detik. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar"></i> Hari (day)</span>
                            <div className="tool-text">
                                Hari adalah satuan waktu yang setara dengan 24 jam, 1.440 menit, atau 86.400 detik.  Secara astronomi, satu hari mewakili satu kali rotasi penuh Bumi pada porosnya, yang menghasilkan siklus siang dan malam. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi dasar hari meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Posisi dalam Tangga Satuan: Desigram berada di bawah gram (g) dan di atas sentigram (cg).  Urutan utamanya adalah kilogram (kg), hektogram (hg), dekagram (dag), gram (g), desigram (dg), sentigram (cg), dan miligram (mg).
                                    </li>
                                    <li className="sub-item">
                                        Konversi dasar hari meliputi:
                                    </li>
                                    <li className="sub-item">
                                        1 hari = 1.440 menit
                                    </li>
                                    <li className="sub-item">
                                        1 hari = 86.400 detik 
                                    </li>
                                    <li className="sub-item">
                                        Dalam perhitungan yang lebih besar, 1 minggu terdiri dari 7 hari, dan 1 tahun biasanya terdiri dari 365 hari (atau 366 hari pada tahun kabisat). 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar"></i> Minggu</span>
                            <div className="tool-text">
                                Minggu adalah satuan waktu yang terdiri dari 7 hari atau setara dengan 168 jam (168 × 60 = 10.080 menit).  Dalam konversi satuan waktu, minggu sering digunakan sebagai jembatan antara hari dan bulan, dengan rata-rata 1 bulan = 4 minggu. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail konversi dan karakteristik minggu:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan Dasar: 1 minggu = 7 hari. 
                                    </li>

                                    <li className="sub-item">
                                        Dalam Jam: 1 minggu = 7 × 24 jam = 168 jam. 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Menit: 168 jam × 60 menit = 10.080 menit. 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Detik: 10.080 menit × 60 detik = 604.800 detik. 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Bulan: Secara umum, 1 bulan dianggap setara dengan 4 minggu (meskipun secara astronomis bulan lebih dekat ke 4,3 minggu). 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Tahun: 1 tahun terdiri dari 52 minggu (52 × 7 = 364 hari, sisa 1 atau 2 hari tergantung tahun kabisat). 
                                    </li>
                                    <li className="sub-item">
                                        Konversi minggu ke satuan yang lebih kecil dilakukan dengan perkalian, sedangkan dari satuan lebih besar ke minggu dilakukan dengan pembagian. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar-days"></i> Triwulan</span>
                            <div className="tool-text">
                                Triwulan adalah satuan waktu yang setara dengan 3 bulan atau 90–92 hari.  Istilah ini berasal dari bahasa Jawa, di mana kata "tri" berarti tiga dan "wulan" berarti bulan. Dalam satu tahun kalender.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Terdapat 4 triwulan yang masing-masing mencakup periode bulan sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Triwulan Pertama (Q1): Januari, Februari, Maret
                                    </li>
                                    <li className="sub-item">
                                        Triwulan Kedua (Q2): April, Mei, Juni   
                                    </li>
                                    <li className="sub-item">
                                        Triwulan Ketiga (Q3): Juli, Agustus, September
                                    </li>
                                    <li className="sub-item">
                                        Triwulan Keempat (Q4): Oktober, November, Desember 
                                    </li>
                                    <li className="sub-item">
                                        Satuan waktu ini umum digunakan dalam bidang ekonomi, bisnis, dan keuangan untuk melaporkan kinerja perusahaan atau indikator makroekonomi.  Konversi dasar triwulan adalah: 1 triwulan = 3 bulan = 0,25 tahun. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar-days"></i> Semester</span>
                            <div className="tool-text">
                                Semester adalah satuan waktu terkecil yang digunakan untuk menyatakan lamanya proses kegiatan pembelajaran dalam suatu jenjang pendidikan.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, definisi dan konversinya adalah sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Durasi Efektif: Satu semester setara dengan 16 minggu kegiatan belajar efektif, yang sudah mencakup masa ujian tengah semester (UTS) dan ujian akhir semester (UAS). 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Sistem Kredit Semester (SKS):
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Definisi Lama (Permendikbud No. 17/2015): 1 SKS setara dengan 50 menit tatap muka per minggu per semester (ditambah 60 menit tugas terstruktur dan 60 menit mandiri).
                                        </li>
                                        <li className="sub-item">
                                            Definisi Baru (Permendikbudristek No. 53/2023): 1 SKS didefinisikan sebagai 45 jam dalam satu semester, memberikan fleksibilitas kepada perguruan tinggi dalam mengatur porsi belajar. 
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Posisi dalam Tahun Akademik: Satu tahun akademik umumnya terdiri dari dua semester reguler, yaitu Semester Gasal (biasanya September–Januari) dan Semester Genap (Februari–Agustus).
                                    </li>
                                    <li className="sub-item">
                                        Fungsi: Semester berfungsi sebagai dasar perhitungan beban studi mahasiswa, penentuan Indeks Prestasi (IP), dan batas waktu penyelesaian program pendidikan. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar-days"></i> Bulan</span>
                            <div className="tool-text">
                                Bulan adalah satuan waktu yang secara umum setara dengan 30 hari dalam perhitungan praktis atau rata-rata, namun secara astronomis dan kalender Gregorian, durasinya bervariasi antara 28 hingga 31 hari tergantung pada bulan spesifiknya. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, konversi bulan ke satuan lain memiliki nuansa sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Perhitungan Umum: Untuk kebutuhan sederhana, 1 bulan dihitung sebagai 30 hari, 4 minggu, atau 730 jam
                                    </li>
                                    <li className="sub-item">
                                        Perhitungan Akurat: Rata-rata panjang bulan adalah 30,417 hari (dihitung dari 365 hari dibagi 12). 
                                    </li>
                                    <li className="sub-item">
                                        Dalam kalender Gregorian, jumlah hari per bulan adalah:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            31 hari: Januari, Maret, Mei, Juli, Agustus, Oktober, Desember.
                                        </li>
                                        <li className="sub-item">
                                            30 hari: April, Juni, September, November.
                                        </li>
                                        <li className="sub-item">
                                            28 atau 29 hari: Februari (29 hari pada tahun kabisat yang terjadi setiap 4 tahun sekali).
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Konteks Khusus: Satuan bulan sering digunakan dalam periode waktu tertentu seperti 1 triwulan (3 bulan), 1 caturwulan (4 bulan), atau 1 semester (6 bulan).
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-calendar-days"></i> Tahun</span>
                            <div className="tool-text">
                                Tahun adalah satuan waktu yang setara dengan periode revolusi Bumi mengelilingi Matahari, yang berlangsung selama 365,25 hari atau sekitar 31.557.600 detik. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Detail Satuan Ons Lokal:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Dalam penggunaan praktis dan kalender Gregorian:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Tahun biasa memiliki 365 hari.
                                        </li>
                                        <li className="sub-item">
                                            Tahun kabisat memiliki 366 hari, dengan penambahan satu hari pada bulan Februari (29 Februari) setiap 4 tahun sekali (kelipatan 4).
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Satuan waktu ini juga memiliki hubungan konversi baku dengan satuan yang lebih besar maupun lebih kecil:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 tahun = 12 bulan
                                        </li>
                                        <li className="sub-item">
                                            1 tahun = 52 minggu
                                        </li>
                                        <li className="sub-item">
                                            1 lustrum = 5 tahun
                                        </li>
                                        <li className="sub-item">
                                            1 dekade (dasawarsa) = 10 tahun
                                        </li>
                                        <li className="sub-item">
                                            1 abad = 100 tahun
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bars-staggered"></i> Lustrum</span>
                            <div className="tool-text">
                                Lustrum adalah satuan waktu yang setara dengan 5 tahun.  Istilah ini berasal dari bahasa Latin lustrum, yang awalnya merujuk pada upacara pembersihan atau penyucian yang dilakukan oleh censur (pejabat sensus) di Roma Kuno setiap lima tahun sekali. 
                            </div>
                            
                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah info mengenai Lustrum:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Secara teknis dalam konversi satuan waktu, hubungan lustrum dengan satuan lainnya adalah sebagai berikut:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 Lustrum = 5 Tahun
                                        </li>
                                        <li className="sub-item">
                                            1 Lustrum = 60 Bulan
                                        </li>
                                        <li className="sub-item">
                                            1 Lustrum = 240 Minggu
                                        </li>
                                        <li className="sub-item">
                                            1 Lustrum = 1.800 Hari
                                        </li>
                                        <li className="sub-item">
                                            1 Lustrum = 43.200 Jam
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Dalam skala waktu yang lebih besar, lustrum sering dibandingkan dengan satuan waktu panjang lainnya seperti windu dan abad:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 Abad (100 tahun) setara dengan 20 Lustrum. 
                                        </li>
                                        <li className="sub-item">
                                            1 Windu (8 tahun) setara dengan 1,6 Lustrum (atau 1 lustrum = 0,625 windu).
                                        </li>
                                        <li className="sub-item">
                                            1 Dekade/Dasawarsa (10 tahun) setara dengan 2 Lustrum.
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Lustrum umumnya digunakan untuk mengukur periode pendidikan, masa studi, atau interval administratif tertentu yang memerlukan rentang waktu lima tahun. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bars-staggered"></i> Windu</span>
                            <div className="tool-text">
                                Windu adalah satuan waktu tradisional yang setara dengan 8 tahun.  Dalam sistem penanggalan Jawa yang disempurnakan oleh Sultan Agung, satu windu terdiri dari 8 tahun dengan nama khusus, yaitu Alip, Ehe, Jimawal, Je, Dal, Be, Wawu, dan Jimakir. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara matematis dan konversi standar:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 Windu = 8 Tahun
                                    </li>
                                    <li className="sub-item">
                                        1 Windu = 96 Bulan (dihitung rata-rata 12 bulan/tahun)
                                    </li>
                                    <li className="sub-item">
                                        1 Windu = 2.880 Hari (dihitung 360 hari/tahun)
                                    </li>
                                    <li className="sub-item">
                                        1 Windu = 69.120 Jam
                                    </li>
                                    <li className="sub-item">
                                        1 Windu = 248.832.000 Detik
                                    </li>
                                    <li className="sub-item">
                                        Dalam skala waktu yang lebih besar, 1 abad (100 tahun) setara dengan 12,5 windu, atau 1 milenium (1.000 tahun) setara dengan 125 windu. Satuan ini sering digunakan dalam konteks sejarah, demografi, atau perhitungan umur jangka panjang di masyarakat Indonesia.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bars-staggered"></i> Dekade</span>
                            <div className="tool-text">
                                Dekade adalah satuan waktu yang setara dengan 10 tahun.  Istilah ini berasal dari bahasa Yunani, di mana "deka" berarti sepuluh, dan dalam bahasa Indonesia sering disebut juga sebagai dasawarsa (dari bahasa Jawa/Sanskerta: dasa = sepuluh, warsa = tahun). sebagai unit dasar di mana 2 stone sama dengan 1 quarter, 8 stone sama dengan 1 hundredweight (cwt), dan 160 stone sama dengan 1 long ton.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, konversi satuan dekade meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan tahun: 1 dekade = 10 tahun. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan abad: 10 dekade = 1 abad (100 tahun), atau 1 dekade = 0,1 abad. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan windu: 1 dekade = 1,25 windu (karena 1 windu = 8 tahun).
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan lustrum: 1 dekade = 2 lustrum (karena 1 lustrum = 5 tahun).
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan bulan: 1 dekade = 120 bulan. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan umum: Dekade sering digunakan untuk mencatat periode sejarah atau tren, misalnya dekade 2000-an yang merujuk pada tahun 2000 hingga 2009. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-rectangle-list"></i> Abad</span>
                            <div className="tool-text">
                                Abad adalah satuan waktu yang setara dengan 100 tahun. Istilah ini juga dikenal sebagai century dalam bahasa Inggris. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, konversi satuan abad meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan Satuan Lain: 1 abad sama dengan 10 dasawarsa (atau dekade), 100 tahun, 1.200 bulan, dan 10.000 dekade. 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Hari: Jika dihitung berdasarkan tahun standar (365 hari), 1 abad setara dengan 36.500 hari. Namun, karena adanya tahun kabisat (yang terjadi setiap 4 tahun sekali), dalam 100 tahun terdapat sekitar 25 tahun kabisat, sehingga total hari menjadi 36.525 hari. 
                                    </li>
                                    <li className="sub-item">
                                        Dalam Detik: Berdasarkan perhitungan 36.525 hari, 1 abad setara dengan 3.155.760.000 detik.
                                    </li>
                                    <li className="sub-item">
                                        Penyebutan Periode: Secara teknis, abad ke-N dimulai pada tahun yang berakhiran 01 dan berakhir pada tahun yang berakhiran 00. Misalnya, abad ke-21 dimulai pada tahun 2001 dan berakhir pada tahun 2100. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-regular fa-rectangle-list"></i> Milenium</span>
                            <div className="tool-text">
                                Milenium adalah satuan waktu dengan jangka waktu 1.000 tahun.  Istilah ini berasal dari bahasa Latin mille (seribu) dan annum (tahun), dan merupakan satuan waktu terbesar yang umum digunakan dalam konversi satuan waktu standar. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, konversi 1 milenium ke satuan waktu lainnya adalah sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan abad: 1 milenium = 10 abad (karena 1 abad = 100 tahun).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan dekade/dasawarsa: 1 milenium = 100 dekade atau 100 dasawarsa (karena 1 dekade = 10 tahun).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan windu: 1 milenium = 125 windu (karena 1 windu = 8 tahun).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan lustrum: 1 milenium = 200 lustrum (karena 1 lustrum = 5 tahun).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan tahun: 1 milenium = 1.000 tahun.
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan bulan: 1 milenium = 12.000 bulan (dengan asumsi 1 tahun = 12 bulan).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan minggu: 1 milenium = 52.000 minggu (dengan asumsi 1 tahun = 52 minggu).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan hari: 1 milenium = 365.000 hari (dengan asumsi 1 tahun = 365 hari).
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan jam: 1 milenium = 8.760.000 jam.
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan menit: 1 milenium = 525.600.000 menit.
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan detik: 1 milenium = 31.536.000.000 detik.
                                    </li>

                                    <li className="sub-item">
                                        Penggunaan umum: Milenium digunakan untuk menyatakan rentang waktu yang sangat panjang, terutama dalam sejarah, arkeologi, astronomi, dan penanggalan peradaban. Contohnya, milenium ketiga dimulai pada tahun 2001 dan berlangsung hingga tahun 3000.
                                    </li>
                                    <li className="sub-item">
                                        Dalam konteks kalender, Milenium ke-3 berlangsung dari tahun 2001 hingga 3000.  Istilah "alaf" dalam bahasa Arab sering digunakan sebagai padanan untuk milenium, seperti "Alaf Ketiga" yang merujuk pada periode tahun 2000-an hingga 2999. 
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}