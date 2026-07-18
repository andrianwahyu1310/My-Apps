import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css'; 

// 🌟 AKURASI TINGGI: Faktor konversi berbasis satuan dasar Meter (m)
const FAKTOR_KONVERSI_PANJANG = {
    micrometer: 0.000001,
    millimeter: 0.001,
    centimeter: 0.01,
    decimeter: 0.1,
    meter: 1,
    hectometer: 100,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344,         // 1 Mil Darat = 1609.344 meter
    nauticalmile: 1852,     // 1 Mil Laut (Nautical Mile) = 1852 meter
    parsec: 3.085677581e16  // 1 Parsec (pc) = ~3.08 x 10^16 meter
};

// 🌟 PEMETAAN 13 OPSINYA SENPAI (Disinkronkan dengan ikon Font Awesome asli dari HTML Anda)
const DAFTAR_SATUAN_PANJANG = [
    { id: 'micrometer', label: 'Mikrometer (µm)', icon: 'fa-microscope' },
    { id: 'millimeter', label: 'Milimeter (mm)', icon: 'fa-ruler' },
    { id: 'centimeter', label: 'Sentimeter (cm)', icon: 'fa-ruler' },
    { id: 'decimeter', label: 'Desimeter (dm)', icon: 'fa-ruler' },
    { id: 'meter', label: 'Meter (m)', icon: 'fa-ruler-combined' },
    { id: 'hectometer', label: 'Hektometer (hm)', icon: 'fa-ruler' },
    { id: 'kilometer', label: 'Kilometer (km)', icon: 'fa-road' },
    { id: 'inch', label: 'Inci (in)', icon: 'fa-ruler-horizontal' },
    { id: 'foot', label: 'Kaki / Foot (ft)', icon: 'fa-ruler' },
    { id: 'yard', label: 'Yard (yd)', icon: 'fa-ruler' },
    { id: 'mile', label: 'Mil Darat (mi)', icon: 'fa-map-pin' },
    { id: 'nauticalmile', label: 'Mil Laut (NM)', icon: 'fa-ship' },
    { id: 'parsec', label: 'Parsec (pc)', icon: 'fa-globe' }
];

