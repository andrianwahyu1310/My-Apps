import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Latex } from "../../utils/autoLatex";
import '/main/base/tools.css'; // Menggunakan CSS global yang sudah kita rapikan

// 🌟 AKURASI TINGGI: Faktor konversi berbasis satuan Gram (g)
const FAKTOR_KONVERSI = {
    kilogram: 1000,
    hectogram: 100,
    decagram: 10,
    gram: 1,
    decigram: 0.1,
    centigram: 0.01,
    ton: 1000000,
    kuintal: 100000,
    pon: 500,            // Pon lokal Indonesia = 500g
    onslokal: 100,       // Ons lokal Indonesia = 100g
    pounds: 453.59237,   // 1 lb (Pound Imperial) = 453.59237g
    ounce: 28.349523125, // 1 oz (Ounce Imperial) = 28.349523125g
    stone: 6350.29318    // 1 st (Stone Imperial) = 6350.29318g
};

// 🌟 STRUKTUR DATA 13 OPSINYA (Diselaraskan dengan ikon Font Awesome asli)
const DAFTAR_SATUAN = [
    { id: 'kilogram', label: 'Kilogram (kg)', icon: 'fa-weight-hanging' },
    { id: 'hectogram', label: 'Hektogram / Ons (hg)', icon: 'fa-weight-hanging' },
    { id: 'decagram', label: 'Dekagram (dag)', icon: 'fa-scale-balanced' },
    { id: 'gram', label: 'Gram (g)', icon: 'fa-scale-balanced' },
    { id: 'decigram', label: 'Desigram (dg)', icon: 'fa-scale-balanced' },
    { id: 'centigram', label: 'Sentigram (cg)', icon: 'fa-scale-balanced' },
    { id: 'ton', label: 'Ton (t)', icon: 'fa-truck-ramp-box' },
    { id: 'kuintal', label: 'Kuintal (q)', icon: 'fa-weight-hanging' },
    { id: 'pon', label: 'Pon (lbs lokal)', icon: 'fa-scale-balanced' },
    { id: 'onslokal', label: 'Ons Lokal (ons)', icon: 'fa-weight-hanging' },
    { id: 'pounds', label: 'Pounds (lb)', icon: 'fa-weight-hanging' },
    { id: 'ounce', label: 'Ounce / Ons Imperial (oz)', icon: 'fa-scale-balanced' },
    { id: 'stone', label: 'Stone (st)', icon: 'fa-gem' }
];

