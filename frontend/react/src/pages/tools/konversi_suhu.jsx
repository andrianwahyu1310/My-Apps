import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css'; // Menggunakan basis file css konversi yang sama murni

// 🌟 DAFTAR UNIT SUHU DENGAN SIMBOL DAN IKON FONT AWESOME YANG SINKRON
const DAFTAR_SUHU = [
    { id: 'celsius', label: 'Celsius (°C)', icon: 'fa-temperature-low' },
    { id: 'fahrenheit', label: 'Fahrenheit (°F)', icon: 'fa-temperature-half' },
    { id: 'kelvin', label: 'Kelvin (K)', icon: 'fa-temperature-high' },
    { id: 'reamur', label: 'Reamur (°Ré)', icon: 'fa-thermometer' },
    { id: 'rankine', label: 'Rankine (°Ra)', icon: 'fa-mercury' }
];

export default function KalkulatorSuhu({ user, onLogout }) {
    // State Utama Form
    const [inputValue, setInputValue] = useState('0');
    const [dariSatuan, setDariSatuan] = useState('celsius');
    const [keSatuan, setKeSatuan] = useState('fahrenheit');
    const [hasilKonversi, setHasilKonversi] = useState(32);
    const [teksRumus, setTeksRumus] = useState('');

    // State Kendali Dropdown Melayang (Custom UI agar serasi dengan proyek sebelumnya)
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);

    // Ref untuk penutupan otomatis saat klik di luar elemen (Dropdown & Modal)
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    const opsiDariTerpilih = DAFTAR_SUHU.find(s => s.id === dariSatuan) || DAFTAR_SUHU[0];
    const opsiKeTerpilih = DAFTAR_SUHU.find(s => s.id === keSatuan) || DAFTAR_SUHU[1];

    // 🛡️ PROTEKSI GLOBAL: Deteksi klik luar untuk Dropdown dan Modal Popup
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
        return () => document.removeEventListener('mousedown', tanganiKlikLuar);
    }, [bukaDariDropdown, bukaKeDropdown, isModalActive]);

    // 🌟 ENGINE UTAMA: Perhitungan Konversi Suhu & Generator Rumus Fisika
    const hitungKonversiSuhu = () => {
        const T = parseFloat(inputValue);
        if (isNaN(T)) {
            setHasilKonversi('-');
            setTeksRumus('Masukkan nilai angka suhu yang valid, Senpai.');
            return;
        }

        if (dariSatuan === keSatuan) {
            setHasilKonversi(T);
            setTeksRumus('Sama skala, tidak perlu konversi.');
            return;
        }

        let hasil = 0;
        let rumusStr = '';

        switch (dariSatuan) {
            case 'celsius':
                if (keSatuan === 'fahrenheit') {
                    hasil = (T * 9/5) + 32;
                    rumusStr = `(${T}°C × 9/5) + 32 = ${hasil.toFixed(2)}°F`;
                } else if (keSatuan === 'kelvin') {
                    hasil = T + 273.15;
                    rumusStr = `${T}°C + 273.15 = ${hasil.toFixed(2)}K`;
                } else if (keSatuan === 'reamur') {
                    hasil = T * 4/5;
                    rumusStr = `${T}°C × 4/5 = ${hasil.toFixed(2)}°Ré`;
                } else if (keSatuan === 'rankine') {
                    hasil = (T * 9/5) + 491.67;
                    rumusStr = `(${T}°C × 9/5) + 491.67 = ${hasil.toFixed(2)}°Ra`;
                }
                break;
            case 'fahrenheit':
                if (keSatuan === 'celsius') {
                    hasil = (T - 32) * 5/9;
                    rumusStr = `(${T}°F - 32) × 5/9 = ${hasil.toFixed(2)}°C`;
                } else if (keSatuan === 'kelvin') {
                    hasil = ((T - 32) * 5/9) + 273.15;
                    rumusStr = `((${T}°F - 32) × 5/9) + 273.15 = ${hasil.toFixed(2)}K`;
                } else if (keSatuan === 'reamur') {
                    hasil = (T - 32) * 4/9;
                    rumusStr = `(${T}°F - 32) × 4/9 = ${hasil.toFixed(2)}°Ré`;
                } else if (keSatuan === 'rankine') {
                    hasil = T + 459.67;
                    rumusStr = `${T}°F + 459.67 = ${hasil.toFixed(2)}°Ra`;
                }
                break;
            case 'kelvin':
                if (keSatuan === 'celsius') {
                    hasil = T - 273.15;
                    rumusStr = `${T}K - 273.15 = ${hasil.toFixed(2)}°C`;
                } else if (keSatuan === 'fahrenheit') {
                    hasil = ((T - 273.15) * 9/5) + 32;
                    rumusStr = `((${T}K - 273.15) × 9/5) + 32 = ${hasil.toFixed(2)}°F`;
                } else if (keSatuan === 'reamur') {
                    hasil = (T - 273.15) * 4/5;
                    rumusStr = `(${T}K - 273.15) × 4/5 = ${hasil.toFixed(2)}°Ré`;
                } else if (keSatuan === 'rankine') {
                    hasil = T * 1.8;
                    rumusStr = `${T}K × 1.8 = ${hasil.toFixed(2)}°Ra`;
                }
                break;
            case 'reamur':
                if (keSatuan === 'celsius') {
                    hasil = T * 5/4;
                    rumusStr = `${T}°Ré × 5/4 = ${hasil.toFixed(2)}°C`;
                } else if (keSatuan === 'fahrenheit') {
                    hasil = (T * 9/4) + 32;
                    rumusStr = `(${T}°Ré × 9/4) + 32 = ${hasil.toFixed(2)}°F`;
                } else if (keSatuan === 'kelvin') {
                    hasil = (T * 5/4) + 273.15;
                    rumusStr = `(${T}°Ré × 5/4) + 273.15 = ${hasil.toFixed(2)}K`;
                } else if (keSatuan === 'rankine') {
                    hasil = (T * 9/4) + 491.67;
                    rumusStr = `(${T}°Ré × 9/4) + 491.67 = ${hasil.toFixed(2)}°Ra`;
                }
                break;
            case 'rankine':
                if (keSatuan === 'celsius') {
                    hasil = (T - 491.67) * 5/9;
                    rumusStr = `(${T}°Ra - 491.67) × 5/9 = ${hasil.toFixed(2)}°C`;
                } else if (keSatuan === 'fahrenheit') {
                    hasil = T - 459.67;
                    rumusStr = `${T}°Ra - 459.67 = ${hasil.toFixed(2)}°F`;
                } else if (keSatuan === 'kelvin') {
                    hasil = T / 1.8;
                    rumusStr = `${T}°Ra / 1.8 = ${hasil.toFixed(2)}K`;
                } else if (keSatuan === 'reamur') {
                    hasil = (T - 491.67) * 4/9;
                    rumusStr = `(${T}°Ra - 491.67) × 4/9 = ${hasil.toFixed(2)}°Ré`;
                }
                break;
            default:
                break;
        }

        setHasilKonversi(Number(hasil.toFixed(4)));
        setTeksRumus(rumusStr || '');
    };

    // Trigger perhitungan otomatis real-time saat terjadi perubahan input/skala
    useEffect(() => {
        hitungKonversiSuhu();
    }, [inputValue, dariSatuan, keSatuan]);

    return (
        <>
            <div className="tools-page-wrapper" style={{ paddingTop: '100px' }}>
                <Link to="/mainTools" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
                </Link>

                {/* SINKRONISASI SEJAJAR: Menggunakan susunan .tool-container agar kembar identik */}
                <div className="tool-container">
                    <div className="tool-header">
                        <h2>
                            <i className="bi bi-thermometer-half" style={{ marginRight: '10px' }}></i> 
                            Konversi Suhu Dua Arah
                        </h2>
                        {/* BUTTON INFO POPUP MODAL (Gaya Ikon Serasi) */}
                        <button className="btn-info-popup" onClick={() => setIsModalActive(true)}>
                            <i className="bi bi-question-lg"></i>
                        </button>
                    </div>

                    {/* INPUT NILAI SUHU UTAMA */}
                    <div className="form-group">
                        <label>Masukkan Nilai Suhu</label>
                        <input
                            type="number"
                            className="form-control"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            step="any"
                            placeholder="Masukkan angka suhu..."
                        />
                    </div>

                    {/* CUSTOM DROPDOWN: SKALA ASAL */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownDari}>
                        <label>Dari Skala</label>
                        <div 
                            className="form-control custom-dropdown" 
                            onClick={() => {
                                setBukaDariDropdown(!bukaDariDropdown);
                                setBukaKeDropdown(false);
                            }}
                        >
                            <div>
                                <i className={`fa-solid ${opsiDariTerpilih.icon}`} style={{ marginRight: '8px', color: 'var(--primary-color)' }}></i>
                                <span className="text-normal">{opsiDariTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaDariDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaDariDropdown && (
                            <div className="dropdown-options" style={{ display: 'block', maxHeight: '220px', overflowY: 'auto' }}>
                                {DAFTAR_SUHU.map((item) => (
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

                    {/* CUSTOM DROPDOWN: SKALA TUJUAN */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownKe}>
                        <label>Ke Skala</label>
                        <div 
                            className="form-control custom-dropdown" 
                            onClick={() => {
                                setBukaKeDropdown(!bukaKeDropdown);
                                setBukaDariDropdown(false);
                            }}
                        >
                            <div>
                                <i className={`fa-solid ${opsiKeTerpilih.icon}`} style={{ marginRight: '8px', color: '#10b981' }}></i>
                                <span className="text-normal">{opsiKeTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaKeDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaKeDropdown && (
                            <div className="dropdown-options" style={{ display: 'block', maxHeight: '220px', overflowY: 'auto' }}>
                                {DAFTAR_SUHU.map((item) => (
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

                    {/* TAMPILAN BOX HASIL EVALUASI ANGKA */}
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label style={{ color: '#10b981', fontWeight: 'bold' }}>Hasil Konversi</label>
                        <div 
                            className="result-box" 
                            style={{ 
                                background: '#f0fdf4', 
                                borderLeft: '4px solid #10b981', 
                                fontSize: '1.4rem', 
                                fontWeight: 'bold', 
                                color: '#166534',
                                minHeight: '55px',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {String(hasilKonversi)} {opsiKeTerpilih.label.split(' ')[1] || ''}
                        </div>
                    </div>

                    {/* TAMPILAN LANGKAH RUMUS MATEMATIS */}
                    {teksRumus && (
                        <div 
                            className="result-box" 
                            style={{ 
                                background: '#f8fafc', 
                                borderLeft: '4px solid #64748b', 
                                fontSize: '0.9rem', 
                                color: '#475569', 
                                marginTop: '10px',
                                fontFamily: 'monospace'
                            }}
                        >
                            {teksRumus}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL PANDUAN SATUAN (Sinkronisasi Kode Penutup dan Kelas Desain) */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
                        <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>
                        Panduan Skala Suhu
                    </h3>

                    <ul className="tool-list">
                    
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-temperature-low"></i> Celcius (°C)</span>
                            <div className="tool-text">
                                Celsius (sering ditulis Celcius) adalah skala pengukuran suhu yang paling umum digunakan di Indonesia dan sebagian besar dunia untuk keperluan sehari-hari.  Skala ini ditetapkan oleh ahli astronomi asal Swedia, Anders Celsius (1701–1744), dengan titik beku air pada 0°C dan titik didih air pada 100°C pada tekanan atmosfer standar, sehingga rentangnya dibagi menjadi 100 derajat. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah rincian detail mengenai satuan Celsius:</span>
                                <ul className="sub-list">
                                    <p>
                                        1. Karakteristik Utama
                                    </p>
                                    <li className="sub-item">
                                        Simbol: Dilambangkan dengan °C.     
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Titik beku air: 0°C
                                        .</li>
                                        <li className="sub-item">
                                            Titik didih air: 100°C. 
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Penggunaan: Digunakan secara luas di Indonesia untuk cuaca, medis (suhu tubuh), dan kehidupan sehari-hari karena praktis dan mudah dipahami. 
                                    </li>                                    
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">2. Hubungan dengan Satuan Internasional (SI)</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Meskipun Celsius sangat umum, Kelvin (K) adalah satu-satunya satuan suhu yang diakui sebagai Satuan Internasional (SI).  Kelvin tidak menggunakan derajat (°) dan didasarkan pada nol absolut (0 K = -273,15°C). Hubungannya dengan Celsius adalah: T(K)=T(°C)+273,15 Satu derajat Celsius memiliki besaran perubahan suhu yang sama dengan satu Kelvin. 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">3. Perbandingan dengan Skala Lain</span>
                                <ul className="sub-list">
                                    <p>
                                        Perbandingan rentang suhu antara air membeku dan mendidih pada empat skala utama adalah:
                                    </p>
                                    <li className="sub-item">
                                        Fahrenheit: 32°F – 212°F (Rentang 180)
                                    </li>
                                    <li className="sub-item">
                                        Reamur: 0°R – 80°R (Rentang 80)
                                    .</li>
                                    <li className="sub-item">
                                        Kelvin: 273,15 K – 373,15 K (Rentang 100). 
                                    </li>                    
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">4. Rumus Konversi</span>
                                <ul className="sub-list">
                                    <p>
                                        Untuk mengubah suhu dari Celsius ke skala lain, gunakan rumus perbandingan berikut:  <Latex>{"\\frac{\\mathrm{C}}{5}=\\frac{\\mathrm{F}-32}{9}=\\frac{\\mathrm{R}}{4}=\\frac{\\mathrm{K}-273}{5}"}</Latex>
                                    </p>
                                    <li className="sub-item">
                                        Celsius ke Fahrenheit: <Latex>{"T(\\mathrm{°F})=\\frac{9}{5}\\,T(\\mathrm{°C})+32"}</Latex>
                                    </li>
                                    <li className="sub-item">
                                        Celsius ke Reamur: <Latex>{"T(\\mathrm{°C})=\\frac{5}{4}\\,T(\\mathrm{°R})"}</Latex>
                                    .</li>
                                    <li className="sub-item">
                                        Celsius ke Kelvin: <Latex>{"T(\\mathrm{K})=T(\\mathrm{°C})+273.15"}</Latex>
                                    </li>                    
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">5. Catatan Penulisan</span>
                                <ul className="sub-list">
                                    <p>
                                        Secara teknis internasional, ejaan yang benar adalah Celsius (mengacu pada nama penemunya).  Namun, dalam konteks pendidikan dan penggunaan sehari-hari di Indonesia, ejaan Celcius juga sangat umum diterima dan sering digunakan. 
                                    </p>                    
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-temperature-half"></i> Fahrenheit (°F)</span>
                            <div className="tool-text">
                                Fahrenheit adalah skala suhu termodinamika yang menggunakan satuan derajat Fahrenheit (°F) dan banyak digunakan di Amerika Serikat, Kepulauan Cayman, Belize, serta beberapa wilayah karibia dan Pasifik Barat.  Skala ini ditetapkan oleh fisikawan Jerman Daniel Gabriel Fahrenheit pada tahun 1724, dengan titik beku air pada 32 °F dan titik didih air pada 212 °F (pada tekanan atmosfer standar), sehingga jarak antara kedua titik tersebut dibagi menjadi 180 derajat. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail kunci mengenai skala Fahrenheit:</span>
                                <ul className="sub-list">
                                    <p>
                                        1. Definisi dan Referensi
                                    </p>
                                    <li className="sub-item">
                                        Nol Mutlak: Ditetapkan pada -459,67 °F. 
                                    </li>
                                    <li className="sub-item">
                                        Titik Bebu Air: 32 °F (setara dengan 0 °C). 
                                    </li>
                                    <li className="sub-item">
                                         Titik Didih Air: 212 °F (setara dengan 100 °C).
                                    </li>
                                    <li className="sub-item">
                                        Suhu Tubuh Manusia: Sekitar 98,6 °F (nilai awal Fahrenheit adalah 96 °F, yang kemudian disesuaikan). 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">2. Perbandingan Skala Suhu3. Perbandingan dengan Skala Lain</span>
                                <ul className="sub-list">
                                    <p>
                                        Skala Fahrenheit memiliki perbandingan dengan skala lainnya sebagai berikut:
                                    </p>
                                    <li className="sub-item">
                                        Celcius (°C): Jarak 100 derajat antara beku dan didih. 
                                    </li>
                                    <li className="sub-item">
                                        Reamur (°R): Jarak 80 derajat antara beku dan didih. 
                                    .</li>
                                    <li className="sub-item">
                                        Kelvin (K): Skala absolut tanpa derajat, di mana 0 K = -273,15 °C. 
                                    </li>
                                    <p>
                                        Perbandingan rasio perubahan suhu adalah Fahrenheit : Celcius : Reamur = 9 : 5 : 4. 
                                    </p>         
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">3. Rumus Konversi</span>
                                <ul className="sub-list">
                                    <p>
                                        Untuk mengonversi suhu ke atau dari Fahrenheit, gunakan rumus berikut:
                                    </p>
                                    <li className="sub-item">
                                        Dari Celcius (°C) ke Fahrenheit (°F): <Latex>{"F=\\frac{9}{5}C+32"}</Latex>
                                    </li>
                                    <li className="sub-item">
                                        Dari Fahrenheit (°F) ke Celcius (°C): <Latex>{"C=\\frac{5}{9}\\left(F-32\\right)"}</Latex>
                                    .</li>
                                    <li className="sub-item">
                                        Dari Reamur (°R) ke Fahrenheit (°F):<Latex>{"F=\\frac{9}{4}R+32"}</Latex>
                                    </li>
                                    <li className='sub-item'>
                                        Dari Fahrenheit (°F) ke Reamur (°R): <Latex>{"R=\\frac{4}{9}\\left(F-32\\right)"}</Latex>
                                    </li>         
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">4. Sejarah Singkat</span>
                                <ul className="sub-list">
                                    <p>
                                        Awalnya, Fahrenheit menggunakan campuran air, es, dan garam (amonium klorida) sebagai titik nol (0 °F). Titik kedua adalah suhu tubuh manusia (awalnya 96 °F), dan titik ketiga adalah suhu es murni (32 °F). Pada abad ke-20, skala ini didefinisikan ulang secara formal menggunakan skala Kelvin, dengan mempertahankan titik beku dan didih air pada 32 °F dan 212 °F. 
                                    </p>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-temperature-high"></i> Kelvin (K)</span>
                            <div className="tool-text">
                                Kelvin (simbol: K) adalah satuan pokok untuk besaran suhu termodinamika dalam Sistem Satuan Internasional (SI).  Berbeda dengan skala Celsius atau Fahrenheit, Kelvin adalah skala suhu mutlak yang tidak menggunakan tanda derajat (°) dan tidak memiliki nilai negatif, karena titik nolnya (0 K) mewakili nol absolut—suhu terendah teoritis di mana gerakan partikel materi berhenti sepenuhnya.
                            </div>
                            
                        <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah rincian utama mengenai satuan Kelvin:</span>
                                <ul className="sub-list">
                                    <p>
                                        Definisi dan Sejarah
                                    </p>
                                    <li className="sub-item">
                                        Definisi Modern (2019): Setelah redefinisi SI pada tahun 2019, satu kelvin didefinisikan dengan menetapkan nilai numerik tetap dari konstanta Boltzmann ($k$) sebesar <Latex>{"1.380649\\times10^{-23}\\,\\mathrm{J}\\cdot\\mathrm{K}^{-1}"}</Latex>.  Ini mengaitkan suhu secara langsung dengan energi kinetik partikel.
                                    </li>
                                    <li className="sub-item">
                                        Asal Usul: Skala ini dinamai dari fisikawan dan insinyur Inggris, William Thomson, Baron Kelvin Pertama (1824–1907), yang mencetuskan konsep suhu absolut pada abad ke-19. 
                                    </li>
                                    <li className="sub-item">
                                        Penetapan Internasional: Kelvin secara resmi ditetapkan sebagai satuan suhu SI pada Kongres Fisika Internasional tahun 1954. 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Karakteristik Utama</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Nol Mutlak: 0 K setara dengan -273,15 °C.  Pada suhu ini, entropi sistem mencapai minimum dan tidak ada energi panas yang dapat diekstrak.
                                    </li>
                                    <li className="sub-item">
                                        Ukuran Langkah yang Sama: Besaran kenaikan 1 Kelvin sama persis dengan kenaikan 1 derajat Celsius (<Latex>{"1\\mathrm{K}=1\\mathrm{°C}"}</Latex>). Perbedaannya hanya pada titik nolnya. 
                                    .</li>
                                    <li className="sub-item">
                                        Titik Tetap Air: Dalam skala Kelvin, air membeku pada 273,15 K dan mendidih pada 373,15 K pada tekanan atmosfer standar. 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Rumus Konversi</span>
                                <ul className="sub-list">
                                    <p>
                                        Untuk mengonversi suhu dari atau ke Kelvin, gunakan rumus berikut:<Latex>{"T_{\\mathrm{K}}=T_{\\mathrm{C}}+273.15"}</Latex><br /><Latex>{"T_{\\mathrm{C}}=T_{\\mathrm{K}}-273.15"}</Latex> <br/> Dimana: <br/>
                                        <Latex>{"T_{\\mathrm{K}}"}</Latex> = Suhu dalam Kelvin dan <Latex>{"T_{\\mathrm{C}}"}</Latex> = Suhu dalam Celsius
                                    </p>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Aplikasi dan Penggunaan</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Sains dan Fisika: Wajib digunakan dalam perhitungan termodinamika, hukum gas ideal, dan fisika kuantum karena sifatnya yang absolut dan linier terhadap energi.
                                    </li>
                                    <li className="sub-item">
                                        Astronomi: Digunakan untuk menentukan suhu efektif bintang dan permukaan planet.
                                    .</li>
                                    <li className="sub-item">
                                        Teknologi Cahaya: Digunakan sebagai satuan suhu warna untuk sumber cahaya (misalnya, lampu siang hari sekitar 5600 K), yang menggambarkan karakteristik warna cahaya dari merah (suhu rendah) hingga biru (suhu tinggi).
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-thermometer"></i> Reamur (°Ré)'</span>
                            <div className="tool-text">
                                Skala Reamur adalah satuan pengukuran suhu yang dikemukakan oleh ilmuwan Prancis René Antoine Ferchault de Réaumur pada tahun 1730 atau 1731.  Skala ini menetapkan titik beku air pada 0 °R dan titik didih air pada 80 °R, sehingga total terdapat 80 interval atau "anak tangga" antara kedua titik tersebut. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail lengkap mengenai skala Reamur:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Simbol dan Satuan: Dilambangkan dengan huruf R atau °R, dengan satuan derajat Reamur. 
                                    </li>
                                    <li className="sub-item">
                                        Perbandingan Skala: Perbandingan antara Celcius (C), Reamur (R), Fahrenheit (F), dan Kelvin (K) adalah 5 : 4 : 9 : 5.  Hal ini karena rentang Celcius adalah 100, Reamur 80, Fahrenheit 180 (212-32), dan Kelvin 100 (373,15-273,15).
                                    .</li>
                                    <li className="sub-item">
                                        Rumus Konversi:
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Dari Celcius ke Reamur: <Latex>{"T_{\\mathrm{R}}=\\frac{4}{5}T_{\\mathrm{C}}"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Dari Reamur ke Celcius: <Latex>{"T_{\\mathrm{C}}=\\frac{5}{4}T_{\\mathrm{R}}"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Dari Reamur ke Fahrenheit: <Latex>{"T_{\\mathrm{F}}=\\frac{9}{4}T_{\\mathrm{R}}+32"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Dari Reamur ke Kelvin: <Latex>{"T_{\\mathrm{K}}=\\frac{5}{4}T_{\\mathrm{R}}+273.15"}</Latex>
                                        </li>
                                    </div>

                                    <li className='sub-item'>
                                        Sejarah dan Penggunaan: Skala ini sempat populer di Eropa, khususnya di Prancis, Jerman, dan Rusia, serta disebutkan dalam karya sastra seperti The Brothers Karamazov. Saat ini, penggunaannya sangat jarang dalam kehidupan sehari-hari, namun masih bertahan di beberapa industri tertentu di Eropa (seperti produksi keju di Italia/Swiss dan pembuatan sirup gula di Belanda) karena interval 80 derajat dianggap mudah dibagi-bagi untuk perhitungan teknis. 
                                    </li>
                                    <li className='sub-item'>
                                        Karakteristik Unik: Réaumur memilih angka 80 karena mudah dibagi dengan angka bulat (2, 4, 5, 10, 20, 40), berbeda dengan angka 100 pada Celcius yang lebih sulit dibagi secara presisi tanpa desimal. Awalnya, termometer Reamur menggunakan alkohol, namun kemudian diganti dengan air raksa untuk akurasi yang lebih baik. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-mercury"></i> Rankine ("Ra)</span>
                            <div className="tool-text">
                                Skala Rankine adalah satuan suhu termodinamika absolut yang menggunakan derajat Fahrenheit sebagai unit pengukurannya, di mana 0 °R setara dengan nol absolut (-459,67 °F).  Skala ini dinamis dan dikembangkan oleh insinyur Skotlandia William John Macquorn Rankine pada tahun 1859, dan simbol utamanya adalah °R atau °Ra. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail teknis mengenai skala Rankine:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Hubungan dengan Skala Lain: Berbeda dengan skala Kelvin yang berbasis Celsius, satu derajat Rankine besarnya sama dengan satu derajat Fahrenheit. Ini membuatnya sangat relevan dalam sistem teknik Amerika Serikat yang menggunakan satuan imperial.
                                    </li>
                                    <li className="sub-item">
                                        Konversi Utama:
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Dari Fahrenheit ke Rankine:  <Latex>{"T_{\\mathrm{Ra}}=T_{\\mathrm{F}}+459.67"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Dari Kelvin ke Rankine:  <Latex>{"T_{\\mathrm{Ra}}=\\frac{9}{5}T_{\\mathrm{K}}"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Dari Celsius ke Rankine:  <Latex>{"T_{\\mathrm{Ra}}=\\left(T_{\\mathrm{C}}+273.15\\right)\\times\\frac{9}{5}"}</Latex>
                                        </li>
                                    </div>

                                    <li className='sub-item'>
                                        Titik Referensi Penting
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Nol Absolut: 0 °R (setara dengan 0 K atau -273,15 °C).
                                        </li>
                                        <li className="sub-item">
                                            Titik Beku Air: 491,67 °R (setara dengan 32 °F atau 0 °C).
                                        </li>
                                        <li className="sub-item">
                                            Titik Didih Air: 671,67 °R (setara dengan 212 °F atau 100 °C).
                                        </li>
                                    </div>

                                    <li className="sub-item">
                                        Aplikasi: Skala Rankine terutama digunakan dalam rekayasa termal dan termodinamika di negara-negara yang masih menggunakan sistem imperial, seperti Amerika Serikat, untuk perhitungan efisiensi mesin dan perpindahan panas. 
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