export default function KalkulatorPanjang() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('micrometer'); // Default awal sesuai HTML lama Anda
    const [keSatuan, setKeSatuan] = useState('meter');
    const [hasilKonversi, setHasilKonversi] = useState('');
    
    // State Kendali Dropdown Melayang
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    
    // State untuk Popup Dokumentasi
    const [isModalActive, setIsModalActive] = useState(false);

    // 🌟 STRATEGI REF: Deteksi titik batas koordinat fisik elemen
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    // Identifikasi Pilihan Aktif untuk Tampilan Label Dropdown
    const opsiDariTerpilih = DAFTAR_SATUAN_PANJANG.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_PANJANG[0];
    const opsiKeTerpilih = DAFTAR_SATUAN_PANJANG.find(s => s.id === keSatuan) || DAFTAR_SATUAN_PANJANG[4];

    // 🌟 PERTAHANAN GLOBAL: Auto-close saat klik di luar area box
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

    // Logika Hitung Konversi Panjang (Real-time & Presisi)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam Meter) / Faktor Tujuan dalam Meter
        const nilaiDalamMeter = nilaiAngka * FAKTOR_KONVERSI_PANJANG[dariSatuan];
        const hasilAkhir = nilaiDalamMeter / FAKTOR_KONVERSI_PANJANG[keSatuan];

        // Memformat notasi ilmiah untuk Parsec agar tidak merusak tata letak CSS box
        let hasilDiformat;
        if (hasilAkhir < 1e-5 || hasilAkhir > 1e12) {
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
                            <i className="fa-solid fa-ruler-combined" style={{ marginRight: '10px' }}></i> 
                            Konversi Panjang & Jarak
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Jarak" 
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
                                {DAFTAR_SATUAN_PANJANG.map((item) => (
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
                                {DAFTAR_SATUAN_PANJANG.map((item) => (
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

                    {/* TOMBOL PICU HITUNG */}
                    <button className="btn-hitung" onClick={hitungKonversi}>
                        Hitung Konversi
                    </button>

                    {/* TAMPILAN OUTPUT HASIL */}
                    <div className="result-box">
                        {hasilKonversi}
                    </div>
                </div>
            </div>

            {/* =========================================================
                SISTEM POPUP MODAL (DOKUMENTASI PANDUAN JARAK)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Panduan Satuan Jarak & Panjang
                    </h3>
                    
                    <ul className="tool-list">

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-microscope"></i> Mikrometer (&mu;m)</span>
                            <div className="tool-text">
                            Mikrometer atau micrometre (ejaan internasional seperti yang digunakan oleh Biro Internasional untuk Ukuran dan Timbangan simbol SI: μm) atau micrometer (Ejaan Amerika) adalah satuan turunan SI untuk panjang, yang sama dengan 1 × \(10^{-6}\) meter (Awalan SI "mikro-" = \(10^{-6}\); yaitu, sepersejuta meter (atau seperseribu milimeter, 0,001 mm, atau sekitar 0,000039 inci).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi Utama adalah:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 μm = 0,001 mm (seperseribu milimeter)</li>
                                    <li className="sub-item">1 μm = 0,0001 cm (seperseratus ribu sentimeter)</li>
                                    <li className="sub-item">1 μm = 1000 nm (seribu nanometer)</li>

                                    <li className="sub-item">
                                        Satuan ini umumnya digunakan untuk mengukur objek mikroskopis seperti diameter sel bakteri (1–10 μm), diameter rambut manusia (17–181 μm), atau ketebalan kertas.
                                    </li>

                                    <br /><span className="sub-info-title">Contoh:</span>
                                    <p>Antara 1 μm dan 10 μm:</p>
                                    <li className="sub-item">1–10 μm - panjang dari beberapa bakteri yang khas</li>
                                    <li className="sub-item">10 μm - Ukuran hifa jamur</li>
                                    <li className="sub-item">5 μm - panjang kepala spermatozoa manusia [2]</li>
                                    <li className="sub-item">3–8 μm - lebar untaian jaring laba-laba</li>
                                    <li className="sub-item">sekitar 10 μm - ukuran kabut</li>

                                    <p>Antara 10 μm dan 100 μm</p>
                                    <li className="sub-item">sekitar 10–12 μm - ketebalan bungkus plastik</li>
                                    <li className="sub-item">10 hingga 55 μm - lebar serat wol</li>
                                    <li className="sub-item">17 hingga 181 μm - diameter rambut manusia</li>
                                    <li className="sub-item">70 hingga 180 μm - ketebalan kertas</li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-ruler-combined"></i> Milimeter (mm)</span>
                            <div className="tool-text">
                                Milimeter (disingkat mm) adalah satuan turunan SI untuk besaran panjang yang setara dengan 1/1000 meter atau 0,001 meter.  Dalam tangga satuan panjang, milimeter merupakan satuan yang lebih kecil dari sentimeter (cm), di mana 1 cm = 10 mm. <br /><br /> Satuan ini digunakan untuk mengukur objek dengan ketelitian tinggi, seperti ketebalan kertas, diameter kawat, atau komponen presisi. Secara definisi internasional, satu milimeter sama dengan seribu mikrometer <Latex>{String.raw`1\text{ mm}=1000\mu\text{m}`}</Latex>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-ruler"></i> Sentimeter (cm)</span>
                            <div className="tool-text">
                                Sentimeter adalah satuan panjang dalam sistem metrik, sama dengan seperseratus meter, centi menjadi awalan SI dengan faktor <span className="highlight">\(\frac1{100}\)</span>. Sentimeter merupakan satuan pokok untuk panjang dalam sistem satuan sentimeter – gram – detik (CGS) yang sekarang sudah tidak digunakan lagi.
                            </div>
                            
                        <div className="sub-info-box">
                                <span className="sub-info-title">Konversi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 sentimeter = 10 milimeter
                                        <br />

                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        = 0,01 meter

                                        <br />

                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        = <Latex>{"\\frac{1}{2.54}"}</Latex>
                                        {" "}=
                                        {" "}0,393700787401574803149606299212598425196850 inci

                                        <br />

                                        <span
                                            style={{
                                                fontStyle: "italic",
                                                color: "#aaaaaa",
                                                fontSize: "0.9em"
                                            }}
                                        >
                                            (Ada <strong>persis 2,54</strong> sentimeter dalam satu inci.)
                                        </span>
                                    </li>
                                    <li className="sub-item" style={{ margin: 'top: 10px' }}>
                                    Satu mililiter didefinisikan sebagai satu sentimeter kubik, di bawah sistem satuan SI.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-robot"></i> Desimeter (dm)</span>
                            <div className="tool-text">
                                Desimeter (simbol: dm) adalah satuan ukuran panjang dalam sistem metrik yang setara dengan seperseruluh meter atau 0,1 meter.  Dalam konteks satuan panjang, 1 desimeter juga sama dengan 10 sentimeter (cm) atau 100 milimeter (mm).  Satuan ini umumnya digunakan untuk mengukur benda berukuran sedang, seperti panjang buku tulis atau papan tulis, serta digunakan dalam pengukuran volume di mana 1 dm³ setara dengan 1 liter. 
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="bi bi-activity"></i> Meter (m)</span>
                            <div className="tool-text">
                                Meter (m) adalah satuan dasar untuk panjang atau jarak dalam sistem Satuan Internasional (SI). Secara ilmiah, satu meter didefinisikan sebagai jarak yang ditempuh oleh cahaya di ruang hampa selama <Latex className="highlight">\(\frac1^299.792.458\)</Latex> detik.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Dalam kehidupan sehari-hari, Anda sering menggunakannya untuk mengukur panjang ruangan, tinggi benda, atau jarak tempuh. Untuk memahaminya lebih mudah:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 m sama dengan 100 sentimeter (cm).</li>
                                    <li className="sub-item">1 m setara dengan 3,28 kaki atau sekitar 39,37 inci.</li>
                                    <li className="sub-item">1.000 m disebut sebagai 1 kilometer (km).</li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-ruler-vertical"></i> Hektometer (hm)</span>
                            <div className="tool-text">
                                Hektometer adalah satuan ukuran panjang dalam sistem metrik dengan simbol hm. Satu hektometer setara dengan 100 meter atau sepersepuluh kilometer.  Satuan ini digunakan untuk mengukur jarak yang lebih besar dari meter, seperti panjang lapangan atau taman, dan terletak di antara kilometer dan dekameter dalam tangga satuan panjang.
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="bi bi-speedometer2"></i> Kilometer (km)</span>
                            <div className="tool-text">
                                Kilometer (disingkat km) adalah satuan panjang dalam sistem metrik yang setara dengan 1.000 meter. Satuan ini umumnya digunakan untuk mengukur jarak yang jauh antara dua lokasi, seperti jarak antar kota atau panjang perjalanan. Alat ukur yang paling umum digunakan untuk melihat skala sentimeter secara langsung adalah penggaris biasa, meteran kain, atau pita ukur.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Sebagai acuan dalam kehidupan sehari-hari:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 km sama dengan 1.000 meter.</li>
                                    <li className="sub-item">1 km juga setara dengan 0,621 mil.</li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-fingerprint"></i> Inci (in)</span>
                            <div className="tool-text">
                                Inci adalah satuan pengukuran panjang dalam sistem imperial yang setara dengan 2,54 sentimeter atau 25,4 milimeter.  Satuan ini umumnya digunakan di Amerika Serikat, Kanada, Inggris, dan Jepang untuk mengukur dimensi benda seperti layar elektronik, ban, serta dalam konstruksi.  Dalam sistem pengukuran, satu inci dilambangkan dengan in atau tanda petik dua ("), dan bernilai sama dengan 1/12 kaki atau 1/36 yard.
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-shoe-prints"></i> Kaki/feet (ft)</span>
                            <div className="tool-text">
                                Kaki (disingkat ft) atau feet (bentuk jamak) adalah satuan ukuran panjang non-Sistem Internasional (non-SI) yang umum digunakan dalam sistem imperial Inggris dan Amerika Serikat. Berdasarkan kesepakatan internasional, 1 kaki setara dengan 0,3048 meter (atau 30,48 cm).
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Berikut adalah detail lengkap mengenai satuan kaki (feet):</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        Perbedaan Istilah: Foot adalah bentuk tunggal (misal: 1 foot), sedangkan feet adalah bentuk jamak (misal: 5 feet).
                                    </li>
                                    <li className="sub-item">
                                        Simbol Penulisan: Sering disingkat menjadi "ft" atau menggunakan tanda petik tunggal ('/apostrof). Contoh: 6 kaki ditulis menjadi 6 ft atau 6'.
                                    </li>
                                    <li className="sub-item">
                                        Penggunaan Umum: Digunakan secara luas di industri penerbangan internasional (ketinggian pesawat), arsitektur, ukuran tinggi badan, dan pengukuran bidang tanah di AS/Inggris.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-stroopwafel"></i> Yard (yd)</span>
                            <div className="tool-text">
                                Yard (disingkat: yd) adalah satuan pokok untuk ukuran panjang dalam unit Imperial. Menurut sistem yard internasional, 1 yard sama dengan 3 kaki atau 36 inci. Satuan luas yang menggunakan yard disebut yard persegi. Yard juga sering digunakan untuk menyatakan jarak.
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Contoh konversi dengan satuan panjang lain</span>
                                <ul className="sub-list">
                                    <p>1 yard internasional sama dengan:</p>
                                    <li className="sub-item">0,5 fathom (1 fathom sama dengan 2 yard)</li>
                                    <li className="sub-item">3 kaki (1 kaki sama dengan 1/3 yard)</li>
                                    <li className="sub-item">36 inci</li>
                                    <li className="sub-item">0,9144 meter (1 meter sama dengan 1,0936 yard internasional)</li>
                                    <p>
                                        Pada zaman dulu, yard masih dibagi-bagi dengan metode biner menjadi 2, 4, 8 dan 16 bagian yang disebut setengah yard, span, finger, dan nail.
                                    </p>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="bi bi-wind"></i> Mil (mile)</span>
                            <div className="tool-text">
                                Knot (kn atau kt) adalah satuan kecepatan maritim dan penerbangan. Satu knot setara dengan 1 mil laut per jam. Jika dikonversikan ke satuan darat, 1 knot sama dengan 1,852 kilometer per jam atau sekitar 1,151 mil per jam.Mil ialah salah satu dari sejumlah pengukur jarak. Berasal dari frasa Latin mille passus untuk <span style={{ fontStyle: 'italic' }}>"seribu langkah"</span> (jamak: milia passuum), dan merujuk kepada jarak yang ditempuh saat prajurit Romawi meninggalkan jejak kaki 1.000 kali saat berjalan. Saat mengukur jarak laut atau perjalanan udara, digunakan istilah mil laut. Istilah ini merupakan jarak yang sama dengan yang diliputi oleh 1/60 dari 1 derajat busur sepanjang atau jelasnya 1,852 km.
                            </div>
                            
                            <div className="sub-info-box">
                                <span className="sub-info-title">Terdapat dua jenis utama mil yang umum digunakan dalam navigasi dan pengukuran sehari-hari, serta satu definisi khusus dalam bidang industri:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }} >Mil Laut (Nautical Mile)</span> <br /> Digunakan secara internasional untuk navigasi kapal di laut dan pesawat di udara. Ukuran ini didasarkan pada keliling Bumi (satu menit garis lintang).1 Mil Laut = 1.852 meter (persis \(1,852\) kilometer).
                                    </li>
                                    <li className="sub-item">
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }} >"Mil" untuk Ketebalan (Mill)</span> <br /> Berbeda dengan jarak, dalam dunia teknik dan manufaktur, istilah "mil" (sering disebut thou) digunakan untuk menyatakan ketebalan material yang sangat tipis.1 Mil = \(0,001\) inci (sekitar \(0,0254\) milimeter).
                                    </li>
                                    <li className="sub-item">
                                        Mil persegi adalah satuan luas untuk mil. 1 mil² (dibaca: 1 mil persegi) adalah setara dengan sebuah wilayah berbentuk bujursangkar yang panjang sisinya 1 mil.
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-globe"></i> Parsek (pc)</span>
                            <div className="tool-text">
                                Parsek (bahasa Inggris: parsec, disingkat pc) adalah satuan panjang yang digunakan dalam astronomi untuk benda-benda di luar Tata Surya. Kata Parsec dalam bahasa Inggris merupakan singkatan dari "parallax of one arc second".

                                <br /><br />

                                Satuan ini didasarkan pada metode paralaks trigonometri, metode standar paling kuno yang digunakan untuk menentukan jarak bintang. Sudut yang dibuat oleh bintang terhadap jari-jari orbit Bumi mengelilingi Matahari disebut paralaks.

                                <br /><br />

                                Parsek didefinisikan sebagai jarak suatu bintang yang memiliki paralaks sebesar 1 detik busur dari Bumi. Secara lain, parsek adalah jarak di mana dua benda yang terpisah sejauh 1 satuan astronomi tampak terpisah oleh sudut sebesar 1 detik busur.

                                <br /><br />

                                Oleh karena itu:

                                <br />

                                <div className="rumus-wrapper">
                                    <Latex block>
                                        {String.raw`
                                        \begin{aligned}
                                        \frac{360\cdot60\cdot60}{2\pi}\,\mathrm{SA}
                                        &=206265\,\mathrm{SA}\\
                                        &=3.08568\times10^{16}\,\mathrm{m}\\
                                        &=30.8568\,\mathrm{Pm}\\
                                        &=3.2616\,\mathrm{tc}
                                        \end{aligned}
                                        `}
                                    </Latex>

                                    <span className="rumus-keterangan">
                                        (tahun cahaya)
                                    </span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}