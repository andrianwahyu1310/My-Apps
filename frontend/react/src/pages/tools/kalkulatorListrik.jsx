import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 STRUKTUR DATA GRUP INTEGRASI SESUAI INSTRUKSI
const DAFTAR_SATUAN_LISTRIK = [
    // ⚡ GRUP 1: HUKUM OHM & SIRKUIT (Bisa saling silang dengan parameter bantuan)
    { id: 'volt', label: 'Volt (V)', icon: 'fa-bolt', grup: 'Grup 1: Sirkuit & Hukum Ohm' },
    { id: 'ampere', label: 'Ampere (A)', icon: 'fa-wave-square', grup: 'Grup 1: Sirkuit & Hukum Ohm' },
    { id: 'ohm', label: 'Ohm (Ω)', icon: 'fa-magnet', grup: 'Grup 1: Sirkuit & Hukum Ohm' },
    { id: 'siemens', label: 'Siemens (S)', icon: 'fa-arrows-left-right', grup: 'Grup 1: Sirkuit & Hukum Ohm' },
    
    // 🔌 GRUP 2: DAYA & ENERGI LISTRIK
    { id: 'watt', label: 'Watt (W)', icon: 'fa-plug', grup: 'Grup 2: Daya & Energi' },
    { id: 'volt_ampere', label: 'Volt-Ampere (VA)', icon: 'fa-bolt-lightning', grup: 'Grup 2: Daya & Energi' },
    { id: 'joule', label: 'Joule (J)', icon: 'fa-fire', grup: 'Grup 2: Daya & Energi' },
    { id: 'wh_kwh', label: 'Watt-hour (Wh/kWh)', icon: 'fa-charging-station', grup: 'Grup 2: Daya & Energi' },
    
    // 🧲 GRUP 3: ELEKTRO-MAGNETIK & FREKUENSI
    { id: 'coulomb', label: 'Coulomb (C)', icon: 'fa-atom', grup: 'Grup 3: Elektro-Magnetik' },
    { id: 'farad', label: 'Farad (F)', icon: 'fa-battery-half', grup: 'Grup 3: Elektro-Magnetik' },
    { id: 'henry', label: 'Henry (H)', icon: 'fa-bezier-curve', grup: 'Grup 3: Elektro-Magnetik' },
    { id: 'weber', label: 'Weber (Wb)', icon: 'fa-magnet', grup: 'Grup 3: Elektro-Magnetik' },
    { id: 'tesla', label: 'Tesla (T)', icon: 'fa-compass', grup: 'Grup 3: Elektro-Magnetik' },
    { id: 'hertz', label: 'Hertz (Hz)', icon: 'fa-arrow-up-right-dots', grup: 'Grup 3: Elektro-Magnetik' }
];

