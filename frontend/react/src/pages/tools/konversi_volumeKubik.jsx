import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Latex } from "../../utils/autoLatex";
import '/main/base/tools.css';

// 🌟 AKURASI MATEMATIS: Faktor konversi berbasis satuan dasar Meter Kubik (m³) dengan skala kubik (turun tangga = dikali 1000)
const FAKTOR_KONVERSI_VOLUME = {
    kilometerkubik: 1000000000, // 10^9 m³
    hectometerkubik: 1000000,    // 10^6 m³
    decameterkubik: 1000,       // 10^3 m³
    meterkubik: 1,
    decimeterkubik: 0.001,      // Setara 1 Liter
    centimeterkubik: 0.000001,   // Setara 1 mL / cc
    millimeterkubik: 0.000000001 // 10^-9 m³
};

// 🌟 STRUKTUR DATA 7 OPSINYA SENPAI (Diselaraskan dengan ikon Font Awesome asli dari kode Anda)
const DAFTAR_SATUAN_VOLUME = [
    { id: 'kilometerkubik', label: 'Kilometer³ (km³)', icon: 'fa-cube' },
    { id: 'hectometerkubik', label: 'Hektometer³ (hm³)', icon: 'fa-cubes' },
    { id: 'decameterkubik', label: 'Dekameter³ (dam³)', icon: 'fa-boxes-stacked' },
    { id: 'meterkubik', label: 'Meter³ (m³)', icon: 'fa-box' },
    { id: 'decimeterkubik', label: 'Desimeter³ (dm³)', icon: 'fa-box-open' },
    { id: 'centimeterkubik', label: 'Sentimeter³ (cm³)', icon: 'fa-lines-leaning' },
    { id: 'millimeterkubik', label: 'Millimeter³ (mm³)', icon: 'fa-square-minus' }
];