export default function KalkulatorBerat() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('kilogram');
    const [keSatuan, setKeSatuan] = useState('gram');
    const [hasilKonversi, setHasilKonversi] = useState('');

    // State Kendali Dropdown Melayang
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);

    // State untuk Popup Dokumentasi
    const [isModalActive, setIsModalActive] = useState(false);

    // 🌟 STRATEGI REF: Mengunci koordinat fisik elemen agar sistem tahu batas area box
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    // Identifikasi Pilihan Aktif untuk Tampilan Label Dropdown
    const opsiDariTerpilih = DAFTAR_SATUAN.find(s => s.id === dariSatuan) || DAFTAR_SATUAN[0];
    const opsiKeTerpilih = DAFTAR_SATUAN.find(s => s.id === keSatuan) || DAFTAR_SATUAN[3];

    // Logika Hitung Konversi (Sistem Pengali dan Pembagi Presisi)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam Gram) / Faktor Tujuan dalam Gram
        const nilaiDalamGram = nilaiAngka * FAKTOR_KONVERSI[dariSatuan];
        const hasilAkhir = nilaiDalamGram / FAKTOR_KONVERSI[keSatuan];

        // Format hasil akhir agar jika ada desimal panjang tidak merusak kotak hasil
        const hasilDiformat = Number(hasilAkhir.toFixed(6)).toString();

        // Ambil teks label singkat (misalnya "Kilogram (kg)" -> "kg") untuk penanda hasil
        const simbolSatuan = opsiKeTerpilih.label.match(/\(([^)]+)\)/)?.[1] || '';
        setHasilKonversi(`Hasil: ${hasilDiformat} ${simbolSatuan}`);
    };

    // 🌟 PERTAHANAN GLOBAL: Efek pemantau klik di luar elemen
    useEffect(() => {
        const tanganiKlikLuar = (event) => {
            // 1. Jika dropdown 'Dari' terbuka DAN yang diklik bukan area dropdown tersebut, maka tutup
            if (bukaDariDropdown && refDropdownDari.current && !refDropdownDari.current.contains(event.target)) {
                setBukaDariDropdown(false);
            }
            // 2. Jika dropdown 'Ke' terbuka DAN yang diklik bukan area dropdown tersebut, maka tutup
            if (bukaKeDropdown && refDropdownKe.current && !refDropdownKe.current.contains(event.target)) {
                setBukaKeDropdown(false);
            }
            // 3. Jika modal aktif DAN yang diklik adalah overlay hitamnya (di luar kotak putih .desc-tool), maka tutup
            if (isModalActive && refKontenModal.current && !refKontenModal.current.contains(event.target)) {
                setIsModalActive(false);
            }
        };

        // Daftarkan event listener ke browser
        document.addEventListener('pointerdown', tanganiKlikLuar);
        
        // Membersihkan event listener saat komponen hancur/unmount (mencegah kebocoran memori)
        return () => {
            document.removeEventListener('pointerdown', tanganiKlikLuar);
        };
    }, [bukaDariDropdown, bukaKeDropdown, isModalActive]);

    // Efek Otomatis: Hitung langsung berjalan secara real-time tanpa klik tombol jika ada perubahan input
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
                            <i className="fa-solid fa-weight-hanging" style={{ marginRight: '10px' }}></i>
                            Konversi Berat & Massa
                        </h2>
                        <button
                            className="btn-info-popup"
                            title="Buka Panduan Satuan"
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
                    <div className="form-group" ref={refDropdownDari} style={{ position: 'relative' }}>
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
                                {DAFTAR_SATUAN.map((item) => (
                                    <div
                                        key={`dari-${item.id}`}
                                        className={`option-item ${dariSatuan === item.id ? 'active' : ''}`}
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
                    <div className="form-group" ref={refDropdownKe} style={{ position: 'relative' }}>
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
                                {DAFTAR_SATUAN.map((item) => (
                                    <div
                                        key={`ke-${item.id}`}
                                        className={`option-item ${keSatuan === item.id ? 'active' : ''}`}
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

                    {/* TOMBOL PICU HITUNG MANUAL */}
                    <button className="btn-hitung" onClick={hitungKonversi}>
                        Hitung Konversi
                    </button>

                    {/* TAMPILAN OUTPUT HASIL */}
                    <div className="result-box" aria-live="polite">
                        {hasilKonversi}
                    </div>
                </div>
            </div>

            {/* =========================================================
                SISTEM POPUP MODAL (DOKUMENTASI PANDUAN SATUAN)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Satuan Massa & Berat
                    </h3>

                    <ul className="tool-list">

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Kilogram \((kg)\)</span>
                        <div className="tool-text">
                            Kilogram adalah satuan dasar standar internasional (SI) untuk massa (dalam kehidupan sehari-hari sering disebut sebagai satuan berat).  Secara teknis, massa adalah jumlah materi dalam benda yang nilainya tetap di mana pun, sedangkan berat adalah gaya gravitasi yang bekerja pada benda tersebut.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah detail mengenai kilogram:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Definisi Modern: Sejak 2019, kilogram tidak lagi didefinisikan berdasarkan artefak fisik (silinder platina-iridium di Paris), melainkan berdasarkan konstanta alam dan sifat atomik (konstanta Planck) untuk ketelitian yang lebih tinggi.
                                </li>
                                <li className="sub-item">Konversi ke Satuan Lain:</li>

                                <div className="sub-list-under">
                                    <li className="sub-item">1 kilogram = 1.000 gram</li>
                                    <li className="sub-item">1 kilogram = 10 hektogram (hg) atau 10 ons</li>
                                    <li className="sub-item">1 kilogram = 0,001 ton</li>
                                    <li className="sub-item">1 μm = 1000 nm (seribu nanometer)</li>
                                </div>

                                <li className="sub-item">
                                    Hubungan dengan Berat: Dalam fisika, berat \((W)\) dihitung dengan rumus \(W=m×g\) (massa dikali percepatan gravitasi). Sebagai contoh, benda bermassa 1 kg memiliki berat sekitar 9,8 Newton di Bumi, tetapi beratnya akan berbeda di Bulan karena gravitasi yang lebih lemah, meskipun massanya tetap 1 kg.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Hektogram \((hg)\)</span>
                        <div className="tool-text">
                            Hektogram \((hg)\) adalah satuan ukuran berat (massa) dalam sistem metrik yang setara dengan 100 gram atau 0,1 kilogram.  Dalam konteks pengukuran sehari-hari di Indonesia, hektogram secara resmi dikenal sebagai ons, sehingga 1 hektogram = 1 ons.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Secara detail, berikut adalah karakteristik dan konversi hektogram:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Definisi Dasar: Hektogram merupakan kelipatan kedua dari gram dan subkelipatan pertama dari kilogram. Simbol yang digunakan adalah hg.
                                </li>
                                <li className="sub-item">Konversi ke Satuan Lain:</li>

                                <div className="sub-list-under">
                                    <li className="sub-item">1 hg = 100 gram (g)</li>
                                    <li className="sub-item">1 hg = 0,1 kilogram (kg)</li>
                                    <li className="sub-item">1 hg = 10 dekagram (dag)</li>
                                    <li className="sub-item">1 kg = 10 hg</li>
                                    <li className="sub-item">1 ton (metrik) = 10.000 hg</li>
                                </div>

                                <li className="sub-item">
                                    Perbedaan dengan Ons Internasional: Penting untuk membedakan antara ons metrik Indonesia dengan ounce internasional. Ons (hg) di Indonesia setara dengan 100 gram, sedangkan ounce (oz) dalam sistem imperial setara dengan sekitar 28,35 gram.
                                </li>
                                <li className="sub-item">
                                    Posisi dalam Tangga Satuan Berat: Urutan satuan berat dari terbesar ke terkecil adalah Kilogram (kg) → Hektogram (hg) → Dekagram (dag) → Gram (g) → Desigram (dg) → Sentigram (cg) → Miligram (mg).  Setiap turun satu tangga dikalikan 10, dan setiap naik satu tangga dibagi 10.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Dekagram (dag)</span>
                        <div className="tool-text">
                            Dekagram (disingkat dag) adalah satuan ukuran berat atau massa yang setara dengan 10 gram atau 0,01 kilogram.  Secara etimologi, kata ini berasal dari gabungan awalan "deka" yang berarti sepuluh dan "gram".
                        </div>

                    <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah rincian detail mengenai dekagram:</span>
                            <ul className="sub-list">
                                <li className="sub-item">Kesetaraan Nilai:</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">1 dag = 10 gram</li>
                                    <li className="sub-item">1 dag = 0,01 kilogram</li>
                                    <li className="sub-item">1 kilogram = 100 dekagram</li>
                                </div>

                                <li className="sub-item">
                                    Posisi dalam Tangga Satuan: Dalam tangga satuan berat metrik, dekagram berada tepat di bawah hektogram (hg/ons) dan di atas gram (g).
                                </li>

                                <li className="sub-item">Cara Konversi:</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Untuk mengubah dekagram ke satuan lebih besar (naik tangga), bagi dengan 10. Contoh: 50 dag = 5 hg.
                                    </li>
                                    <li className="sub-item">
                                        Untuk mengubah dekagram ke satuan lebih kecil (turun tangga), kalikan dengan 10. Contoh: 5 dag = 50 gram.
                                    </li>
                                </div>

                                <li className="sub-item">
                                    Penggunaan: Satuan ini kurang umum digunakan dalam perdagangan sehari-hari di Indonesia dibandingkan kilogram, ons, atau gram, namun tetap menjadi bagian standar dari sistem metrik dalam pendidikan matematika dan ilmu pengetahuan.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Gram (g)</span>
                        <div className="tool-text">
                            Gram (simbol: g) adalah satuan metrik untuk massa dan merupakan bagian dari Sistem Internasional (SI), di mana 1 gram sama dengan seperseribu kilogram{" "}<Latex>{"1 g = 10^-3 kg"}</Latex>.

                            <br /><br />

                            Secara historis, definisi awal gram adalah berat volume air murni yang setara dengan kubus sisi 1 cm pada suhu es mencair, namun definisi modernnya mengacu pada konstanta Planck{" "}<Latex>{"6.62607015 \\times 10^{-34} \\text{ kg}\\cdot\\text{m}^2\\cdot\\text{s}^{-1}"}</Latex>{" "}yang ditetapkan oleh Biro Internasional untuk Ukuran dan Timbangan.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Dalam penggunaan sehari-hari dan akademis:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Konteks Umum: Digunakan untuk mengukur benda ringan seperti emas, bahan makanan, atau obat-obatan.
                                </li>
                                <li className="sub-item">
                                    Penulisan: Dalam teks formal atau akademis, disarankan menulis lengkap "gram" pada kalimat pertama, kemudian menggunakan singkatan "g" pada kalimat berikutnya tanpa spasi antara angka dan satuan (contoh: 100g).
                                </li>
                                <li className="sub-item">Konversi: 1 ons setara dengan 100 gram atau 0,1 kilogram.</li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Desigram (dg)</span>
                        <div className="tool-text">
                            Desigram (dg) adalah satuan massa (berat dalam penggunaan sehari-hari) dalam sistem metrik yang nilainya sepersepuluh gram. Awalan desi- (deci-) berarti 1/10 atau 0,1.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Secara detail, berikut adalah penjelasan mengenai satuan ini:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Posisi dalam Tangga Satuan: Desigram berada di bawah gram (g) dan di atas sentigram (cg).  Urutan utamanya adalah kilogram (kg), hektogram (hg), dekagram (dag), gram (g), desigram (dg), sentigram (cg), dan miligram (mg).
                                </li>
                                <li className="sub-item">Nilai Konversi:</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        1 desigram (dg) sama dengan 0,1 gram atau 1/10 gram.
                                    </li>
                                    <li className="sub-item">
                                        Untuk mengubah dari gram ke desigram (turun satu tangga), kalikan dengan 10.
                                    </li>
                                    <li className="sub-item">
                                        Untuk mengubah dari desigram ke kilogram (naik tiga tangga), bagi dengan 1.000.
                                    </li>
                                </div>

                                <li className="sub-item">
                                    Penggunaan: Satuan ini jarang digunakan dalam kehidupan sehari-hari dibandingkan gram atau kilogram, namun sering muncul dalam konteks ilmiah, laboratorium, atau soal matematika untuk melatih konversi satuan yang presisi.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Sentigram (cg)</span>
                        <div className="tool-text">
                            Sentigram (cg) adalah satuan massa dalam sistem metrik yang digunakan untuk menyatakan massa yang lebih kecil dari gram. Kata senti- (centi-) berasal dari bahasa Latin centum yang berarti seratus. Dalam sistem SI, awalan centi- berarti 1/100 atau 0,01 dari satuan dasar.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah rincian detail mengenai sentigram:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Posisi dalam Tangga Satuan: Sentigram berada di bawah gram dan di atas miligram. Urutan satuannya dari yang lebih besar ke lebih kecil adalah: Gram (g) → Desigram (dg) → Sentigram (cg) → Miligram (mg).
                                </li>

                                <li className="sub-item">Konversi:</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                       1 gram = 100 sentigram.
                                    </li>
                                    <li className="sub-item">
                                        1 sentigram = 0,01 gram.
                                    </li>
                                    <li className="sub-item">
                                        1 sentigram = 10 miligram.
                                    </li>
                                    <li className="sub-item">1 kilogram = 100.000 sentigram.</li>
                                </div>

                                <li className="sub-item">
                                    Penggunaan: Satuan ini umumnya digunakan untuk mengukur benda-benda yang sangat ringan namun lebih besar dari miligram, seperti dosis obat tertentu, bahan kimia laboratorium, atau komponen elektronik kecil.
                                </li>
                                <li className="sub-item">
                                    Definisi Resmi: Menurut Kamus Besar Bahasa Indonesia (KBBI), sentigram didefinisikan sebagai satuan ukuran berat dengan nilai 0,01 gram.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-regular fa-cube"></i> Ton (t)</span>
                        <div className="tool-text">
                            Kilometer (disingkat km) adalah satuan panjang dalam sistem metrik yang setara dengan 1.000 meter. Satuan ini umumnya digunakan untuk mengukur jarak yang jauh antara dua lokasi, seperti jarak antar kota atau panjang perjalanan. Alat ukur yang paling umum digunakan untuk melihat skala sentimeter secara langsung adalah penggaris biasa, meteran kain, atau pita ukur.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Secara rinci, berikut adalah penjelasan lengkap mengenai satuan ton:</span>
                            <ul className="sub-list">
                                <p>1. Konversi Dasar Satuan Ton</p>
                                <p>
                                    Satuan ton memiliki hubungan langsung dengan satuan berat lainnya dalam tangga satuan berat. Berikut adalah konversi utamanya:
                                </p>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        1 Ton = 1.000 Kilogram (kg)
                                    </li>
                                    <li className="sub-item">
                                        1 Ton = 10 Kuintal
                                    </li>
                                    <li className="sub-item">
                                        1 Ton = 1.000.000 Gram
                                    </li>
                                    <li className="sub-item">
                                        1 Ton = 2.000 Pon (karena 1 kg = 2 pon)
                                    </li>
                                    <li className="sub-item">
                                        1 Ton = 10.000 Ons (karena 1 kg = 10 ons)
                                    </li>
                                </div>

                                <p>2. Variasi Satuan Ton di Dunia</p>
                                <p>
                                    Meskipun ton metrik (1.000 kg) adalah standar umum, terdapat variasi ton yang digunakan di negara tertentu:
                                </p>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Ton Metrik (Tonne): Digunakan secara internasional dan di Indonesia. 1 ton metrik = 1.000 kg.
                                    </li>
                                    <li className="sub-item">
                                        Short Ton (Ton Pendek): Digunakan di Amerika Serikat. 1 short ton ≈ 907 kg (2.000 pon).
                                    </li>
                                    <li className="sub-item">
                                        Long Ton (Ton Panjang): Digunakan di Britania Raya (Imperial). 1 long ton ≈ 1.016 kg (2.240 pon).
                                    </li>
                                </div>

                                <p>3. Penggunaan dalam Kehidupan Sehari-hari</p>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Logistik & Konstruksi: Ton sering digunakan untuk menghitung muatan truk, kapasitas angkut kontainer, atau berat material curah seperti pasir, besi, dan batu bara.
                                    </li>
                                    <li className="sub-item">
                                        Perdagangan: Digunakan untuk transaksi barang dalam jumlah besar seperti beras, gula, atau hasil pertanian lainnya.
                                    </li>
                                    <li className="sub-item">
                                        Energi: Satuan "Ton TNT" digunakan untuk mengukur daya ledak bom nuklir atau kekuatan gempa bumi (1 Ton TNT = 4,184 Gigajoule).
                                    </li>
                                </div>

                                <p>4. Cara Menghitung Konversi Ton</p>
                                <p>
                                    Untuk mengonversi ton ke satuan yang lebih kecil, kalikan dengan faktor konversi. Sebaliknya, bagi dengan faktor tersebut untuk ke satuan yang lebih besar.
                                </p>

                                <li className="sub-item">Rumus Ton ke Kg: \(Berat (kg)=Ton×1.000\)</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Contoh: 2,5 ton = \(2,5×1.000=2.500 kg\).
                                    </li>
                                </div>

                                <li className="sub-item">Rumus Ton ke Kuintal: \(Berat (kuintal)=Ton×10\)</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Contoh: 3 ton = \(3×10=30\) kuintal.
                                    </li>
                                </div>

                                <li className="sub-item">Rumus Kg ke Ton: \(Berat (ton)=Berat (kg):1.000\)</li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Contoh: 5.000 kg = \(5.000:1.000=5\) ton.
                                    </li>
                                </div>

                                <p>5. Perbedaan Ton dan Kubik (m³)</p>
                                <p>
                                    Ton adalah satuan berat/massa, sedangkan kubik (m³) adalah satuan volume.  Keduanya tidak bisa dikonversi langsung tanpa mengetahui massa jenis (densitas) materialnya.
                                </p>
                                <li className="sub-item">
                                    Air: 1 ton = 1 m³ (karena massa jenis air adalah 1.000 kg/m³)
                                </li>
                                <li className="sub-item">
                                    Pasir: 1 ton ≈ 0,67 m³ (karena pasir lebih berat dari air, volumenya lebih kecil untuk berat yang sama).
                                </li>
                                <li className="sub-item">
                                    Kayu: 1 ton ≈ 1,43 m³ (karena kayu lebih ringan, volumenya lebih besar).
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Kuintal (q)</span>
                        <div className="tool-text">
                            Kuintal adalah satuan ukuran berat atau massa yang setara dengan 100 kilogram (kg) dalam sistem metrik yang digunakan di Indonesia. Satuan ini sering disebut juga sebagai centner atau quintal dan merupakan unit standar dalam perdagangan komoditas besar, seperti hasil pertanian (beras, jagung, kopi) dan bahan baku industri (besi, baja), karena nilainya yang lebih besar daripada kilogram namun lebih kecil daripada ton.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah detail mengenai kuintal:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Konversi Dasar: 1 kuintal = 100 kg.  Sebaliknya, 1 kg = 0,01 kuintal
                                </li>
                                <li className="sub-item">
                                    Hubungan dengan Ton: Dalam sistem metrik, 1 ton = 10 kuintal (karena 1 ton = 1.000 kg).
                                </li>
                                <li className="sub-item">
                                    Rumus Konversi: Untuk mengubah kuintal ke kilogram, kalikan jumlah kuintal dengan 100 ( Berat (kg)=Jumlah kuintal×100 ). Sebaliknya, untuk mengubah kilogram ke kuintal, bagi jumlah kilogram dengan 100.
                                </li>
                                <li className="sub-item">
                                    Konteks Internasional: Istilah yang setara di negara berbahasa Inggris adalah hundredweight. Namun, nilainya berbeda tergantung sistem:
                                </li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        Metrik (Indonesia/Eropa): 100 kg.
                                    </li>
                                    <li className="sub-item">
                                        Imperial (Inggris): ~50,8 kg (112 pon).
                                    </li>
                                    <li className="sub-item">
                                        AS (Short Hundredweight): ~45,36 kg (100 pon).
                                    </li>
                                </div>

                                <li className="sub-item">
                                    Lambang: Tidak memiliki lambang internasional baku yang unik seperti "kg" atau "m", namun dalam konteks Indonesia sering disingkat atau ditulis sebagai qt atau cwt (hundredweight), meskipun penulisan "kuintal" atau "kwintal" lebih umum digunakan dalam teks.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Pon (lbs)</span>
                        <div className="tool-text">
                            Pon adalah satuan ukuran berat yang umum digunakan dalam kehidupan sehari-hari di Indonesia, yang secara resmi setara dengan 500 gram atau 0,5 kilogram.  Dalam konversi satuan berat baku, 1 pon sama dengan 5 ons (karena 1 ons = 100 gram), sehingga 1 kilogram setara dengan 2 pon.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Secara detail, perbedaan pon lokal dengan standar internasional adalah sebagai berikut:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Definisi Lokal: Di Indonesia, pon didefinisikan sebagai setengah kilogram (500 gram). Satuan ini sering digunakan dalam transaksi pasar tradisional atau pengukuran bahan makanan sederhana.
                                </li>
                                <li className="sub-item">
                                    Definisi Internasional (Pound/Lb): Satuan internasional pound (disingkat lb) setara dengan 453,59 gram atau 0,4536 kilogram.
                                </li>
                                <li className="sub-item">
                                    Perbedaan Nilai: Pon lokal lebih berat sekitar 46,4 gram dibandingkan dengan pon (pound) internasional.
                                </li>
                                <li className="sub-item">
                                    Konteks Penggunaan: Pon lokal adalah bagian dari sistem metrik yang disederhanakan untuk kemudahan perhitungan di pasar, sedangkan pound adalah satuan dalam sistem imperial yang digunakan di negara seperti Amerika Serikat dan Inggris.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Ons (ons)</span>
                        <div className="tool-text">
                            Ons adalah satuan berat tradisional yang umum digunakan di Indonesia, setara dengan 100 gram atau 0,1 kilogram.  Satuan ini diadopsi dari sistem metrik Belanda pada tahun 1820 dan secara resmi dalam sistem metrik dikenal sebagai hektogram (hg).
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Detail Satuan Ons Lokal:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Konversi Dasar: 1 ons = 100 gram = 10 dekagram = 1000 desigram.
                                </li>
                                <li className="sub-item">
                                    Hubungan dengan Kilogram: 1 kilogram = 10 ons.
                                </li>
                                <li className="sub-item">
                                    Perbedaan dengan Ons Internasional: Ons internasional (ounce/oz) setara dengan sekitar 28,35 gram, sedangkan ons lokal (Dutch Ounce) tetap pada 100 gram untuk kemudahan perhitungan desimal.
                                </li>
                                <li className="sub-item">
                                    Penggunaan: Sering dipakai dalam perdagangan pasar tradisional, dapur rumah tangga, dan pelajaran matematika SD di Indonesia untuk benda dengan berat ringan hingga sedang.
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Pounds (lb)</span>
                        <div className="tool-text">
                            Pound (disingkat lb atau lbs) adalah satuan massa atau berat dalam sistem imperial yang umum digunakan di Amerika Serikat, Inggris, dan Kanada.  Secara teknis, 1 pound setara dengan 0,45359237 kilogram (atau sekitar 453,59 gram) dan terdiri dari 16 ounce (oz).
                        </div>


                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah detail spesifik mengenai satuan ini:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Asal Usul Nama: Singkatan lb berasal dari kata Latin "libra pondo" yang berarti "berat satu pound".  Huruf lb diambil dari kata libra (yang juga menjadi nama zodiak Libra dan simbol timbangan), sementara tambahan s pada lbs hanya menandakan bentuk jamak dalam bahasa Inggris.
                                </li>
                                <li className="sub-item">
                                    Standar Internasional: Definisi modern yang paling umum adalah avoirdupois pound, yang disepakati oleh AS dan negara-negara Persemakmuran pada tahun 1958 sebagai tepat 453,59237 gram.
                                </li>
                                <li className="sub-item">
                                    Penggunaan Sehari-hari: Satuan ini sering muncul dalam spesifikasi produk elektronik, pengiriman barang internasional, data berat badan di gym, dan industri manufaktur.
                                </li>

                                <li className="sub-item">
                                    Konversi Cepat:
                                </li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        1 lb ≈ 0,4536 kg
                                    </li>
                                    <li className="sub-item">
                                        1 kg ≈ 2,2046 lbs
                                    </li>
                                    <li className="sub-item">
                                        1 lb = 16 oz
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-scale-balanced"></i> Ounce (oz)</span>
                        <div className="tool-text">
                            Dalam sistem imperial dan AS, ounce (singkatan oz) adalah satuan berat yang memiliki definisi berbeda tergantung pada jenis barang yang diukur, dengan dua variasi utama: avoirdupois ounce dan troy ounce.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah detailnya:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Avoirdupois Ounce: Digunakan untuk mengukur barang sehari-hari seperti makanan dan barang umum. Satu ounce avoirdupois setara dengan 28,3495231 gram (sering dibulatkan menjadi 28,35 gram atau 28,3 gram).
                                </li>
                                <li className="sub-item">
                                    Troy Ounce: Digunakan khusus untuk mengukur logam mulia dan permata seperti emas dan perak. Satu troy ounce lebih berat, setara dengan 31,1 gram.
                                </li>
                                <li className="sub-item">
                                    Penggunaan Sehari-hari: Satuan ini sering muncul dalam spesifikasi produk elektronik, pengiriman barang internasional, data berat badan di gym, dan industri manufaktur.
                                </li>

                                <p>
                                    Perbedaan ini penting karena ounce standar (28,35 gram) tidak boleh dipertukarkan secara langsung dengan troy ounce (31,1 gram) dalam perdagangan logam mulia, meskipun keduanya menggunakan satuan "ounce".
                                </p>
                            </ul>
                        </div>
                    </li>

                    <li className="tool-item">
                        <span className="tool-label"><i className="fa-solid fa-cloud-sun"></i> Stone (st)</span>
                        <div className="tool-text">
                            Stone adalah satuan berat dalam sistem imperial yang setara dengan 14 pound (sekitar 6,35 kilogram).  Satuan ini secara tidak resmi masih digunakan di Inggris dan Irlandia untuk menyatakan berat badan manusia, dengan format umum seperti "12 st 6 lbs", meskipun tidak diakui sebagai unit resmi sejak tahun 1985. <br /><br />Secara historis, nama "stone" berasal dari penggunaan batu sebagai alat ukur berat ribuan tahun lalu. Pada tahun 1389, Inggris menetapkan satu stone wol setara dengan 14 pound, standar yang kemudian diterima secara luas. Dalam struktur imperial, stone berfungsi sebagai unit dasar di mana 2 stone sama dengan 1 quarter, 8 stone sama dengan 1 hundredweight (cwt), dan 160 stone sama dengan 1 long ton.
                        </div>

                        <div className="sub-info-box">
                            <span className="sub-info-title">Berikut adalah detail konversi dan struktur stone:</span>
                            <ul className="sub-list">
                                <li className="sub-item">
                                    Definisi Dasar: 1 stone = 14 pound (lbs) = 6,35029 kilogram.
                                </li>
                                <li className="sub-item">
                                    Penggunaan: Khusus untuk berat badan di Britania Raya dan Irlandia; jarang digunakan di Amerika Serikat yang lebih sering memakai pound.

                                </li>
                                <li className="sub-item">
                                    Hubungan Satuan Imperial:
                                </li>
                                <div className="sub-list-under">
                                    <li className="sub-item">
                                        1 stone = 14 lbs
                                    </li>
                                    <li className="sub-item">
                                        1 quarter = 2 stone (28 lbs)
                                    </li>
                                    <li className="sub-item">
                                        1 hundredweight (long) = 8 stone (112 lbs)
                                    </li>
                                    <li className="sub-item">
                                         long ton = 160 stone (2.240 lbs)
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </li>
                </ul>
                </div>
            </div>
        </>
    );
}