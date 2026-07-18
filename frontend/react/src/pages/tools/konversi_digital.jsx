import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 AKURASI BINER: Faktor konversi berbasis satuan dasar Byte (B) menggunakan pengali 1024
const FAKTOR_KONVERSI_DATA = {
    byte: 1,
    kilobyte: 1024,
    megabyte: 1024 ** 2, // 1.048.576
    gigabyte: 1024 ** 3, // 1.073.741.824
    terabyte: 1024 ** 4,
    petabyte: 1024 ** 5,
    exabyte: 1024 ** 6,
    zettabyte: 1024 ** 7,
    yottabyte: 1024 ** 8
};

// 🌟 STRUKTUR DATA 9 OPSINYA SENPAI (Diselaraskan dengan ikon Font Awesome asli dari kode Anda)
const DAFTAR_SATUAN_DATA = [
    { id: 'byte', label: 'Byte (B)', icon: 'fa-file-lines' },
    { id: 'kilobyte', label: 'Kilobyte (KB)', icon: 'fa-folder' },
    { id: 'megabyte', label: 'Megabyte (MB)', icon: 'fa-file-audio' },
    { id: 'gigabyte', label: 'Gigabyte (GB)', icon: 'fa-file-video' },
    { id: 'terabyte', label: 'Terabyte (TB)', icon: 'fa-hard-drive' },
    { id: 'petabyte', label: 'Petabyte (PB)', icon: 'fa-database' },
    { id: 'exabyte', label: 'Exabyte (EB)', icon: 'fa-database' },
    { id: 'zettabyte', label: 'Zettabyte (ZB)', icon: 'fa-globe' },
    { id: 'yottabyte', label: 'Yottabyte (YB)', icon: 'fa-globe' }
];

