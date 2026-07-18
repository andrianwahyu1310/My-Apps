import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 AKURASI MATEMATIS: Faktor konversi berbasis satuan dasar Meter Persegi (m²) dengan skala kuadrat (turun tangga = dikali 100)
const FAKTOR_KONVERSI_LUAS = {
    kilometerpersegi: 1000000,
    hectometerpersegi: 10000,   // 1 HM² = 1 Hektar (ha) = 10.000 m²
    decameterpersegi: 100,      // 1 DAM² = 1 Are (a) = 100 m²
    meterpersegi: 1,
    decimeterpersegi: 0.01,
    centimeterpersegi: 0.0001,
    millimeterpersegi: 0.000001
};

// 🌟 STRUKTUR DATA 7 OPSINYA SENPAI (Diselaraskan dengan ikon Font Awesome asli dari kode Anda)
const DAFTAR_SATUAN_LUAS = [
    { id: 'kilometerpersegi', label: 'KM² (km²)', icon: 'fa-chart-area' },
    { id: 'hectometerpersegi', label: 'HM² / Hektar (ha)', icon: 'fa-layer-group' },
    { id: 'decameterpersegi', label: 'DAM² / Are (a)', icon: 'fa-border-all' },
    { id: 'meterpersegi', label: 'Meter² (m²)', icon: 'fa-square' },
    { id: 'decimeterpersegi', label: 'DM² (dm²)', icon: 'fa-vector-square' },
    { id: 'centimeterpersegi', label: 'CM² (cm²)', icon: 'fa-vector-square' },
    { id: 'millimeterpersegi', label: 'MM² (mm²)', icon: 'fa-vector-square' }
];

