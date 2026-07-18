import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 AKURASI FISIKA: Faktor konversi berbasis satuan dasar Pascal (Pa)
const FAKTOR_KONVERSI_TEKANAN = {
    pascal: 1,
    kilopascal: 1000,            // 🌟 TAMBAHAN BARU: 1 kPa = 1.000 Pa
    megapascal: 1000000,         // 1 MPa = 1.000.000 Pa
    psi: 6894.757293168,         // 1 Pound per square inch ≈ 6894.757 Pa
    bar: 100000,                 // 1 bar = 100.000 Pa
    milibar: 100,                // 1 mbar = 100 Pa
    atmosfer: 101325,            // 1 atm (Standar Atmo) = 101.325 Pa
    milimeter_merkuri: 133.322387415, // 1 mmHg ≈ 133.322 Pa
    torr: 133.322368421,         // 1 Torr = 101325 / 760 Pa
    kgf_cm2: 98066.5             // 1 kgf/cm² (Atmosfer Teknis) = 98.066,5 Pa
};

// 🌟 STRUKTUR DATA 10 OPSI TERINTEGRASI SENPAI
const DAFTAR_SATUAN_TEKANAN = [
    { id: 'pascal', label: 'Pascal (Pa)', icon: 'fa-gauge-simple' },
    { id: 'kilopascal', label: 'Kilopascal (kPa)', icon: 'fa-gauge-simple' },
    { id: 'megapascal', label: 'Mega Pascal (MPa)', icon: 'fa-gauge' },
    { id: 'psi', label: 'PSI (psi)', icon: 'fa-compress' },
    { id: 'bar', label: 'Bar (bar)', icon: 'fa-wind' },
    { id: 'milibar', label: 'Milibar (mbar)', icon: 'fa-cloud-sun-rain' },
    { id: 'atmosfer', label: 'Atmosfer (atm)', icon: 'fa-globe' },
    { id: 'milimeter_merkuri', label: 'Milimeter Merkuri (mmHg)', icon: 'fa-temperature-half' },
    { id: 'torr', label: 'Torr (Torr)', icon: 'fa-flask' },
    { id: 'kgf_cm2', label: 'Kilogram Force / cm² (kgf/cm²)', icon: 'fa-weight-hanging' }
];