export default function KalkulatorVolume() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('meterkubik'); // Default Meter³ agar mudah dipahami
    const [keSatuan, setKeSatuan] = useState('centimeterkubik');
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
    const opsiDariTerpilih = DAFTAR_SATUAN_VOLUME.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_VOLUME[3];
    const opsiKeTerpilih = DAFTAR_SATUAN_VOLUME.find(s => s.id === keSatuan) || DAFTAR_SATUAN_VOLUME[5];

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

    // Logika Hitung Konversi Volume (Real-time & Akurat)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam m³) / Faktor Tujuan dalam m³
        const nilaiDalamMeterKubik = nilaiAngka * FAKTOR_KONVERSI_VOLUME[dariSatuan];
        const hasilAkhir = nilaiDalamMeterKubik / FAKTOR_KONVERSI_VOLUME[keSatuan];

        // Memformat tampilan desimal atau notasi eksponensial jika angka terlalu ekstrem
        let hasilDiformat;
        if (hasilAkhir < 1e-4 || hasilAkhir > 1e14) {
            hasilDiformat = hasilAkhir.toExponential(6);
        } else {
            hasilDiformat = Number(hasilAkhir.toFixed(6)).toString();
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
                            <i className="fa-solid fa-box" style={{ marginRight: '10px' }}></i> 
                            Konversi Volume Kubik
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Volume" 
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
                                {DAFTAR_SATUAN_VOLUME.map((item) => (
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
                                {DAFTAR_SATUAN_VOLUME.map((item) => (
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
                SISTEM POPUP MODAL (PANDUAN UKURAN VOLUME TANGGA KUBIK)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Satuan Volume Kubik
                    </h3>
                    
                    <ul className="tool-list">
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-car"></i> Kilometer³ (km³)</span>
                            <div className="tool-text">
                                Kilometer kubik (km³) adalah satuan volume dalam sistem metrik yang menyatakan besaran ruang tiga dimensi dengan ukuran 1 kilometer × 1 kilometer × 1 kilometer. Satuan ini digunakan untuk mengukur volume benda yang sangat besar, seperti waduk, danau, atau massa geologis. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, karakteristik satuan ini meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Geometris: Merupakan volume kubus yang setiap rusuknya memiliki panjang 1 kilometer (1.000 meter). 
                                    </li>
                                    <li className="sub-item">
                                        Skala Konversi: Dalam tangga satuan volume metrik, km3 berada di posisi tertinggi. Setiap turun satu anak tangga, nilainya dikali 1.000, sehingga 1 km³ setara dengan 1.000 hm³
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Liter: Karena 1 m³ = 1.000 liter, maka 1 km³ setara dengan 1.000.000.000.000 liter (1 triliun liter) atau 1.000 kiloliter (kl) dalam skala besar, meskipun biasanya dikonversi langsung ke meter kubik atau desimeter kubik untuk perhitungan liter.
                                    </li>
                                    <li className="sub-item">
                                        Simbol Penulisan: Ditulis dengan pangkat 3 di sebelah kanan satuan panjang, yaitu km³
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bell-concierge"></i> Hektometer³ (hm³)</span>
                            <div className="tool-text">
                                Hektometer kubik (hm³) adalah satuan volume dalam sistem metrik yang setara dengan volume kubus dengan panjang sisi 100 meter. Satuan ini berada di posisi kedua dari atas dalam tangga konversi satuan volume kubik, tepat di bawah kilometer kubik (km³) dan di atas dekameter kubik (dam³). <br /><br />Secara kuantitatif, 1 hektometer kubik sama dengan 1.000.000 meter kubik (m³) atau setara dengan 1.000.000.000 liter.  Dalam tangga konversi satuan kubik, setiap penurunan satu anak tangga nilai dikali 1.000, sehingga 1 hm³ turun satu tingkat menjadi 1.000 dam³, dan turun dua tingkat menjadi 1.000.000 m³. Satuan ini umumnya digunakan untuk mengukur volume air yang sangat besar, seperti kapasitas waduk, danau, atau volume tanah dalam proyek konstruksi skala nasional.
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-map-location-dot"></i> Dekameter³ (dam³)</span>
                            <div className="tool-text">
                                Dekameter kubik adalah satuan volume dalam Sistem Internasional (SI) yang dilambangkan dengan dam³ (atau dam3). Satuan ini merupakan bagian dari tangga konversi satuan volume berbasis meter, di mana konversinya menggunakan faktor pengali atau pembagi 1.000 untuk setiap perpindahan satu anak tangga. 
                            </div>

                        <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, berikut adalah karakteristik dan hubungan Dekameter kubik dengan satuan lain:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Geometris: 1 dam³ adalah volume sebuah kubus yang memiliki panjang sisi 10 meter (karena 1 dekameter = 10 meter).  Perhitungannya adalah 10 \(\times 10 \times\) 10 = 1.000 meter kubik.
                                    </li>
                                
                                    <li className="sub-item">
                                        Posisi dalam Tangga Satuan: Urutan satuan volume dari terbesar ke terkecil adalah: kilometer kubik (km³), hektometer kubik (hm³), dekameter kubik (dam³), meter kubik (m³), desimeter kubik (dm³), sentimeter kubik (cm³), dan milimeter kubik (mm³).
                                    </li>

                                    <li className="sub-item">Konversi ke Satuan Lebih Besar:</li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Naik satu tangga ke hektometer kubik (hm³): dibagi 1.000.
                                        </li>
                                        <li className="sub-item">
                                            Naik dua tangga ke kilometer kubik (km³): dibagi 1.000.000.
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Konversi ke Satuan Lebih Kecil:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Turun satu tangga ke meter kubik (m³): dikali 1.000.
                                        </li>
                                        <li className="sub-item">
                                            Turun dua tangga ke desimeter kubik (dm³): dikali 1.000.000. 
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Secara ringkas, 1 dam³ sama dengan 1.000 m³.  Satuan ini sering digunakan untuk mengukur volume benda atau ruang yang cukup besar, seperti kapasitas tangki air industri, galian tanah, atau volume bangunan, sebelum dikonversi ke satuan yang lebih umum seperti meter kubik atau liter. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-cube"></i> Meter³ (m³)</span>
                            <div className="tool-text">
                                Meter kubik (simbol: m³), sering disebut sebagai kubik, adalah satuan resmi volume dalam Sistem Internasional (SI) yang didefinisikan sebagai volume ruang tiga dimensi berbentuk kubus dengan panjang sisi masing-masing 1 meter.  Secara matematis, satu meter kubik setara dengan hasil perkalian 1 meter × 1 meter × 1 meter, atau sama dengan 1.000.000 sentimeter kubik (cm³).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Dalam praktiknya, satuan ini memiliki konversi dan aplikasi utama sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Konversi ke Liter: 1 m³ setara dengan 1.000 liter, sehingga sering digunakan untuk mengukur kapasitas tangki air atau volume air dalam tagihan PDAM.
                                    </li>
                                    <li className="sub-item">
                                        Konversi ke Centimeter: Karena melibatkan tiga dimensi, 1 m³ = 100 cm × 100 cm × 100 cm = 1.000.000 cm³. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Industri: Satuan ini vital dalam logistik dan pengiriman barang (sering disebut CBM atau Cubic Meter) untuk menghitung biaya pengiriman berdasarkan ruang yang ditempati, serta dalam konstruksi untuk mengukur volume material seperti beton, pasir, dan kayu.
                                    </li>
                                    <li className="sub-item">
                                        Perbedaan dengan Meter Persegi: Meter kubik mengukur volume (panjang × lebar × tinggi), berbeda dengan meter persegi (m²) yang hanya mengukur luas permukaan (2 dimensi).
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-cube"></i> Desimeter³ (dm³)</span>
                            <div className="tool-text">
                                Desimeter kubik (disingkat dm³) adalah satuan volume dalam sistem metrik yang setara dengan 1 liter.  Satuan ini merupakan turunan dari meter kubik (m³) dalam tangga satuan volume, di mana 1 m³ = 1.000 dm³. <br /><br />Secara definisi geometris, satu desimeter kubik adalah volume dari sebuah kubus yang memiliki panjang sisi 1 desimeter atau 10 sentimeter.  Perhitungannya adalah: 1 dm × 1 dm × 1 dm = 1 dm 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Karena kesetaraannya dengan liter, 1 dm³ juga sama dengan:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1.000 sentimeter kubik (cm³) atau mililiter (ml).
                                    </li>
                                    <li className="sub-item">
                                        0,001 meter kubik (m³).
                                    </li>
                                    <li className="sub-item">
                                        Dalam konteks konversi satuan volume, dm³ berfungsi sebagai jembatan antara satuan internasional (kubik) dan satuan yang umum digunakan untuk cairan (liter). Setiap kali turun satu tangga dari meter kubik ke desimeter kubik, nilai dikalikan 1.000.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-cube"></i> Sentimeter³ (cm³)</span>
                            <div className="tool-text">
                                Sentimeter kubik (cm³) adalah satuan volume dalam sistem metrik yang didefinisikan sebagai volume dari sebuah kubus dengan panjang sisi 1 sentimeter.  Secara kuantitatif, 1 cm³ setara dengan 1 mililiter (mL) atau 0,001 liter. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail konversi dan penggunaannya:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Konversi ke Meter Kubik: Karena 1 meter = 100 cm, maka 1 m³ = 100 × 100 × 100 cm³ = 1.000.000 cm³.
                                    </li>
                                    <li className="sub-item">
                                        Konversi ke Liter: 1 liter = 1.000 cm³. 
                                    </li>
                                    <li className="sub-item">
                                        Simbol Lain: Dalam konteks industri otomotif dan medis, sentimeter kubik sering disebut sebagai CC (cubic centimeter), yang biasa digunakan untuk mengukur kapasitas mesin kendaraan atau volume cairan infus. 
                                    </li>
                                    <li className="sub-item">
                                        Rumus Dasar: Volume dalam cm³ dihitung dengan mengalikan panjang, lebar, dan tinggi dalam satuan cm ( <span className="latex-auto">V=p×l×t</span> ).
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-cube"></i> Milimeter³ (mm³)</span>
                            <div className="tool-text">
                                Milimeter kubik (simbol: mm³) adalah satuan volume dalam sistem metrik yang didefinisikan sebagai volume dari sebuah kubus dengan panjang sisi 1 milimeter.  Satuan ini merupakan bagian dari turunan satuan meter kubik <span className="latex-auto">($m^3$)</span> dalam Sistem Internasional (SI) dan digunakan untuk mengukur volume benda yang sangat kecil, seperti dalam aplikasi medis atau kimia mikro. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara matematis, hubungan konversi milimeter kubik dengan satuan lainnya adalah sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan Meter Kubik:{" "}<Latex>{"1\\text{m}^{3}=10^{9}\\text{mm}^{3}"}</Latex>{" "}(atau 1.000.000.000 mm³). Sebaliknya,{" "}<Latex>{"1\\text{mm}^{3}=10^{-9}\\text{m}^{3}"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Sentimeter Kubik: Karena setiap satu tingkat turun dalam tangga satuan kubik dikalikan 1.000, maka{" "}
                                        <Latex>
                                            {"1\\mathrm{cm}^{3}=1000\\mathrm{mm}^{3}"}
                                        </Latex>
                                        .
                                    </li>

                                    <li className="sub-item">
                                        Hubungan dengan Mililiter: Dalam konteks cairan,{" "}
                                        <Latex>
                                            {"1\\mathrm{mm}^{3}"}
                                        </Latex>
                                        {" "}setara dengan{" "}
                                        <Latex>
                                            {"1\\mu\\mathrm{L}"}
                                        </Latex>
                                        {" "}atau{" "}
                                        <Latex>
                                            {"0.001\\mathrm{mL}"}
                                        </Latex>
                                        .
                                    </li>

                                    <p>
                                        Aturan konversi utama dalam satuan volume kubik adalah:
                                    </p>

                                    <li className="sub-item">
                                        Menurun satu anak tangga (misalnya dari{" "}
                                        <Latex>
                                            {"\\mathrm{m}^{3}"}
                                        </Latex>
                                        {" "}ke{" "}
                                        <Latex>
                                            {"\\mathrm{dm}^{3}"}
                                        </Latex>
                                        ) dikalikan 1.000.
                                    </li>

                                    <li className="sub-item">
                                        Naik satu anak tangga (misalnya dari{" "}
                                        <Latex>
                                            {"\\mathrm{mm}^{3}"}
                                        </Latex>
                                        {" "}ke{" "}
                                        <Latex>
                                            {"\\mathrm{cm}^{3}"}
                                        </Latex>
                                        ) dibagi 1.000.
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