export default function KalkulatorListrik() {
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('volt'); 
    const [keSatuan, setKeSatuan] = useState('ampere');
    const [hasilKonversi, setHasilKonversi] = useState('');

    // State Parameter Bantuan untuk Perhitungan Lintas Dimensi Satu Grup
    const [nilaiBantuan, setNilaiBantuan] = useState(1);
    const [labelBantuan, setLabelBantuan] = useState('');

    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);

    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    const opsiDariTerpilih = DAFTAR_SATUAN_LISTRIK.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_LISTRIK[0];
    const opsiKeTerpilih = DAFTAR_SATUAN_LISTRIK.find(s => s.id === keSatuan) || DAFTAR_SATUAN_LISTRIK[1];

    const daftarGrup = [...new Set(DAFTAR_SATUAN_LISTRIK.map(item => item.grup))];

    // 🌟 DETEKSI OTOMATIS: Menentukan variabel bantuan yang diperlukan di dalam satu grup
    useEffect(() => {
        // Pembersihan default
        setLabelBantuan('');

        // Matriks Bantuan Grup 1 (Hukum Ohm)
        if (dariSatuan === 'volt' && keSatuan === 'ampere') setLabelBantuan('Masukkan Nilai Hambatan (Ohm / Ω):');
        else if (dariSatuan === 'ampere' && keSatuan === 'volt') setLabelBantuan('Masukkan Nilai Hambatan (Ohm / Ω):');
        else if (dariSatuan === 'volt' && keSatuan === 'ohm') setLabelBantuan('Masukkan Nilai Arus (Ampere / A):');
        else if (dariSatuan === 'ampere' && keSatuan === 'ohm') setLabelBantuan('Masukkan Nilai Tegangan (Volt / V):');
        else if (dariSatuan === 'volt' && keSatuan === 'siemens') setLabelBantuan('Masukkan Nilai Arus (Ampere / A):');
        else if (dariSatuan === 'ampere' && keSatuan === 'siemens') setLabelBantuan('Masukkan Nilai Tegangan (Volt / V):');

        // Matriks Bantuan Grup 2 (Daya & Energi)
        else if ((dariSatuan === 'watt' || dariSatuan === 'volt_ampere') && (keSatuan === 'joule' || keSatuan === 'wh_kwh')) {
            setLabelBantuan('Masukkan Durasi Waktu (Detik):');
        } else if ((dariSatuan === 'joule' || dariSatuan === 'wh_kwh') && (keSatuan === 'watt' || keSatuan === 'volt_ampere')) {
            setLabelBantuan('Masukkan Durasi Waktu (Detik):');
        }

        // Matriks Bantuan Grup 3 (Elektro-Magnetik)
        else if (dariSatuan === 'coulomb' && keSatuan === 'farad') setLabelBantuan('Masukkan Nilai Tegangan (Volt / V):');
        else if (dariSatuan === 'farad' && keSatuan === 'coulomb') setLabelBantuan('Masukkan Nilai Tegangan (Volt / V):');
        else if (dariSatuan === 'weber' && keSatuan === 'tesla') setLabelBantuan('Masukkan Luas Penampang (m²):');
        else if (dariSatuan === 'tesla' && keSatuan === 'weber') setLabelBantuan('Masukkan Luas Penampang (m²):');
    }, [dariSatuan, keSatuan]);

    useEffect(() => {
        const tanganiKlikLuar = (event) => {
            if (bukaDariDropdown && refDropdownDari.current && !refDropdownDari.current.contains(event.target)) setBukaDariDropdown(false);
            if (bukaKeDropdown && refDropdownKe.current && !refDropdownKe.current.contains(event.target)) setBukaKeDropdown(false);
            if (isModalActive && refKontenModal.current && !refKontenModal.current.contains(event.target)) setIsModalActive(false);
        };
        document.addEventListener('mousedown', tanganiKlikLuar);
        return () => document.removeEventListener('mousedown', tanganiKlikLuar);
    }, [bukaDariDropdown, bukaKeDropdown, isModalActive]);

    // 🌟 ENGINE UTAMA: Kalkulasi Lintas Satuan Satu Grup
    const hitungKonversiGrup = () => {
        const N = parseFloat(inputValue);
        const B = parseFloat(nilaiBantuan);

        if (isNaN(N)) {
            setHasilKonversi('Masukkan nilai utama yang valid.');
            return;
        }

        const unitDari = DAFTAR_SATUAN_LISTRIK.find(s => s.id === dariSatuan);
        const unitKe = DAFTAR_SATUAN_LISTRIK.find(s => s.id === keSatuan);

        // 🛡️ PROTEKSI MUTLAK: Cegah konversi jika berbeda grup
        if (unitDari.grup !== unitKe.grup) {
            setHasilKonversi(`⚠️ Galat Dimensi: "${unitDari.label}" dan "${unitKe.label}" berada di grup berbeda dan tidak dapat dikonversi.`);
            return;
        }

        if (dariSatuan === keSatuan) {
            setHasilKonversi(`Hasil: ${N} ${dariSatuan.toUpperCase()}`);
            return;
        }

        // ==========================================
        // EKSEKUSI GRUP 1: SIRKUIT & HUKUM OHM
        // ==========================================
        if (unitDari.grup === 'Grup 1: Sirkuit & Hukum Ohm') {
            if (dariSatuan === 'ohm' && keSatuan === 'siemens') {
                return setHasilKonversi(N === 0 ? 'Hasil: ∞ S' : `Hasil: ${Number((1 / N).toFixed(6))} Siemens`);
            }
            if (dariSatuan === 'siemens' && keSatuan === 'ohm') {
                return setHasilKonversi(N === 0 ? 'Hasil: ∞ Ω' : `Hasil: ${Number((1 / N).toFixed(6))} Ohm`);
            }
            
            if (isNaN(B) || B === 0) return setHasilKonversi('Masukkan parameter bantuan penyokong yang valid.');

            if (dariSatuan === 'volt' && keSatuan === 'ampere') return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(4))} Ampere (I = V/R)`);
            if (dariSatuan === 'ampere' && keSatuan === 'volt') return setHasilKonversi(`Hasil: ${Number((N * B).toFixed(4))} Volt (V = I*R)`);
            if (dariSatuan === 'volt' && keSatuan === 'ohm') return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(4))} Ohm (R = V/I)`);
            if (dariSatuan === 'ampere' && keSatuan === 'ohm') return setHasilKonversi(`Hasil: ${Number((B / N).toFixed(4))} Ohm (R = V/I)`);
            if (dariSatuan === 'volt' && keSatuan === 'siemens') return setHasilKonversi(`Hasil: ${Number((B / N).toFixed(4))} Siemens (G = I/V)`);
            if (dariSatuan === 'ampere' && keSatuan === 'siemens') return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(4))} Siemens (G = I/V)`);
        }

        // ==========================================
        // EKSEKUSI GRUP 2: DAYA & ENERGI
        // ==========================================
        if (unitDari.grup === 'Grup 2: Daya & Energi') {
            // Konversi linear sejenis
            if (dariSatuan === 'watt' && keSatuan === 'volt_ampere') return setHasilKonversi(`Hasil: ${N} VA (Faktor Daya = 1.0)`);
            if (dariSatuan === 'volt_ampere' && keSatuan === 'watt') return setHasilKonversi(`Hasil: ${N} W (Daya Nyata)`);
            if (dariSatuan === 'joule' && keSatuan === 'wh_kwh') return setHasilKonversi(`Hasil: ${Number((N / 3600).toFixed(6))} Wh (${(N / 3600000).toExponential(4)} kWh)`);
            if (dariSatuan === 'wh_kwh' && keSatuan === 'joule') return setHasilKonversi(`Hasil: ${Number((N * 3600).toFixed(2))} Joule`);

            // Konversi lintas daya ke waktu-energi
            if (isNaN(B)) return setHasilKonversi('Masukkan durasi waktu dalam detik.');
            if (dariSatuan === 'watt' && keSatuan === 'joule') return setHasilKonversi(`Hasil: ${N * B} Joule (E = P * t)`);
            if (dariSatuan === 'joule' && keSatuan === 'watt') return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(4))} Watt (P = E / t)`);
        }

        // ==========================================
        // EKSEKUSI GRUP 3: ELEKTRO-MAGNETIK
        // ==========================================
        if (unitDari.grup === 'Grup 3: Elektro-Magnetik') {
            if (dariSatuan === 'coulomb' && keSatuan === 'farad') {
                if (!B) return setHasilKonversi('Nilai Tegangan tidak boleh nol.');
                return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(6))} Farad (C = Q/V)`);
            }
            if (dariSatuan === 'farad' && keSatuan === 'coulomb') {
                return setHasilKonversi(`Hasil: ${Number((N * B).toFixed(6))} Coulomb (Q = C*V)`);
            }
            if (dariSatuan === 'weber' && keSatuan === 'tesla') {
                if (!B) return setHasilKonversi('Luas area tidak boleh nol.');
                return setHasilKonversi(`Hasil: ${Number((N / B).toFixed(6))} Tesla (B = Φ/A)`);
            }
            if (dariSatuan === 'tesla' && keSatuan === 'weber') {
                return setHasilKonversi(`Hasil: ${Number((N * B).toFixed(6))} Weber (Φ = B*A)`);
            }
        }

        setHasilKonversi(`Hasil: ${N} (Kalkulasi Standar Mandiri Grup)`);
    };

     {/* TOMBOL PICU HITUNG */}
    <button className="btn-hitung" onClick={hitungKonversiGrup}>
        Hitung Konversi
    </button>

    useEffect(() => {
        hitungKonversiGrup();
    }, [inputValue, dariSatuan, keSatuan, nilaiBantuan]);

    return (
        <>
            <div className="tools-page-wrapper" style={{ paddingTop: '100px' }}>
                <Link to="/tools" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
                </Link>

                <div className="tool-container">
                    <div className="tool-header">
                        <h2>
                            <i className="fa-solid fa-bolt" style={{ marginRight: '10px' }}></i> 
                            Kalkulator Konversi Grup Kelistrikan
                        </h2>
                        <button className="btn-info-popup" onClick={() => setIsModalActive(true)}>
                            <i className="bi bi-question-lg"></i>
                        </button>
                    </div>
                    
                    {/* INPUT UTAMA */}
                    <div className="form-group">
                        <label>Masukkan Nilai Angka Utama</label>
                        <input type="number" className="form-control" value={inputValue} onChange={(e) => setInputValue(e.target.value)} step="any"/>
                    </div>

                    {/* DYNAMIC VARIABLE FIELD UNTUK KONVERSI SATU GRUP */}
                    {labelBantuan && (
                        <div className="form-group animate-fade-in">
                            <label style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{labelBantuan}</label>
                            <input type="number" className="form-control" style={{ borderColor: 'var(--primary-color)' }} value={nilaiBantuan} onChange={(e) => setNilaiBantuan(e.target.value)} step="any"/>
                        </div>
                    )}

                    {/* CUSTOM DROPDOWN: SATUAN ASAL */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownDari}>
                        <label>Satuan Asal</label>
                        <div className="form-control custom-dropdown" onClick={() => { setBukaDariDropdown(!bukaDariDropdown); setBukaKeDropdown(false); }}>
                            <div>
                                <i className={`fa-solid ${opsiDariTerpilih.icon}`}></i>
                                <span className="text-normal">{opsiDariTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaDariDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaDariDropdown && (
                            <div className="dropdown-options" style={{ display: 'block', maxHeight: '280px', overflowY: 'auto' }}>
                                {daftarGrup.map(grp => (
                                    <div key={`group-dari-${grp}`}>
                                        <div className="dropdown-category-divider" style={{ background: '#f1f5f9', color: '#1e293b', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', borderLeft: '3px solid var(--primary-color)' }}>
                                             {grp}
                                        </div>
                                        {DAFTAR_SATUAN_LISTRIK.filter(item => item.grup === grp).map(item => (
                                            <div key={`dari-${item.id}`} className="option-item" style={{ paddingLeft: '20px' }} onClick={() => { setDariSatuan(item.id); setBukaDariDropdown(false); }}>
                                                <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i> 
                                                <span className="text-normal">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CUSTOM DROPDOWN: KONVERSI KE */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownKe}>
                        <label>Konversi Ke</label>
                        <div className="form-control custom-dropdown" onClick={() => { setBukaKeDropdown(!bukaKeDropdown); setBukaDariDropdown(false); }}>
                            <div>
                                <i className={`fa-solid ${opsiKeTerpilih.icon}`}></i>
                                <span className="text-normal">{opsiKeTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaKeDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaKeDropdown && (
                            <div className="dropdown-options" style={{ display: 'block', maxHeight: '280px', overflowY: 'auto' }}>
                                {daftarGrup.map(grp => (
                                    <div key={`group-ke-${grp}`}>
                                        <div className="dropdown-category-divider" style={{ background: '#f1f5f9', color: '#1e293b', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 'bold', borderLeft: '3px solid var(--primary-color)' }}>
                                             {grp}
                                        </div>
                                        {DAFTAR_SATUAN_LISTRIK.filter(item => item.grup === grp).map(item => (
                                            <div key={`ke-${item.id}`} className="option-item" style={{ paddingLeft: '20px' }} onClick={() => { setKeSatuan(item.id); setBukaKeDropdown(false); }}>
                                                <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i> 
                                                <span className="text-normal">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="result-box">
                        {hasilKonversi}
                    </div>
                </div>
            </div>

            {/* MODAL DOCUMENTATION PANDUAN */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}><i className="bi bi-x-lg"></i></button>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Hubungan Lintas Dimensi
                    </h3>
                    
                    <ul className="tool-list">

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bolt"></i> Volt (V)</span>
                            <div className="tool-text">
                                Volt (simbol: V) adalah satuan turunan dalam Sistem Internasional (SI) untuk mengukur tegangan listrik, potensial listrik, atau gaya gerak listrik.  Satuan ini dinamai dari fisikawan Italia Alessandro Volta. <br /><br /> Secara definisi teknis, 1 volt didefinisikan sebagai beda potensial antara dua titik pada kawat penghantar yang dialiri arus konstan 1 ampere, ketika daya yang hilang antara titik-titik tersebut sama dengan 1 watt.  Secara matematis, ini setara dengan 1 joule energi per 1 coulomb muatan listrik <Latex>{"1\\mathrm{V}=\\frac{1\\mathrm{J}}{1\\mathrm{C}}"}</Latex>.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail penting mengenai volt:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Fungsi Fisik: Volt mengukur "tekanan" atau dorongan yang mendorong elektron untuk mengalir melalui rangkaian listrik. Semakin tinggi voltase, semakin kuat dorongan untuk memindahkan muatan dari satu titik ke titik lain. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Arus dan Daya: Hubungan antara volt, arus (ampere), dan daya (watt) dijelaskan oleh rumus dasar kelistrikan: P=V×I Di mana $P$ adalah daya (Watt), $V$ adalah tegangan (Volt), dan $I$ adalah arus (Ampere). Artinya, untuk daya yang sama, semakin tinggi tegangan (volt), semakin kecil arus (ampere) yang dibutuhkan.
                                    </li>
                                    <li className="sub-item">
                                        Jenis Tegangan: Volt dapat mengukur tegangan DC (Arus Searah), seperti pada baterai, atau AC (Arus Bolak-balik), seperti pada listrik rumah tangga. 
                                    </li>

                                    <li className="sub-item">
                                        Analogi Sederhana: Jika listrik diibaratkan sebagai aliran air dalam pipa, volt mewakili tekanan air yang mendorong air mengalir, sedangkan ampere mewakili volume aliran airnya.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-wave-square"></i> Ampere (A)</span>
                            <div className="tool-text">
                                Ampere (disingkat A) adalah satuan dasar dalam Sistem Internasional (SI) untuk mengukur kuat arus listrik, yang mewakili jumlah muatan listrik yang mengalir melalui suatu titik dalam rangkaian per detik.  Satuan ini dinamai dari fisikawan Prancis André-Marie Ampère dan secara teknis didefinisikan berdasarkan muatan elementer tetap. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail penting mengenai volt:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Modern (2019): Sejak redefinisi SI pada Mei 2019, satu ampere didefinisikan sebagai aliran muatan listrik yang setara dengan 1/(1,602176634 × 10⁻¹⁹) muatan elementer per detik.  Secara praktis, ini berarti satu ampere adalah arus di mana 6,241509074 × 10¹⁸ elektron bergerak melewati satu titik setiap detiknya. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Coulomb: Satu ampere sama dengan satu coulomb (C) muatan listrik yang mengalir dalam satu detik (<Latex>{"1\\mathrm{A}=\\frac{1\\mathrm{C}}{\\mathrm{s}}"}</Latex>). 
                                    </li>
                                    <li className="sub-item">
                                        Analogi Aliran Air: Jika listrik dianalogikan sebagai air dalam pipa, ampere mengukur debit atau jumlah air (elektron) yang mengalir melewati pipa tersebut setiap detik.  Semakin besar nilai ampere, semakin banyak elektron yang mengalir dan semakin kuat arusnya.
                                    </li>
                                    <li className="sub-item">
                                        Perbedaan dengan Volt dan Watt: Ampere mengukur berapa banyak muatan yang mengalir (arus), berbeda dengan Volt yang mengukur "dorongan" atau potensial listrik, dan Watt yang mengukur daya atau laju penggunaan energi.  Ketiganya berkaitan melalui rumus $P = V \times I$ (Daya = Tegangan × Arus).
                                    </li>
                                    <li className="sub-item">
                                        Penerapan Praktis: Ampere digunakan untuk menentukan kapasitas peralatan listrik, seperti sekring atau Miniature Circuit Breaker (MCB), untuk memastikan perangkat mampu menangani arus listrik secara aman tanpa menyebabkan kelebihan beban. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-magnet"></i> Ohm (Ω)</span>
                            <div className="tool-text">
                                Ohm (dilambangkan dengan simbol <Latex>{"\\Omega"}</Latex>) adalah satuan internasional untuk hambatan listrik (resistansi).  Satuan ini dinamai untuk menghormati Georg Simon Ohm, fisikawan asal Jerman yang merumuskan hubungan antara tegangan, arus, dan hambatan. 
                            </div>
                            
                        <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, definisi dan karakteristik Ohm meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Fisis: Satu ohm didefinisikan sebagai hambatan pada sebuah penghantar di mana mengalir arus listrik sebesar satu ampere (A) ketika diberikan beda potensial (tegangan) sebesar satu volt (V).  Secara matematis, <Latex>{"1\\mathrm{\\Omega}=\\frac{\\mathrm{V}}{\\mathrm{A}}"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Hukum Ohm: Berdasarkan Hukum Ohm, hambatan adalah konstanta perbandingan antara tegangan ($V$) dan kuat arus ($I$) yang mengalir melalui penghantar tersebut, selama suhu dan kondisi fisik tetap konstan. Rumus dasar yang menghubungkan ketiganya adalah: V=I×R Di mana $V$ adalah tegangan dalam volt, $I$ adalah arus dalam ampere, dan $R$ adalah hambatan dalam ohm.
                                    </li>
                                    <li className="sub-item">
                                        aktor Penentu Hambatan: Nilai hambatan (dalam ohm) suatu bahan tidak hanya bergantung pada tegangan atau arus, melainkan ditentukan oleh faktor fisik material, yaitu:
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Jenis bahan (konduktivitas material).
                                        </li>
                                        <li className="sub-item">
                                            Panjang penghantar (semakin panjang, semakin besar hambatannya).
                                        </li>
                                        <li className="sub-item">
                                            Luas penampang (semakin besar luas penampang, semakin kecil hambatannya).
                                        </li>
                                        <li className="sub-item">Suhu (perubahan suhu dapat mengubah nilai resistansi).</li>
                                    </div>
                                    <p>
                                        Dalam praktik elektronika, komponen yang dirancang untuk memberikan hambatan tertentu disebut resistor, dan nilai hambatannya diukur dalam satuan ohm, mulai dari orde kecil (ohm) hingga besar (kiloohm <Latex>{"\\text{k}\\Omega"}</Latex> atau megaohm <Latex>{"\\text{M}\\Omega"}</Latex>). 
                                    </p>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-arrows-left-right"></i> Siemens (S)</span>
                            <div className="tool-text">
                                Siemens (simbol: S) adalah satuan turunan Sistem Internasional (SI) untuk mengukur konduktansi listrik, susceptansi listrik, dan admitansi listrik.  Satuan ini didefinisikan sebagai kebalikan dari ohm ($\Omega$), sehingga satu siemens sama dengan satu ampere per volt (<Latex>{"1\\mathrm{S}=\\frac{\\mathrm{A}}{\\mathrm{V}}=\\Omega^{-1}"}</Latex>). 
                            </div>

                             <div className="sub-info-box">
                                <span className="sub-info-title">Secara rinci, karakteristik satuan ini meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Asal Nama: Dinamakan menurut Ernst Werner von Siemens, seorang penemu dan industrialis Jerman. 
                                    </li>
                                    <li className="sub-item">
                                        Definisi Fisik: Konduktansi ($G$) adalah ukuran seberapa mudah arus listrik mengalir melalui suatu bahan, yang merupakan kebalikan dari hambatan listrik ($R$), dirumuskan sebagai $G = 1/R$. 
                                    </li>
                                    <li className="sub-item">
                                        Simbol: Menggunakan huruf kapital S untuk membedakannya dari sekon (s). 
                                    </li>
                                    <li className="sub-item">
                                        Sejarah SI: Ditetapkan sebagai satuan turunan SI pada tahun 1971 oleh Konferensi Umum mengenai Berat dan Ukuran ke-14. 
                                    </li>
                                    <li className="sub-item">
                                        Ekspresi Dasar: Dalam satuan pokok SI, satu siemens setara dengan <Latex>{"\\mathrm{kg}^{-1}\\cdot\\mathrm{m}^{-2}\\cdot\\mathrm{s}^{3}\\cdot\\mathrm{A}^{2}"}</Latex>. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-plug"></i> Watt (W)</span>
                            <div className="tool-text">
                                Watt (simbol: W) adalah satuan turunan dalam Sistem Internasional (SI) untuk mengukur daya listrik, yaitu laju di mana energi listrik digunakan, dihasilkan, atau diubah menjadi bentuk energi lain.  Secara definisi, 1 watt setara dengan 1 joule energi yang dikonsumsilah atau dihasilkan setiap detik ($1 W = 1 J/s$). <br /><br /> Dalam konteks kelistrikan, daya listrik (W) dapat dihitung menggunakan rumus: P = V × I Di mana $P$ adalah daya dalam watt, $V$ adalah tegangan dalam volt, dan $I$ adalah arus dalam ampere.  Dengan kata lain, satu watt adalah daya yang dihasilkan ketika arus sebesar 1 ampere mengalir melalui beda potensial sebesar 1 volt. Satuan ini dinamai untuk menghormati James Watt, seorang insinyur Skotlandia yang berkontribusi besar dalam pengembangan mesin uap. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Hubungan dengan Volt dan Ampere:</span>
                                <p>
                                    Daya listrik tidak berdiri sendiri, melainkan dipengaruhi oleh dua variabel utama: tegangan dan arus. Hubungan ketiganya dirumuskan sebagai: P=V×I Dimana:
                                </p>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        $P$ = Daya (Watt)
                                    </li>
                                    <li className="sub-item">
                                        $V$ = Tegangan (Volt).</li>
                                    <li className="sub-item">
                                        $I$ = Kuat Arus (Ampere)
                                    </li>
                                </ul>
                                <p>Jika tegangan atau arus meningkat, maka daya (watt) yang dibutuhkan atau dihasilkan juga akan meningkat.     </p>
                            </div>
                            
                            <div className="sub-info-box">
                                <span className="sub-info-title">Skala Satuan Daya</span>
                                <p>
                                    Watt dapat dinyatakan dalam kelipatan untuk mengukur daya dalam skala yang lebih besar, yang umum digunakan dalam tagihan listrik dan industri:
                                </p>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Kilowatt (kW): 1.000 watt.
                                    </li>
                                    <li className="sub-item">
                                        Megawatt (MW): 1.000.000 watt (sering digunakan untuk pembangkit listrik).
                                    </li>
                                    <li className="sub-item">
                                        Gigawatt (GW): 1.000.000.000 watt. 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Perbedaan Watt (W) dan Kilowatt-Hour (kWh):</span>
                                <p>
                                    Sering terjadi kebingungan antara daya dan energi. Watt mengukur kecepatan penggunaan energi pada satu saat tertentu (seperti kecepatan mobil), sedangkan kWh (kilowatt-hour) mengukur total energi yang dikonsumsi selama jangka waktu tertentu (seperti jarak tempuh).  Tagihan listrik biasanya dihitung berdasarkan kWh, bukan watt.
                                </p>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Aplikasi Praktis</span>
                                <p>
                                    Setiap peralatan elektronik memiliki rating watt yang menunjukkan konsumsi energinya. Alat dengan watt lebih tinggi akan menggunakan energi lebih banyak dan menghasilkan biaya listrik yang lebih besar seiring waktu. Contohnya, lampu LED 6W memiliki daya lebih rendah dan lebih hemat energi dibandingkan lampu pijar dengan kecerahan serupa yang mungkin membutuhkan daya lebih tinggi. 
                                </p>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bolt-lightning"></i> Volt Ampere (VA)</span>
                            <div className="tool-text">
                                Volt Ampere (VA) adalah satuan pengukuran untuk daya semu (apparent power) dalam rangkaian listrik, yang merupakan hasil kali antara tegangan efektif (Volt) dan arus efektif (Ampere).  Satuan ini terutama digunakan dalam sirkuit arus bolak-balik (AC) untuk menyatakan kapasitas total perangkat seperti generator, trafo, atau Uninterruptible Power Supply (UPS).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah penjelasan detail mengenai Volt Ampere:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Perbedaan dengan Watt: Dalam rangkaian arus searah (DC), 1 VA sama dengan 1 Watt karena tidak ada hambatan reaktif.  Namun, dalam rangkaian arus bolak-balik (AC), VA selalu lebih besar atau sama dengan Watt.  Hal ini karena VA mencakup daya nyata (yang diubah menjadi kerja/panas) dan daya reaktif (yang digunakan untuk menciptakan medan magnet pada induktor/kapasitor), sementara Watt hanya mengukur daya nyata yang benar-benar terpakai.
                                    </li>
                                    <li className="sub-item">
                                        Rumus Perhitungan: Daya semu dihitung dengan rumus S=V×I, di mana S adalah daya dalam Volt Ampere, V adalah tegangan, dan I adalah arus. Untuk mendapatkan daya nyata dalam Watt ( P ), perlu dikalikan dengan faktor daya (power factor atau cosϕ ), sehingga <Latex>{"P = V \\times I \\cos\\varphi"}</Latex>
                                    </li>
                                    <li className="sub-item">
                                        Kegunaan Praktis: PLN dan produsen perangkat listrik menggunakan VA untuk menentukan batas kapasitas maksimal aliran listrik tanpa memperhitungkan efisiensi penggunaan daya. Sebagai contoh, sebuah UPS berkapasitas 600 VA mungkin hanya mampu mensuplai daya nyata sekitar 360–480 Watt (tergantung faktor daya perangkat), sehingga pengguna tidak boleh menghubungkan beban dengan total Watt melebihi kapasitas tersebut meskipun angkanya terlihat lebih kecil dari VA. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-fire"></i> Joule (J)</span>
                            <div className="tool-text">
                                Joule (simbol: J) adalah satuan turunan dalam Sistem Satuan Internasional (SI) yang digunakan untuk mengukur energi, usaha, atau panas.  Satuan ini dinamai dari fisikawan Inggris James Prescott Joule.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara mendetail, definisi dan hubungan Joule dalam kelistrikan serta fisika adalah sebagai berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Dasar: Satu Joule didefinisikan sebagai usaha (kerja) yang dilakukan oleh gaya satu Newton untuk memindahkan benda sejauh satu meter (<Latex>{"1\\,\\mathrm{J}=1\\,\\mathrm{N}\\cdot\\mathrm{m}"}</Latex>).  Dalam satuan pokok SI, ini setara dengan <Latex>{"1\\,\\mathrm{J}=1\\,\\mathrm{kg}\\cdot\\mathrm{m}^2/\\mathrm{s}^2"}</Latex>.
                                    </li>
                                    <li className="sub-item">
                                        Dalam Konteks Listrik: Joule merupakan satuan energi listrik.  Satu Joule setara dengan energi yang dihasilkan ketika arus listrik sebesar satu Ampere mengalir melalui hambatan satu Ohm selama satu detik. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Daya (Watt): Daya listrik adalah laju penggunaan energi. 1 Watt didefinisikan sebagai 1 Joule per detik (<Latex>{"1\\,\\mathrm{W}=1\\,\\mathrm{J}/\\mathrm{s}"}</Latex>).  Artinya, jika perangkat berdaya 1 Watt menyala selama 1 detik, ia mengonsumsi energi sebesar 1 Joule.
                                    </li>
                                    <li className="sub-item">
                                        Rumus Perhitungan: Energi listrik dalam Joule dapat dihitung menggunakan rumus: E=P×t Di mana $E$ adalah energi dalam Joule, $P$ adalah daya dalam Watt, dan $t$ adalah waktu dalam detik.
                                    </li>
                                    <li className="sub-item">
                                        Konversi Satuan:
                                    </li>

                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 kWh (kilowatt-jam) = 3.600.000 Joule (<Latex>{"3.6\\,\\mathrm{MJ}"}</Latex>).
                                        </li>
                                        <li className="sub-item">
                                            1 Joule ≈ 0,239 Kalori atau 6,24 x <Latex>{"10^{18}"}</Latex> elektronvolt (eV). 
                                        </li>
                                    </div>
                                    <p>
                                        Singkatnya, dalam sistem listrik, Joule mengukur total energi yang dikonsumsi atau dihasilkan, sedangkan Watt mengukur seberapa cepat energi tersebut digunakan. 
                                    </p>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-charging-station"></i> Watt-hour (Wh)</span>
                            <div className="tool-text">
                                Watt-hour (Wh) adalah satuan energi listrik yang setara dengan penggunaan daya 1 Watt selama 1 jam.  Satuan ini mengukur total energi yang dikonsumsi atau dihasilkan perangkat dalam periode waktu tertentu. Dalam sistem internasional, 1 Wh setara dengan 3.600 Joule (<Latex>{"1\\,\\mathrm{Wh} = 3.600\\,\\mathrm{J}"}</Latex>). <br /><br /> Kilowatt-hour (kWh) adalah satuan energi yang lebih besar, setara dengan 1.000 Wh atau penggunaan daya 1.000 Watt (1 kW) selama 1 jam.  Satuan ini adalah standar utama untuk tagihan listrik rumah tangga dan industri karena lebih praktis untuk skala konsumsi besar. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Perbedaan Utama Watt vs Watt-hour</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Watt (W): Mengukur daya atau laju aliran energi pada satu momen tertentu (analogi: kecepatan mobil). 
                                    </li>
                                    <li className="sub-item">
                                        Watt-hour (Wh/kWh): Mengukur energi total yang digunakan selama waktu tertentu (analogi: jarak tempuh). 
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Rumus Perhitungan</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Konsumsi energi dihitung dengan mengalikan daya dengan waktu: 
                                        
                                        <div className="rumus-wrapper" style={{ marginLeft: "20px" }}>
                                            <Latex block>
                                                {String.raw`
                                                \begin{aligned}
                                                E(\mathrm{Wh})
                                                &=P(\mathrm{W})\times t(\mathrm{jam})
                                                \end{aligned}
                                                `}
                                            </Latex>
                                        </div>
                                    </li>
                                    <li className="sub-item">
                                        Untuk mendapatkan kWh: <Latex>{"E(\\mathrm{kWh})=\\frac{P(\\mathrm{W})\\times t(\\mathrm{jam})}{1000}"}</Latex>
                                    </li>
                                    <li className="sub-item">
                                        Contoh: Lampu 60 Watt menyala selama 3 jam akan mengonsumsi:
                                        
                                        <div className="rumus-wrapper" style={{ marginLeft: "20px" }}>
                                            <Latex block>
                                                {String.raw`
                                                \begin{aligned}
                                                60\,\mathrm{W}\times3\,\mathrm{jam}
                                                &=180\,\mathrm{Wh}\\
                                                &=0.18\,\mathrm{kWh}
                                                \end{aligned}
                                                `}
                                            </Latex>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Satuan Turunan Lainnya</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Watt-peak (Wp): Digunakan khusus untuk panel surya, mengukur daya puncak yang dihasilkan di kondisi standar.
                                    </li>
                                    <li className="sub-item">
                                        Megawatt-hour (MWh): Digunakan untuk skala pembangkit listrik besar, di mana 1 MWh = 1.000 kWh. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-atom"></i> Coulomb (C)</span>
                            <div className="tool-text">
                                Coulomb (simbol: C) adalah satuan standar internasional (SI) untuk muatan listrik.  Satu coulomb didefinisikan sebagai jumlah muatan listrik yang dibawa oleh arus sebesar 1 ampere yang mengalir selama 1 detik (<Latex>{"1 \\text{ C} = 1 \\text{ A} \\cdot \\text{s}"}</Latex>).  <br /><br /> Secara kuantitatif, satu coulomb setara dengan muan dari sekitar <Latex>{" 6.242 \\times 10^{18} "}</Latex> elektron atau proton.  Nilai ini didasarkan pada muatan elementer ($e$) yang ditetapkan tetap sebesar <Latex>{"1.602 \\times 10^{-19} \\text{ C}"}</Latex> dalam definisi SI modern (redefinisi 2019). 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Detail Penting:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Penamaan: Dinamakan menurut fisikawan Prancis Charles-Augustin de Coulomb yang menemukan hukum interaksi gaya listrik. 
                                    </li>
                                    <li className="sub-item">
                                        Sifat: Satuan turunan SI yang dihitung dari konstanta fundamental muatan elementer. 
                                    </li>
                                    <li className="sub-item">
                                        Interaksi: Gaya antara dua muatan dihitung menggunakan Hukum Coulomb, di mana gaya tolak-menolak atau tarik-menarik berbanding lurus dengan hasil kali muatan dan berbanding terbalik dengan kuadrat jarak antar muatan. 
                                    </li>
                                    <li className="sub-item">
                                        Satuan Gaya: Satuan untuk gaya Coulomb itu sendiri adalah Newton (N), bukan Coulomb. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-battery-half"></i> Farad (F)</span>
                            <div className="tool-text">
                                Farad (simbol: F) adalah satuan kapasitansi listrik dalam Sistem Internasional (SI), yang mengukur kemampuan suatu benda (biasanya kapasitor) untuk menyimpan muatan listrik.  Satuan ini dinamai menurut fisikawan Inggris, Michael Faraday, dan didefinisikan sebagai kapasitansi di mana muatan sebesar 1 Coulomb menghasilkan beda potensial sebesar 1 Volt di antara pelat-pelat kapasitor.  Secara matematis, 1 Farad ekuivalen dengan 1 Coulomb per Volt (<Latex>{"1\\mathrm{F}=\\frac{\\mathrm{C}}{\\mathrm{V}}"}</Latex>).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Karena satuan Farad sangat besar untuk aplikasi elektronika umum, nilai kapasitansi yang lebih sering digunakan adalah turunannya:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 mikrofarad (<Latex>{"\\mu\\mathrm{F}=10^{-6}\\mathrm{F}"}</Latex>{" "}(1/1.000.000 Farad))
                                    </li>
                                    <li className="sub-item">
                                        1 nanofarad (<Latex>{"1\\mathrm{nF}=10^{-9}\\mathrm{F}"}</Latex>) (1/1.000.000.000 Farad)
                                    </li>
                                    <li className="sub-item">
                                        1 pikofarad <Latex>{"1\\mathrm{pF}=10^{-12}\\mathrm{F}"}</Latex> (1/1.000.000.000.000 Farad) 
                                    </li>
                                    <p>
                                        Dalam struktur dasar, kapasitor terdiri dari dua pelat konduktor yang dipisahkan oleh bahan isolator (dielektrik) seperti udara, keramik, atau gelas. Kapasitansi bergantung pada luas area pelat, jarak antar pelat, dan konstanta bahan dielektrik yang digunakan. 
                                    </p>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-bezier-curve"></i> Henry (H)</span>
                            <div className="tool-text">
                                Henry (dilambangkan dengan H) adalah satuan SI untuk induktansi, yaitu sifat rangkaian listrik yang menyebabkan timbulnya gaya gerak listrik (GGL) akibat perubahan arus.  Satuan ini dinamai dari fisikawan Amerika Serikat, Joseph Henry, dan didefinisikan sebagai induktansi di mana perubahan arus sebesar 1 ampere per detik menginduksi GGL sebesar 1 volt. 
                            </div>
                            
                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis dan matematis, konsep Henry mencakup aspek-aspek berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Simbol dan Rumus: Induktansi dilambangkan dengan huruf L. Hubungan antara tegangan induksi ($v$), induktansi ($L$), dan laju perubahan arus ($di/dt$) dinyatakan dalam rumus: <Latex>{"V=L\\frac{di}{dt}"}</Latex>
                                    </li>
                                    <li className="sub-item">
                                        Jenis Induktansi:
                                    </li>
                                    
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Induktansi Diri (Self-Inductance): GGL yang timbul dalam rangkaian itu sendiri akibat perubahan arus di dalamnya.
                                        </li>
                                        <li className="sub-item">
                                            Induktansi Bersama (Mutual Inductance): GGL yang timbul pada satu rangkaian akibat perubahan arus pada rangkaian lain yang berdekatan secara magnetis, dinotasikan dengan huruf M.
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        urunan Satuan: Karena nilai 1 Henry sangat besar, dalam praktik elektronika sering digunakan satuan turunan seperti miliHenry (mH), mikroHenry ($\mu$H), nanoHenry (nH), dan picoHenry (pH).
                                    </li>
                                    <li className="sub-item">
                                        Energi Tersimpan: Induktor menyimpan energi dalam bentuk medan magnet. Energi ($W$) yang tersimpan dalam induktor dengan induktansi $L$ yang dialiri arus $I$ dihitung dengan rumus: W= <Latex>{"\\frac{1}{2}LI^{2}"}</Latex>di mana $W$ dalam Joule, $L$ dalam Henry, dan $I$ dalam Ampere. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-magnet"></i> Weber (Wb)</span>
                            <div className="tool-text">
                                Weber (simbol: Wb) adalah satuan SI untuk fluks magnetik.  Satuan ini dinamai dari fisikawan Jerman Wilhelm Eduard Weber. <br /><br /> Secara definisi, satu Weber adalah jumlah fluks magnetik yang, ketika berubah secara seragam dalam satu detik, menghasilkan gaya gerak listrik (GGL) sebesar 1 volt di dalam rangkaian tertutup.  Dengan kata lain, jika fluks magnetik sebesar 1 Wb berubah menjadi nol dalam waktu 1 detik, maka GGL yang diinduksi adalah 1 volt.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Satuan Turunan dan Dimensi:</span>
                                <ul className="sub-list">
                                    <p>
                                        Dalam Sistem Internasional, weber dapat dinyatakan dalam berbagai satuan turunan yang setara:
                                    </p>
                                    <li className="sub-item">
                                        Volt-detik ($V \cdot s$)
                                    </li>
                                    <li className="sub-item">
                                        Tesla-meter persegi ($T \cdot m^2$)
                                    </li>
                                    <li>
                                        Joule per ampere ($J / A$)
                                    </li>
                                    <li>
                                        Dimensi dasar SI: <Latex>{"\\frac{\\mathrm{kg}\\cdot\\mathrm{m}^{2}}{\\mathrm{s}^{2}\\cdot\\mathrm{A}}"}</Latex>
                                    </li>
                                    
                                    <p>
                                        Hubungan konversinya adalah: <Latex>{"1\\mathrm{Wb}=1\\mathrm{V}\\cdot\\mathrm{s}=1\\mathrm{T}\\cdot\\mathrm{m}^{2}=\\frac{1\\mathrm{J}}{\\mathrm{A}}"}</Latex>
                                    </p>
                                    <p>
                                        Satu weber juga setara dengan $10^8$ maxwell (Mx), yang merupakan satuan fluks magnetik dalam sistem CGS. Kerapatan fluks magnetik sebesar satu weber per meter persegi (<Latex>{"1\\mathrm{T}=\\frac{1\\mathrm{Wb}}{\\mathrm{m}^{2}}"}</Latex>) sama dengan satu tesla. 
                                    </p>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-compass"></i> Tesla (T)</span>
                            <div className="tool-text">
                                Tesla (simbol: T) adalah Satuan Internasional (SI) untuk densitas fluks magnetik atau intensitas medan magnet.  Satuan ini diresmikan oleh konferensi CGPM di Paris pada tahun 1960 sebagai penghormatan bagi ilmuwan Nikola Tesla. <br /><br /> Secara definisi fisika, satu tesla didefinisikan sebagai medan magnet yang menghasilkan gaya sebesar satu newton (N) pada setiap ampere (A) arus listrik per meter (m) konduktor.  Rumus matematisnya adalah: 
                                <div className="rumus-wrapper" style={{ marginLeft: "20px" }}>
                                    <Latex block>
                                        {String.raw`
                                        \begin{aligned}
                                        1\mathrm{T}
                                        &=\frac{1\mathrm{N}}{\mathrm{A}\cdot\mathrm{m}}\\
                                        &=\frac{1\mathrm{kg}}{\mathrm{s}^{2}\cdot\mathrm{A}}\\
                                        &=\frac{1\mathrm{V}\cdot\mathrm{s}}{\mathrm{m}^{2}}
                                        \end{aligned}
                                        `}
                                    </Latex>
                                </div>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah rincian intensitas medan magnet dalam satuan Tesla::</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Kekuatan Satuan: Satu tesla merupakan medan magnet yang sangat kuat.  Oleh karena itu, dalam praktik ilmiah dan medis, medan magnet sering dinyatakan dalam mikrotesla (<Latex>{"\\mu\\text{T}"}</Latex>). 
                                    </li>
                                    <li className="sub-item">
                                        Perbandingan Umum:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Medan Bumi: Sekitar <Latex>{"50\\,\\mathrm{\\mu T}\\;(0.00005\\,\\mathrm{T})"}</Latex>.
                                        </li>
                                        <li className="sub-item">
                                            Peralatan Listrik Rumah Tangga: Antara <Latex>{"0.02\\text{ hingga }7\\,\\mu\\mathrm{T}"}</Latex>
                                        </li>
                                        <li className="sub-item">
                                            Medan Terkuat di Laboratorium: Dapat mencapai <Latex>{"20{,}000{,}000\\,\\mu\\mathrm{T}\\;(20\\,\\mathrm{T})"}</Latex>
                                        </li>
                                    </div>
                                    <li>
                                        Satuan Non-SI: Satuan Gauss (G) masih kadang digunakan, di mana <Latex>{"1\\,\\mathrm{T}=10{,}000\\,\\mathrm{G}"}</Latex>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-arrow-up-right-dots"></i> Hertz (Hz)</span>
                            <div className="tool-text">
                                Hertz (Hz) adalah satuan internasional untuk mengukur frekuensi, yang didefinisikan sebagai jumlah siklus atau getaran yang terjadi dalam satu detik.  Dalam konteks sistem kelistrikan, satuan ini digunakan untuk menyatakan seberapa sering arus bolak-balik (AC) berubah arah, di mana 1 Hz setara dengan satu siklus gelombang listrik penuh per detik. <br /><br /> Secara teknis, frekuensi listrik menunjukkan kecepatan perubahan tegangan dari nol, ke puncak positif, ke puncak negatif, dan kembali ke nol. Di Indonesia, standar frekuensi yang digunakan adalah 50 Hz, artinya arus listrik berbolak-balik sebanyak 50 kali setiap detik.  Standar ini dipilih sebagai kompromi antara efisiensi transmisi daya dan kebutuhan teknis mesin listrik, serta memastikan peralatan elektronik bekerja optimal dan stabil tanpa kerusakan akibat fluktuasi. <br /><br /> Perhitungan frekuensi berbanding terbalik dengan periode waktu yang dibutuhkan untuk satu siklus lengkap ($f = 1/T$). Jika frekuensi menyimpang dari standar 50 Hz, hal tersebut dapat menyebabkan ketidakstabilan sistem, penurunan efisiensi motor listrik, hingga potensi kerusakan pada perangkat elektronik yang sensitif terhadap perubahan frekuensi. 
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}