export default function KalkulatorTekanan() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('kilopascal'); 
    const [keSatuan, setKeSatuan] = useState('bar');
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
    const opsiDariTerpilih = DAFTAR_SATUAN_TEKANAN.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_TEKANAN[1];
    const opsiKeTerpilih = DAFTAR_SATUAN_TEKANAN.find(s => s.id === keSatuan) || DAFTAR_SATUAN_TEKANAN[4];

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

    // Logika Hitung Konversi Tekanan (Real-time & Presisi Tinggi)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam Pa) / Faktor Tujuan dalam Pa
        const nilaiDalamPascal = nilaiAngka * FAKTOR_KONVERSI_TEKANAN[dariSatuan];
        const hasilAkhir = nilaiDalamPascal / FAKTOR_KONVERSI_TEKANAN[keSatuan];

        // Memformat tampilan desimal agar rapi
        let hasilDiformat;
        if (hasilAkhir < 1e-4 || hasilAkhir > 1e12) {
            hasilDiformat = hasilAkhir.toExponential(6);
        } else {
            hasilDiformat = Number(hasilAkhir.toFixed(6)).toString();
        }
        
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
                            <i className="fa-solid fa-gauge-simple" style={{ marginRight: '10px' }}></i> 
                            Konversi Satuan Tekanan
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Tekanan" 
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
                                {DAFTAR_SATUAN_TEKANAN.map((item) => (
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
                                {DAFTAR_SATUAN_TEKANAN.map((item) => (
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
                SISTEM POPUP MODAL (PANDUAN FISIKA TEKANAN MULTI-SATUAN)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Informasi & Korelasi Satuan Tekanan
                    </h3>
                    
                    <ul className="tool-list">
                         <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-gauge-simple"></i> Pascal (Pa)</span>
                            <div className="tool-text">
                                Pascal (simbol: Pa) adalah satuan turunan Sistem Internasional (SI) untuk mengukur tekanan atau tegangan, yang dinamai dari fisikawan Prancis Blaise Pascal.  Secara definisi, 1 pascal setara dengan 1 newton per meter persegi ( 1 Pa=1 N/m 2), yang juga dapat dinyatakan dalam satuan dasar SI sebagai 1 kilogram per meter per detik kuadrat ( 1 Pa=1 kg/(m⋅s 2 ) ). <br /> <br /> Karena nilai 1 Pa sangat kecil, dalam aplikasi praktis seperti meteorologi atau industri, satuan ini sering digunakan dalam bentuk kelipatannya, seperti hektopascal (hPa) untuk tekanan udara atau kilopascal (kPa) dan megapascal (MPa) untuk tekanan yang lebih besar.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi dasar dari Pascal ke satuan tekanan lain meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 atm (atmosfer standar) = 101.325 Pa
                                    </li>
                                    <li className="sub-item">
                                        1 bar = 100.000 Pa
                                    </li>
                                    <li className="sub-item">
                                        1 Torr atau 1 mmHg ≈ 133,322 Pa
                                    </li>
                                    <li className="sub-item">
                                        1 psi (pound-force per square inch) ≈ 6.895 Pa
                                    </li>
                                </ul>
                                <p>
                                    Satuan ini berlaku universal untuk berbagai jenis tekanan, baik tekanan zat padat (gaya dibagi luas penampang), tekanan hidrostatis (pada zat cair diam), maupun tekanan udara (gas).
                                </p>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-gauge-simple"></i> Kilopascal (kPa)</span>
                            <div className="tool-text">
                                Kilopascal (simbol: kPa) adalah satuan tekanan dalam Sistem Internasional (SI) yang setara dengan 1.000 Pascal.  Satuan ini merupakan kelipatan praktis dari Pascal karena nilai Pascal sendiri sangat kecil, sehingga kPa lebih umum digunakan dalam aplikasi sehari-hari seperti prakiraan cuaca, sistem HVAC, dan spesifikasi teknis industri. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail konversi dan karakteristik utama dari Kilopascal:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Dasar: 1 kPa = 1.000 Pa (Pascal).  Pascal sendiri didefinisikan sebagai satu Newton per meter persegi (1 N/m²). 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Satuan Lain:
                                    </li>
                                     <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 kPa = 0,01 bar (atau 1 bar = 100 kPa).
                                        </li>
                                        <li className="sub-item">
                                            1 kPa ≈ 0,145 psi (pounds per square inch).
                                        </li>
                                        <li className="sub-item">
                                            1 atm (atmosfer standar) = 101,325 kPa. 
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Konteks Penggunaan:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Dalam meteorologi, tekanan udara sering dilaporkan dalam hektopascal (hPa), di mana 1 hPa = 1 kPa.  Tekanan udara standar di permukaan laut adalah sekitar 1013 hPa atau 101,3 kPa.
                                        </li>
                                        <li className="sub-item">
                                            Dalam otomotif, tekanan ban sering diukur dalam kPa di negara-negara yang menggunakan sistem metrik.
                                        </li>
                                        <li className="sub-item">
                                            Satuan ini independen terhadap gravitasi lokal, suhu lingkungan, atau densitas media, menjadikannya standar yang konsisten secara ilmiah. 
                                        </li>
                                    </div>
                                    <p>
                                        Singkatnya, kilopascal adalah unit tekanan yang setara dengan 1.000 Newton per meter persegi, digunakan secara luas untuk pengukuran tekanan menengah hingga tinggi dalam skala praktis dibandingkan dengan Pascal murni.
                                    </p>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-gauge"></i> Megapascal (MPa)</span>
                            <div className="tool-text">
                                Megapascal (MPa) adalah satuan metrik untuk tekanan yang setara dengan satu juta Pascal{" "} (<Latex>{"1\\text{MPa}=1.000.000\\text{Pa}"}</Latex>). {" "}  Satuan ini dinamai dari ilmuwan Prancis, Blaise Pascal, dan merupakan kelipatan dari satuan dasar SI untuk tekanan. <br /> <br /> Secara teknis, 1 MPa didefinisikan sebagai tekanan yang dihasilkan oleh gaya satu newton yang bekerja pada luas permukaan satu milimeter persegi, sehingga sering dinyatakan setara dengan 1 N/mm². Karena nilainya yang besar, MPa sangat lazim digunakan dalam rekayasa struktur, industri hidrolik, dan pengujian kekuatan material (seperti beton dan baja) untuk menghindari penulisan angka nol yang terlalu banyak. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah konversi umum 1 MPa ke satuan tekanan lainnya:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Bar: 10 bar
                                    </li>
                                    <li className="sub-item">
                                        Pound per Square Inch (psi): ~145,038 psi
                                    </li>
                                    <li className="sub-item">
                                        Pound per Square Inch (psi): ~145,038 psi
                                    </li>
                                    <li className="sub-item">
                                        Kilogram per sentimeter persegi (kg/cm²): ~10,197 kg/cm²
                                    </li>
                                    <li className="sub-item">
                                        Kilopascal (kPa): 1.000 kPa 
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-compress"></i> PSI</span>
                            <div className="tool-text">
                                PSI adalah singkatan dari Pounds per Square Inch (pon per inci persegi), yaitu satuan tekanan yang mengukur gaya sebesar satu pon yang bekerja pada area seluas satu inci persegi.  Satuan ini umum digunakan di Amerika Serikat dan Inggris untuk mengukur tekanan ban, sistem hidrolik, dan kompresor udara. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis, PSI memiliki beberapa variasi penting:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        PSIA (Pounds per Square Inch Absolute): Mengukur tekanan absolut terhadap ruang hampa sempurna, termasuk tekanan atmosfer di dalamnya. 
                                    </li>
                                    <li className="sub-item">
                                        PSIG (Pounds per Square Inch Gauge): Mengukur tekanan relatif terhadap tekanan atmosfer sekitar; ini adalah pembacaan standar pada alat ukur seperti pengukur tekanan ban. 
                                    </li>
                                </ul>
                                <p className="sub-info-text"> 
                                    Untuk konversi ke satuan metrik, 1 PSI setara dengan 6.894,76 Pascal (Pa) atau sekitar 0,0689 Bar.  Sebaliknya, 1 Bar setara dengan 14,5 PSI.
                                </p>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-wind"></i> Bar</span>
                            <div className="tool-text">
                                Bar adalah satuan metrik untuk pengukuran tekanan yang didefinisikan secara tepat sebagai 100.000 pascal (Pa) atau setara dengan 100 kilopascal (kPa).  Meskipun bukan bagian dari Sistem Internasional (SI), satuan ini sangat umum digunakan di Eropa dan berbagai industri global karena nilainya yang mendekati 1 atmosfer standar (tekanan udara pada permukaan laut), yaitu sekitar 0,987 atm. <br /> <br /> Secara teknis, satu bar setara dengan tekanan yang dihasilkan oleh gaya 100.000 Newton yang bekerja pada luas permukaan 1 meter persegi.  Satuan ini sering dipakai pada pressure gauge untuk mengukur tekanan ban, sistem hidrolik, serta tekanan udara dan atmosfer dalam meteorologi karena skalanya yang lebih praktis dibandingkan pascal untuk pengukuran sehari-hari. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi umum dari bar ke satuan tekanan lainnya meliputi:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 bar = 14,5038 psi (pounds per square inch)
                                    </li>
                                    <li className="sub-item">
                                        1 bar = 0,1 MPa (megapascal)
                                    </li>
                                    <li className="sub-item">
                                        1 bar ≈ 1,02 kg/cm² (kilogram per sentimeter persegi)
                                    </li>
                                    <li className="sub-item">
                                        1 bar ≈ 10,2 meter kolom air (mH2O)
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-cloud-sun-rain"></i> Mili Bar</span>
                            <div className="tool-text">
                                Milibar (simbol: mbar atau mb) adalah satuan tekanan yang setara dengan 1/1000 dari satu bar.  Secara numerik, 1 mbar sama dengan 100 Pascal (Pa) atau 1 HektoPascal (hPa). dibandingkan pascal untuk pengukuran sehari-hari. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail teknis dan penggunaan milibar:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi dan Konversi: Karena 1 bar didefinisikan tepat sebagai 100.000 Pascal, maka 1 mbar bernilai 100 Pa.  Dalam konteks meteorologi, 1 mbar identik dengan 1 hPa. 
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Utama: Milibar adalah satuan standar dalam meteorologi untuk mengukur tekanan udara.  Tekanan udara standar di permukaan laut didefinisikan sebagai 1013,25 mbar (atau 1013,25 hPa). 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Satuan Lain:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 mbar ≈ 0,750062 mmHg (milimeter raksa).
                                        </li>
                                        <li className="sub-item">
                                            1 mbar ≈ 0,0145 psi (pounds per square inch).
                                        </li>
                                        <li className="sub-item">
                                            1 bar = 1000 mbar.
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Konteks Historis dan Ilmiah: Milibar diperkenalkan bersama dengan bar oleh Napier Shaw (1909) dan Raipeza (1910). Meskipun bukan satuan SI resmi (satuan SI untuk tekanan adalah Pascal), milibar diterima penggunaannya dengan SI dan tetap dominan dalam laporan cuaca global karena nilai angkanya yang lebih nyaman dibandingkan Pascal (misalnya, 1013 mbar lebih mudah dibaca daripada 101.300 Pa). 
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-globe"></i> Atmosfer</span>
                            <div className="tool-text">
                                Atmosfer (simbol: atm) adalah satuan tekanan yang didefinisikan secara standar sebagai 101.325 Pascal (Pa) atau 1,01325 bar.  Satuan ini mewakili rata-rata tekanan atmosfer pada permukaan laut di garis lintang 45° dan suhu 0°C.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, satuan ini setara dengan berbagai pengukuran lainnya:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1013,25 milibar (mb) atau hektopascal (hPa)
                                    </li>
                                    <li className="sub-item">
                                        760 milimeter raksa (mmHg) atau 76 cmHg
                                    </li>
                                    <li className="sub-item">
                                        14,696 pound-force per inci persegi (psi)
                                    </li>
                                    <li className="sub-item">
                                        Atmosfer digunakan sebagai acuan tekanan dalam berbagai bidang, termasuk kimia, industri, dan penyelaman scuba (sering disebut sebagai ata atau atmosfer absolut untuk tekanan total). Dalam meteorologi, tekanan udara sering dikonversi ke dalam satuan milibar atau hektopascal, di mana 1 atm ≈ 1013,25 hPa. 
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-temperature-half"></i> Milimeter Merkuri (mmHg)</span>
                            <div className="tool-text">
                                Milimeter Merkuri (mmHg) adalah satuan tekanan manometrik yang secara teknis didefinisikan sebagai tekanan yang dihasilkan oleh kolom air raksa setinggi 1 milimeter pada suhu 0 °C dengan percepatan gravitasi standar 9,80665 m/s².  Nilai ini setara secara tepat dengan 133,322387415 pascal (Pa). <br /> <br /> Satuan ini dilambangkan dengan mmHg atau mm Hg dan, meskipun bukan bagian dari Sistem Internasional (SI), tetap menjadi standar emas dalam praktik klinis global, khususnya untuk pengukuran tekanan darah, tekanan intraokular, dan tekanan intrakranial. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Definisi Teknis dan Konversi
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Definisi Dasar: mmHg didefinisikan berdasarkan kepadatan merkuri sebesar 13.595,1 kg/m³ (padat pada 0 °C) dan gravitasi standar. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan Torr: 1 mmHg sangat mendekati 1 Torr (yang didefinisikan sebagai 1/760 atmosfer standar).  Perbedaan relatif antara keduanya kurang dari 0,000015%, sehingga dapat diabaikan untuk sebagian besar penggunaan praktis. 
                                    </li>
                                    <li className="sub-item">
                                        Konversi SI: 1 mmHg = 133,322387415 Pa
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            1 mmHg=133,322387415 Pa
                                        </li>
                                        <li className="sub-item">
                                            1 mmHg≈0,00131579 atm
                                        </li>
                                    </div>
                                    <p className="tool-label">
                                        Penggunaan dalam Pengukuran Tekanan Darah
                                    </p>
                                    <p className="tool-text">
                                        Dalam konteks medis, mmHg digunakan untuk melaporkan dua komponen tekanan darah:
                                    </p>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Tekanan Sistolik (Angka Atas): Tekanan maksimum saat jantung berkontraksi memompa darah. 
                                        </li>
                                        <li className="sub-item">
                                             Tekanan Diastolik (Angka Bawah): Tekanan minimum saat jantung beristirahat di antara detakan. 
                                        </li>
                                    </div>
                                    <li className="sub-item">
                                        Klasifikasi umum tekanan darah dalam mmHg meliputi:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Normal: Di bawah 120/80 mmHg. 
                                        </li>
                                        <li className="sub-item">
                                            Peningkatan (Elevated): Sistolik 120–129 mmHg dan diastolik di bawah 80 mmHg. 
                                        </li>
                                        <li className="sub-item">
                                            Hipertensi Tahap 1: Sistolik 130–139 mmHg atau diastolik 80–89 mmHg. 
                                        </li>
                                        <li className="sub-item">
                                            Hipertensi Tahap 2: Sistolik 140 mmHg atau lebih atau diastolik 90 mmHg atau lebih. 
                                        </li>
                                        <li className="sub-item">
                                            Krisis Hipertensi: Sistolik di atas 180 mmHg dan/atau diastolik di atas 120 mmHg (memerlukan perhatian medis darurat). 
                                        </li>
                                        <p className="tool-label">
                                            Alasan Penggunaan yang Berkelanjutan
                                        </p>
                                        <li className="sub-item">
                                            Meskipun alat pengukur tekanan darah berbasis merkuri fisik telah banyak digantikan oleh alat digital karena alasan toksisitas dan keamanan, satuan mmHg tetap dipertahankan.  Alasannya meliputi sejarah panjang penggunaannya, keakuratan historis, dan konsistensi dalam komunikasi medis serta perbandingan data klinis di seluruh dunia.
                                        </li>
                                    </div>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-flask"></i> Torr</span>
                            <div className="tool-text">
                                Torr adalah satuan tekanan non-SI yang didefinisikan sebagai 1/760 dari tekanan atmosfer standar.  Satuan ini dinamai untuk menghormati fisikawan Italia Evangelista Torricelli, penemu prinsip barometer pada tahun 1644. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara rinci, karakteristik satuan torr meliputi:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Kesetaraan Tekanan: 1 atm sama dengan 760 torr.  Oleh karena itu, 1 torr secara matematis sama dengan 101.325 / 760 pascal atau sekitar 133,32 Pa. 
                                    </li>
                                    <li className="sub-item">
                                        Hubungan dengan mmHg: Torr dirancang agar hampir setara dengan tekanan kolom cairan milimeter raksa (mmHg).  Secara historis keduanya dianggap sama, namun setelah redefinisi tahun 1954, nilainya berbeda sedikit (kurang dari 0,000015%), meskipun dalam praktik umum sering dianggap identik.
                                    </li>
                                    <li className="sub-item">
                                        Simbol dan Penggunaan: Simbol resmi adalah Torr (huruf T kapital).  Satuan ini umum digunakan dalam ilmu fisika, kimia, dan industri untuk mengukur tekanan rendah atau vakum, seperti pada produksi semikonduktor dan alat medis. 
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-weight-hanging"></i> Kilogram Force / cm² (kgf/cm²)</span>
                            <div className="tool-text">
                                Kilogram-force per square centimeter (kgf/cm²) adalah satuan tekanan yang didefinisikan sebagai gaya sebesar 1 kilogram yang bekerja pada area seluas 1 sentimeter persegi.  Satuan ini juga dikenal sebagai atmosfer teknis (at) dan secara teknis setara dengan 98.066 pascal (Pa) atau 98,07 kilopascal (kPa). <br /> <br /> Nilai ini didasarkan pada percepatan gravitasi standar, di mana 1 kgf (kilogram-gaya) kira-kira sama dengan 9,81 Newton (N).  Dalam konteks praktis, 1 kgf/cm² memiliki nilai yang sangat dekat dengan 1 bar (hanya berbeda sekitar 2%), namun kgf/cm² lebih umum digunakan dalam standar teknik Asia yang lama, sementara bar lebih lazim di Eropa. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi utama satuan ini adalah:
                                </span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 kgf/cm² ≈ 0,9807 bar
                                    </li>
                                    <li className="sub-item">
                                        1 kgf/cm² ≈ 14,223 psi (pon-gaya per inci persegi)
                                    </li>
                                    <li className="sub-item">
                                        1 kgf/cm² ≈ 0,098 MPa (sering dibulatkan menjadi 0,1 MPa dalam perhitungan teknik cepat) 
                                    </li>
                                    <p>
                                        Satuan ini secara historis banyak digunakan dalam aplikasi industri seperti sistem hidrolik, pengujian tekanan gas, dan tekanan ban otomotif, terutama di negara-negara seperti Tiongkok, Jepang, dan Korea Selatan, meskipun penggunaannya kini mulai menurun seiring adopsi Sistem Satuan Internasional (SI). 
                                    </p>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}