export default function KalkulatorLuas() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('kilometerpersegi'); // Default KM² sesuai daftar Senpai
    const [keSatuan, setKeSatuan] = useState('meterpersegi');
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
    const opsiDariTerpilih = DAFTAR_SATUAN_LUAS.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_LUAS[0];
    const opsiKeTerpilih = DAFTAR_SATUAN_LUAS.find(s => s.id === keSatuan) || DAFTAR_SATUAN_LUAS[3];

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

    // Logika Hitung Konversi Luas (Real-time & Akurat)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam m²) / Faktor Tujuan dalam m²
        const nilaiDalamMeterPersegi = nilaiAngka * FAKTOR_KONVERSI_LUAS[dariSatuan];
        const hasilAkhir = nilaiDalamMeterPersegi / FAKTOR_KONVERSI_LUAS[keSatuan];

        // Memformat tampilan desimal agar rapi dan tidak merusak layout box hasil
        let hasilDiformat;
        if (hasilAkhir < 1e-4 || hasilAkhir > 1e12) {
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
                            <i className="fa-solid fa-chart-area" style={{ marginRight: '10px' }}></i> 
                            Konversi Luas Wilayah
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Luas" 
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
                                {DAFTAR_SATUAN_LUAS.map((item) => (
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
                                {DAFTAR_SATUAN_LUAS.map((item) => (
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

                    {/* BUTTON HITUNG MANUAl */}
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
                SISTEM POPUP MODAL (PANDUAN UKURAN LUAS MATRIKS)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Satuan Luas & Wilayah
                    </h3>
                    
                    <ul className="tool-list">

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-car"></i> Kilometer² (km²)</span>
                            <div className="tool-text">
                                Kilometer persegi (dilambangkan dengan km²) adalah satuan luas dalam sistem metrik yang setara dengan luas sebuah persegi yang memiliki panjang sisi 1 kilometer.  Satuan ini digunakan untuk mengukur area atau wilayah yang sangat besar, seperti luas negara, kota, atau benua.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, berikut adalah kesetaraan dan konversi dari 1 kilometer persegi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 km² = 1.000.000 meter persegi (m²).</li>
                                    <li className="sub-item">1 km² = 100 hektar (ha).</li>
                                    <li className="sub-item">1 km² = 10.000 are (a).</li>
                                    <li className="sub-item">1 km² ≈ 0,3861 mil persegi.</li>

                                    <li className="sub-item">
                                        Satuan ini diperoleh dari hasil perkalian satuan panjang kilometer dengan kilometer itu sendiri ( \(1 km×1 km=1 km{2}\) ). Dalam konteks geografis, satuan ini sering digunakan untuk memberikan gambaran ukuran wilayah; misalnya, luas daratan Singapura adalah sekitar 719 km², sedangkan luas daratan Australia adalah sekitar 7.692.024 km². 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bell-concierge"></i> Hektometer (hm²)</span>
                            <div className="tool-text">
                                hm persegi (hektometer persegi) adalah satuan luas dalam sistem metrik yang setara dengan 10.000 meter persegi (m²).  Satuan ini secara resmi dikenal sebagai hektar (ha), di mana istilah "hektar" berasal dari gabungan kata "hekto" (seratus) dan "are" (1 are = 100 m²).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah rincian detail mengenai hm persegi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Konversi Nilai: 1 hm² sama dengan 10.000 m² atau 100 are.  Ini karena 1 hektometer sama dengan 100 meter, sehingga luasnya adalah \(100 \times 100 = 10.000\) meter persegi.
                                    </li>
                                    <li className="sub-item">
                                        Visualisasi: Secara fisik, 1 hm persegi dapat dibayangkan sebagai sebuah persegi dengan panjang sisi masing-masing 100 meter.  Sebagai perbandingan, luas ini sedikit lebih besar daripada satu lapangan sepak bola standar FIFA.
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Umum: Satuan ini paling sering digunakan dalam pengukuran lahan skala besar seperti pertanian, perkebunan, kehutanan, dan properti, karena lebih praktis daripada menggunakan meter persegi untuk area yang luas. 
                                    </li>
                                    <li className="sub-item">Hubungan dengan Satuan Lain</li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">1 hm² = 10.000 m²</li>
                                        <li className="sub-item">1 hm² = 100 are</li>
                                        <li className="sub-item">1 km² = 100 hm² (atau 100 hektar) </li>
                                    </div>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-map-location-dot"></i> Dekameter (dam²)</span>
                            <div className="tool-text">
                                Dekameter persegi (dam²) adalah satuan luas dalam Sistem Internasional yang setara dengan 100 meter persegi (m²).
                            </div>
                            
                        <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, konversi dan penggunaan satuan ini mencakup:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Dasar: 1 dam² adalah luas persegi dengan sisi sepanjang 1 dekameter (10 meter). Oleh karena itu, <Latex>{"1\\mathrm{dam}^{2}=10\\mathrm{m}\\times10\\mathrm{m}=100\\mathrm{m}^{2}"}</Latex>
                                    </li>
                                    <li className="sub-item" style={{ marginTop: '10px' }}>
                                        Hubungan dengan Are: 1 dam persegi secara numerik sama dengan 1 Are (a), sehingga
                                        <Latex>{"1\\mathrm{dam}^2= 1\\mathrm{are}= 100\\mathrm{m}^2"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Konversi Tangga Luas: Dalam tangga satuan luas baku (km² → hm² → dam² → m² → ...), penurunan satu tingkat dari dam² ke m² dikalikan 100, sedangkan kenaikan satu tingkat dari m² ke dam² dibagi 100. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan: Satuan ini sering digunakan untuk mengukur luas tanah atau lahan pertanian berukuran sedang, terutama dalam konteks yang lebih teknis atau internasional dibanding penggunaan satuan lokal seperti "ubin" atau "bata".
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-window-restore"></i> Meter² (m²)</span>
                            <div className="tool-text">
                                Meter persegi (disingkat m²) adalah satuan luas internasional dalam sistem metrik yang didefinisikan sebagai area bidang datar yang memiliki panjang 1 meter dan lebar 1 meter.  Satuan ini umumnya digunakan untuk mengukur luas area yang relatif kecil hingga sedang, seperti luas tanah, luas bangunan, atau luas ruangan. <br /><br />Secara teknis, satu meter persegi setara dengan 10.000 sentimeter persegi (cm²) karena 1 meter sama dengan 100 sentimeter.  Satuan ini juga menjadi dasar konversi untuk satuan luas lahan yang lebih besar, di mana 1 are = 100 m² dan 1 hektar = 10.000 m².
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-window-restore"></i> Desimeter² (dm²)</span>
                            <div className="tool-text">
                                Desimeter persegi \((dm^2)\) adalah satuan luas dalam sistem metrik yang setara dengan luas persegi dengan panjang sisi 1 desimeter (10 cm atau 0,1 meter).  Dalam konteks konversi satuan luas, tangga konversi menggunakan faktor 100 antar tingkatan (bukan 10 seperti pada satuan panjang).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail konversi dan hubungannya dengan satuan lain:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan Meter Persegi: <Latex>{"1\\mathrm{dm}^2 = 0,01\\mathrm{m}^2"}</Latex>karena <Latex>{"1\\mathrm{m}^2 = 100\\mathrm{dm}^2)"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Sentimeter Persegi: <Latex>{"1\\mathrm{dm}^2 = 100\\mathrm{cm}^2"}</Latex>. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Milimeter Persegi: <Latex>{"1\\mathrm{dm}^2 = 10.000\\mathrm{mm}^2"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan: Satuan ini sering digunakan untuk mengukur luas bidang yang lebih kecil dari 1 meter persegi namun lebih besar dari sentimeter persegi, atau sebagai bagian dari pembelajaran matematika dasar mengenai tangga satuan luas. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-ruler-vertical"></i> Sentimeter² (cm²)</span>
                            <div className="tool-text">
                                Sentimeter persegi \((cm^2)\) adalah satuan baku untuk mengukur luas yang setara dengan luas persegi dengan panjang sisi 1 sentimeter.  Dalam sistem konversi satuan luas, 1 meter persegi \((m^2)\) sama dengan 10.000 sentimeter persegi, karena 1 meter terdiri dari 100 sentimeter dan luas dihitung dengan mengkuadratkan panjang sisi \((100 \times 100 = 10.000)\). <br /><br />Secara praktis, satuan ini digunakan untuk mengukur permukaan benda yang relatif kecil, seperti kertas, layar ponsel, atau ubin lantai.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversinya ke satuan lain mengikuti pola kelipatan 100:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        <span className="latex-auto">
                                        1\ cm^2 = 0,01</span> desimeter persegi <span className="latex-auto">(dm^2)</span>
                                    </li>
                                    <li className="sub-item">
                                        <span className="latex-auto">
                                            1\ cm^2\ = 0,0001</span> meter persegi<span className="latex-auto"> (m^2)</span>
                                    </li>
                                    <li className="sub-item">
                                        <span className="latex-auto">1\ $cm^2$ = 100</span> milimeter persegi <span className="latex-auto">($mm^2$)</span>
                                    </li>
                                    <li className="sub-item">
                                        Rumus luas bangun datar (seperti persegi panjang atau persegi) biasanya menghasilkan hasil akhir dalam satuan persegi, misalnya <span className="latex-auto">panjang \times lebar = cm^2</span>, yang menunjukkan banyaknya persegi satuan berukuran <span className="latex-auto">1 \times 1 cm</span> yang dapat menutupi area tersebut.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bell-concierge"></i> Milimeter (mm²)</span>
                            <div className="tool-text">
                                Millimeter persegi (mm²) adalah satuan luas dalam sistem metrik yang setara dengan luas bidang berukuran 1 milimeter x 1 milimeter.  Ini adalah satuan terkecil dalam urutan standar konversi luas metrik yang umum digunakan untuk pengukuran detail atau presisi tinggi.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara hierarki satuan luas metrik (dari besar ke kecil), urutannya adalah:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Kilometer persegi (km²)
                                    </li>
                                    <li className="sub-item">
                                        Hektometer persegi (hm²)
                                    </li>
                                    <li className="sub-item">
                                        Dekameter persegi (dam²)
                                    </li>
                                    <li className="sub-item">
                                        Meter persegi (m²)
                                    </li>
                                    <li className="sub-item">
                                        Desimeter persegi (dm²)
                                    </li>
                                    <li className="sub-item">
                                        Sentimeter persegi (cm²)
                                    </li>
                                    <li className="sub-item">
                                        Millimeter persegi (mm²)
                                    </li>

                                    <span className="sub-info-title">
                                        Konversinya menggunakan faktor 100 setiap kali turun satu tingkat ukuran.  Oleh karena itu:
                                    </span>
                                    <li className="sub-item latex-auto">
                                        1\ cm² = 100\ mm²
                                    </li>
                                    <li className="sub-item latex-auto">
                                        1\ m² = 10.000\ cm² = 1.000.000\ mm²
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