export default function KalkulatorData() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('megabyte'); // Default MB agar langsung terlihat nilainya
    const [keSatuan, setKeSatuan] = useState('kilobyte');
    const [hasilKonversi, setHasilKonversi] = useState('');
    
    // State Kendali Dropdown Melayang
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    
    // State untuk Popup Dokumentasi
    const [isModalActive, setIsModalActive] = useState(false);

    // STRATEGI REF: Deteksi batas klik luar
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    // Identifikasi Pilihan Aktif untuk Tampilan Label Dropdown
    const opsiDariTerpilih = DAFTAR_SATUAN_DATA.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_DATA[2];
    const opsiKeTerpilih = DAFTAR_SATUAN_DATA.find(s => s.id === keSatuan) || DAFTAR_SATUAN_DATA[1];

    // PERTAHANAN GLOBAL: Deteksi klik di luar komponen untuk menutup otomatis
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

    // Logika Hitung Konversi Data Digital (Aman dari pembulatan ekstrem)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam Byte) / Faktor Tujuan dalam Byte
        const nilaiDalamByte = nilaiAngka * FAKTOR_KONVERSI_DATA[dariSatuan];
        const hasilAkhir = nilaiDalamByte / FAKTOR_KONVERSI_DATA[keSatuan];

        // Memformat notasi ilmiah jika nilainya terlalu besar (seperti Exabyte ke Byte) atau sangat kecil
        let hasilDiformat;
        if (hasilAkhir < 1e-4 || hasilAkhir > 1e15) {
            hasilDiformat = hasilAkhir.toExponential(6);
        } else {
            // Gunakan presisi maksimal untuk biner desimal jika ada pecahan sisa
            hasilDiformat = Number(hasilAkhir.toFixed(8)).toString();
        }
        
        const simbolSatuan = opsiKeTerpilih.label.match(/\(([^)]+)\)/)?.[1] || '';
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
                            <i className="fa-solid fa-database" style={{ marginRight: '10px' }}></i> 
                            Konversi Data Digital
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Data" 
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
                                {DAFTAR_SATUAN_DATA.map((item) => (
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
                                {DAFTAR_SATUAN_DATA.map((item) => (
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

                    {/* BUTTON HITUNG */}
                    <button className="btn-hitung" onClick={hitungKonversi}>
                        Hitung Konversi
                    </button>

                    {/* BOX OUTPUT HASIL */}
                    <div className="result-box">
                        {hasilKonversi}
                    </div>
                </div>
            </div>

            {/* =========================================================
                SISTEM POPUP MODAL (DOKUMENTASI STANDAR BINER)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Ukuran Data Digital
                    </h3>
                    
                    <ul className="tool-list">

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-file-lines"></i> Byte (B)</span>
                            <div className="tool-text">
                                Byte adalah satuan dasar informasi dalam komputasi digital yang terdiri dari 8 bit (digit biner).  Setiap byte dapat merepresentasikan 256 nilai berbeda (dari 0 hingga 255), yang memungkinkan penyimpanan satu karakter teks (seperti huruf atau simbol), instruksi mesin, atau bagian dari data multimedia. <br /><br />Simbol standar untuk byte adalah huruf kapital "B" (contoh: MB, GB), yang membedakannya dari bit yang menggunakan huruf kecil "b".  Dalam praktik, byte berfungsi sebagai unit fundamental untuk mengukur kapasitas penyimpanan (seperti RAM, hard disk, dan ukuran file) serta sebagai blok penyusun data yang lebih besar seperti kilobyte (KB), megabyte (MB), dan gigabyte (GB), di mana setiap tingkat naik dikalikan dengan faktor 1.024 (bukan 1.000) karena penggunaan sistem biner. 
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-folder"></i> Kilobyte (KB)</span>
                            <div className="tool-text">
                                Kilobyte (disingkat KB) adalah satuan ukuran data digital yang setara dengan 1.024 byte, bukan 1.000 byte.  Perbedaan ini muncul karena sistem komputer menggunakan sistem biner (basis 2), di mana 1 KB dihitung sebagai $2^{10}$ byte. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara praktis, 1 KB dapat diperkirakan mewakili sekitar 1.000 karakter teks.  Satuan ini umumnya digunakan untuk mengukur ukuran file kecil, seperti:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Dokumen teks sederhana (misalnya, satu halaman di Notepad).
                                    </li>
                                    <li className="sub-item">
                                        File gambar dengan resolusi rendah.
                                    </li>
                                    <li className="sub-item">
                                        Metadata atau elemen grafis kecil pada website. 
                                    </li>
                                    <li className="sub-item">
                                        Perlu dicatat bahwa produsen penyimpanan eksternal sering menggunakan sistem desimal (di mana 1 KB = 1.000 byte), yang menyebabkan perbedaan jumlah ruang penyimpanan yang terlihat saat file dipindahkan ke perangkat komputer yang menggunakan sistem biner.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-file-audio"></i> Megabyte (MB)</span>
                            <div className="tool-text">
                                Megabyte (MB) adalah satuan ukuran data digital yang setara dengan 1.024 Kilobyte (KB) atau 1.048.576 Byte dalam sistem biner komputer, meskipun secara standar SI (Sistem Internasional) sering didefinisikan sebagai 1.000.000 Byte.  Satuan ini digunakan secara luas untuk mengukur ukuran file media seperti lagu MP3 (sekitar 3–8 MB), foto (2–5 MB), dan aplikasi ringan, serta menjadi satuan menengah antara KB dan GB dalam kapasitas penyimpanan perangkat digital. 
                            </div>

                        <div className="sub-info-box">
                                <span className="sub-info-title">Perbedaan definisi MB muncul karena dua sistem perhitungan:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">Kesetaraan Nilai:</li>
                                    <li className="sub-item">
                                        Sistem Biner (Komputasi): Menggunakan pangkat 2, di mana 1 MB = <span className="latex-auto">$2^{20}$</span> byte = 1.048.576 byte.  Ini adalah nilai yang umumnya digunakan oleh sistem operasi untuk menunjukkan kapasitas penyimpanan dan ukuran file.
                                    </li>

                                    <li className="sub-item">
                                        Sistem Desimal (SI): Menggunakan pangkat 10, di mana 1 MB = <span className="latex-auto">$10^6$</span> byte = 1.000.000 byte.  Definisi ini sering digunakan oleh produsen perangkat keras (seperti hard disk) dalam spesifikasi teknis, yang dapat menyebabkan perbedaan persepsi kapasitas yang tersedia. 
                                    </li>

                                    <li className="sub-item">
                                        Satuan ini memiliki peran penting dalam manajemen data sehari-hari karena ukurannya yang cukup besar untuk menyimpan konten multimedia ringkas namun tidak sebesar Gigabyte (GB) yang setara dengan 1.024 MB atau 1.073.741.824 byte. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-file-video"></i> Gigabyte (GB)</span>
                            <div className="tool-text">
                                Gigabyte (GB) adalah satuan kapasitas penyimpanan data digital yang setara dengan 1.024 Megabyte (MB) atau 1.073.741.824 Byte.  Dalam sistem biner yang umum digunakan oleh komputer dan perangkat penyimpanan (seperti SSD, HDD, dan RAM), konversi ini didasarkan pada kelipatan <span className="latex-auto">$2^{10}$</span> atau 1.024, bukan 1.000 seperti dalam sistem desimal. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis, detail spesifikasi Gigabyte meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Biner: 1 GB = 1.024 MB = 1.048.576 KB = 1.073.741.824 Byte. 
                                    </li>
                                    <li className="sub-item">
                                        Definisi Desimal (SI): Menurut International System of Units, 1 GB sering didefinisikan sebagai tepat 1 miliar byte ($10^9$), yang menyebabkan perbedaan persepsi kapasitas antara sistem operasi (menggunakan biner) dan produsen penyimpanan (menggunakan desimal). 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Umum: Gigabyte adalah satuan standar untuk mengukur ukuran file besar (seperti film HD, aplikasi, dan game), kapasitas penyimpanan perangkat (flashdisk, memori internal), dan kuota internet.
                                    </li>
                                    <li className="sub-item">
                                        Perbandingan: Satu Gigabyte cukup untuk menyimpan sekitar 200-250 lagu dalam format MP3 kualitas standar, atau 1 film berdurasi 2 jam dengan resolusi Full HD. 
                                    </li>
                                    <li className="sub-item">
                                        Perlu dicatat bahwa satuan ini berbeda dengan Gigabit (Gb) yang digunakan untuk kecepatan transfer data, di mana 1 Byte terdiri dari 8 bit. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-hdd"></i> TeraByte (TB)</span>
                            <div className="tool-text">
                                Terabyte (TB) adalah satuan ukuran data digital yang setara dengan 1.024 Gigabyte (GB) atau sekitar 1 triliun byte (tepatnya 1.099.511.627.776 byte dalam sistem biner).  Satuan ini berasal dari kata "tera" yang berarti triliun dan merupakan standar kapasitas untuk perangkat penyimpanan modern seperti hard disk eksternal, SSD, dan server cloud. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, berikut adalah karakteristik dan penggunaan Terabyte:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Posisi dalam Tangga Satuan: Desigram berada di bawah gram (g) dan di atas sentigram (cg).  Urutan utamanya adalah kilogram (kg), hektogram (hg), dekagram (dag), gram (g), desigram (dg), sentigram (cg), dan miligram (mg).
                                    </li>
                                    <li className="sub-item">
                                        Perhitungan: Dalam sistem biner komputer, 1 TB = 1.024 GB = 1.048.576 MB = 1.073.741.824 KB.
                                    </li>
                                    <li className="sub-item">
                                        Kapasitas Penyimpanan: Satu Terabyte mampu menyimpan sekitar 300 jam video berkualitas tinggi (FHD/4K), 1.000 ensiklopedia digital, atau ratusan ribu foto resolusi tinggi. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Umum: TB digunakan untuk perangkat konsumen (laptop, hard drive) hingga skala enterprise (data center). Setelah TB, satuan yang lebih besar adalah Petabyte (PB) dan Exabyte (EB) yang umumnya digunakan untuk penyimpanan data berskala raksasa. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-database"></i> Petabyte (PB)</span>
                            <div className="tool-text">
                                Petabyte (PB) adalah satuan ukuran data digital yang sangat besar, setara dengan 1.024 terabyte (TB) atau 1.024.000 gigabyte (GB).  Dalam sistem biner komputer, satu petabyte secara teknis bernilai $2^{50}$ byte (sekitar 1,125 triliun byte), meskipun dalam konteks industri penyimpanan sering disederhanakan sebagai 1.000 TB atau 1 juta GB. <br /><br />Satuan ini umumnya tidak digunakan untuk perangkat konsumen biasa, melainkan untuk infrastruktur skala besar seperti pusat data (data center), superkomputer, dan platform big data. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title"> Berikut adalah detail konteks penggunaannya:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Analogi Kapasitas: Satu petabyte dapat menyimpan sekitar 500 miliar halaman teks standar, 20 juta lemari arsip dokumen, atau 13,3 tahun video HD tanpa henti.
                                    </li>

                                    <li className="sub-item">
                                        Penggunaan Industri: Digunakan oleh perusahaan teknologi untuk menyimpan data dari media sosial (seperti Facebook/Twitter), e-commerce (Amazon), ilmu kesehatan (data genomik), dan astrofisika (data teleskop).
                                    </li>
                                    <li className="sub-item">
                                        Peran dalam Analisis Data: Petabyte adalah skala umum untuk Big Data, machine learning, dan analisis real-time yang memerlukan infrastruktur penyimpanan canggih (seperti data lake) serta algoritma pemrosesan yang kuat (seperti Hadoop atau Spark). 
                                    </li>
                                    <li className="sub-item">
                                        Hierarki Satuan: Urutan peningkatan kapasitas adalah Byte → Kilobyte → Megabyte → Gigabyte → Terabyte → Petabyte → Exabyte, dengan setiap kenaikan satu tingkat dikalikan 1.024.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-database"></i> Exabyte (EB)</span>
                            <div className="tool-text">
                                Exabyte (EB) adalah satuan penyimpanan data digital yang setara dengan satu kuintiliun byte ($10^{18}$ byte) atau 1.000 petabyte.  Dalam sistem desimal (SI), awalan "exa" menunjukkan faktor satu triliun triliun, sehingga 1 EB sama dengan 1 juta terabyte atau 1 miliar gigabyte. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis, perhitungannya melibatkan hierarki berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 EB = 1.000 Petabyte (PB)
                                    </li>
                                    <li className="sub-item">
                                        1 EB = 1.000.000 Terabyte (TB)
                                    </li>
                                    <li className="sub-item">
                                        1 EB = 1.000.000.000 Gigabyte (GB)
                                    </li>
                                    <li className="sub-item">
                                        Dalam sistem biner (IEC), satuan yang setara adalah Exbibyte (EiB), yang bernilai 1.152.921.504.606.846.976 byte ($2^{60}$ byte).  Satu exbibyte sekitar 15,2% lebih besar daripada exabyte desimal, namun istilah exabyte lebih umum digunakan dalam konteks industri dan spesifikasi penyimpanan besar. 
                                    </li>
                                    <li className="sub-item">
                                        Skala ini digunakan untuk mengukur data dalam jumlah sangat masif, seperti:
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Total data yang dibuat di internet setiap hari (diperkirakan mencapai beberapa exabyte pada tahun 2020-an).
                                        </li>
                                        <li className="sub-item">
                                            Kapasitas pusat data hyperscale milik perusahaan teknologi besar (seperti Google, Microsoft, Amazon).
                                        </li>
                                        <li className="sub-item">
                                            Seluruh kata yang pernah diucapkan oleh umat manusia (diperkirakan sekitar 5 EB). Long Ton (Ton Panjang): Digunakan di Britania Raya (Imperial). 1 long ton ≈ 1.016 kg (2.240 pon).
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Satuan ini tidak digunakan untuk perangkat konsumen sehari-hari, melainkan untuk data center, superkomputer, dan infrastruktur Big Data serta Cloud Computing skala global. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-globe"></i> Zettabyte (ZB)</span>
                            <div className="tool-text">
                                Zettabyte adalah satuan pengukuran kapasitas penyimpanan data digital yang setara dengan 10 pangkat 21 byte atau 2 pangkat 70 byte, yang secara numerik mendekati 1 sekstiliun byte.  Dalam skala praktis, satu zettabyte setara dengan 1.000 exabyte, 1 miliar terabyte, atau 1 triliun gigabyte, menjadikannya unit yang digunakan untuk mengukur volume data berskala global seperti lalu lintas internet, cloud storage, dan big data. <br /><br />Penggunaan zettabyte sangat krusial dalam era digital saat ini untuk memonitor pertumbuhan eksponensial data yang dihasilkan oleh perangkat terhubung, media sosial, dan layanan streaming. Diperkirakan pada tahun 2025, total data yang dibuat atau direplikasi di seluruh dunia akan mencapai sekitar 163 hingga 175 zettabyte, angka yang menunjukkan betapa masifnya kebutuhan infrastruktur penyimpanan dan pemrosesan data yang didukung oleh kecerdasan buatan (AI) dan komputasi awan. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah perbandingan skala zettabyte dengan satuan data lainnya:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 Zettabyte (ZB) = 1.000 Exabyte (EB)
                                    </li>
                                    <li className="sub-item">
                                        1 Zettabyte (ZB) = 1.000.000 Petabyte (PB)
                                    </li>
                                    <li className="sub-item">
                                        1 Zettabyte (ZB) = 1.000.000.000 Terabyte (TB)
                                    </li>
                                    <li className="sub-item">
                                        1 Zettabyte (ZB) = 1.000.000.000.000 Gigabyte (GB)
                                    </li>
                                    <li className="sub-item">
                                        Sementara yottabyte (YB) adalah satuan yang lebih besar (1.000 kali lipat dari zettabyte), zettabyte tetap menjadi standar industri untuk mengukur kapasitas penyimpanan dan produksi data global saat ini, karena belum ada sistem tunggal yang mampu menampung satu yottabyte.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-globe"></i> Yottabyte (YB)</span>
                            <div className="tool-text">
                                Yottabyte (disingkat YB) adalah satuan pengukuran data digital terbesar yang diakui dalam Sistem Internasional (SI), setara dengan 10^24 byte atau 1 septiliun byte.  Secara praktis, satu yottabyte setara dengan 1.000 zettabyte (ZB), 1 juta petabyte (PB), atau 1 triliun terabyte (TB). 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis, yottabyte memiliki karakteristik sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Representasi Biner: Dalam sistem biner komputer, yottabyte sering diaproksimasi sebagai <span className="latex-auto">2^80</span> bytes. 
                                    </li>
                                    <li className="sub-item">
                                        Skala Fisik: Untuk mencapai kapasitas 1 YB, diperlukan sekitar 1,33 triliun hard disk berkapasitas 750 GB.
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan: Satuan ini saat ini bersifat teoretis dan tidak ada perangkat penyimpanan tunggal yang mampu menampungnya.  Namun, YB menjadi ukuran penting untuk memperkirakan pertumbuhan Big Data, kebutuhan pusat data global, dan pelatihan model kecerdasan buatan (AI) di masa depan.  
                                    </li>
                                    <li className="sub-item">
                                        Perkembangan ukuran data digital dari terkecil hingga terbesar secara berurutan adalah: 
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Hubungan dengan bit: 1 byte = 8 bit (bit merupakan unit data terkecil yang hanya memiliki nilai 0 atau 1).
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan byte: 1 kilobyte (KB) = 1.024 byte.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan kilobyte (KB): 1 megabyte (MB) = 1.024 KB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan megabyte (MB): 1 gigabyte (GB) = 1.024 MB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan gigabyte (GB): 1 terabyte (TB) = 1.024 GB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan terabyte (TB): 1 petabyte (PB) = 1.024 TB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan petabyte (PB): 1 exabyte (EB) = 1.024 PB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan exabyte (EB): 1 zettabyte (ZB) = 1.024 EB.
                                        </li>
                                        <li className="sub-item">
                                            Hubungan dengan zettabyte (ZB): 1 yottabyte (YB) = 1.024 ZB.
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Di luar yottabyte, terdapat satuan hipotetis seperti brontobyte (1.024 YB) dan geopbyte (1.024 BB), namun satuan-satuan tersebut belum digunakan dalam standar industri saat ini. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan umum: Satuan penyimpanan data digunakan untuk mengukur kapasitas media digital seperti hard disk, SSD, flashdisk, memori komputer, serta ukuran file gambar, video, dokumen, dan aplikasi. Semakin besar satuannya, semakin besar pula kapasitas data yang dapat disimpan.
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