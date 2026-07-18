import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Latex } from "../../utils/autoLatex";
import '/main/base/tools.css';

// 🌟 AKURASI FISIKA: Faktor konversi berbasis satuan dasar Meter per detik (m/s)
const FAKTOR_KONVERSI_KECEPATAN = {
    m_s: 1,
    km_jam: 1 / 3.6,             // 1 km/jam = 0.277778 m/s
    mph: 0.44704,                // 1 mph (Mil/jam) = 0.44704 m/s murni
    m_menit: 1 / 60,             // 1 m/menit = 0.016667 m/s
    knot: 0.51444444444,         // 1 Knot = 1852 meter / 3600 detik
    mach: 343                    // Mach 1 (pada udara 20°C di permukaan laut) = 343 m/s
};

// 🌟 STRUKTUR DATA 6 OPSI KECEPATAN
const DAFTAR_SATUAN_KECEPATAN = [
    { id: 'm_s', label: 'Meter per detik (m/s)', icon: 'fa-person-running' },
    { id: 'km_jam', label: 'Kilometer per jam (km/jam)', icon: 'fa-car' },
    { id: 'mph', label: 'Mil per jam (mph)', icon: 'fa-gauge' },
    { id: 'm_menit', label: 'Meter per menit (m/menit)', icon: 'fa-stopwatch-20' },
    { id: 'knot', label: 'Knot (kt)', icon: 'fa-ship' },
    { id: 'mach', label: 'Mach (M)', icon: 'fa-plane-arrival' }
];

export default function KalkulatorKecepatan() {
    // State Utama Form
    const [inputValue, setInputValue] = useState(1);
    const [dariSatuan, setDariSatuan] = useState('m_s'); // Default m/s ke km/jam agar konversinya familier
    const [keSatuan, setKeSatuan] = useState('km_jam');
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
    const opsiDariTerpilih = DAFTAR_SATUAN_KECEPATAN.find(s => s.id === dariSatuan) || DAFTAR_SATUAN_KECEPATAN[0];
    const opsiKeTerpilih = DAFTAR_SATUAN_KECEPATAN.find(s => s.id === keSatuan) || DAFTAR_SATUAN_KECEPATAN[1];

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

    // Logika Hitung Konversi Kecepatan (Real-time & Presisi Tinggi)
    const hitungKonversi = () => {
        const nilaiAngka = parseFloat(inputValue);
        if (isNaN(nilaiAngka)) {
            setHasilKonversi('Masukkan nilai angka yang valid, Senpai.');
            return;
        }

        // Rumus Adil: (Nilai Asal * Faktor Asal dalam m/s) / Faktor Tujuan dalam m/s
        const nilaiDalamMeterPerDetik = nilaiAngka * FAKTOR_KONVERSI_KECEPATAN[dariSatuan];
        const hasilAkhir = nilaiDalamMeterPerDetik / FAKTOR_KONVERSI_KECEPATAN[keSatuan];

        // Memformat tampilan desimal agar serasi dengan antarmuka CSS
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
                            <i className="fa-solid fa-gauge" style={{ marginRight: '10px' }}></i> 
                            Konversi Satuan Kecepatan
                        </h2>
                        <button 
                            className="btn-info-popup" 
                            title="Buka Panduan Satuan Kecepatan" 
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
                                {DAFTAR_SATUAN_KECEPATAN.map((item) => (
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
                                {DAFTAR_SATUAN_KECEPATAN.map((item) => (
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
                SISTEM POPUP MODAL (PANDUAN RISET KECEPATAN MULTI-DOMAINS)
                ========================================================= */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>

                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '20px' }}>
                        <i className="fa-solid fa-circle-info"></i> Informasi Tolok Ukur Kecepatan
                    </h3>
                    
                    <ul className="tool-list">
                    
                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-car"></i> Mikrometer (&mu;m)</span>
                            <div className="tool-text">
                            Meter per detik adalah satuan turunan SI untuk kelajuan (skalar) dan kecepatan (vektor), yang didefinisikan sebagai jarak dalam meter dibagi dengan waktu dalam detik.  Simbol resminya adalah m·s⁻¹ atau m/s, meskipun singkatan mps kadang digunakan untuk kepraktisan. <br /><br />Secara fisik, 1 m/s secara kasar setara dengan kecepatan rata-rata orang berjalan.  Satuan ini merupakan kombinasi dari besaran pokok panjang (meter) dan waktu (sekon), sehingga termasuk dalam kategori besaran turunan dalam sistem MKS (Meter-Kilogram-Secon) dan SI. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi umum untuk meter per detik meliputi:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1 m/s = 3,6 km/jam</li>
                                    <li className="sub-item">
                                        1 m/s ≈ 2,237 mph (mil per jam)</li>
                                    <li className="sub-item">
                                        1 m/s ≈ 1,944 knot
                                    </li>

                                    <li className="sub-item">
                                        Dalam konteks fisika lanjutan, satuan ini menjadi dasar untuk menghitung kecepatan rata-rata ($v = \Delta s / \Delta t$) dan kecepatan sesaat (turunan posisi terhadap waktu, $ds/dt$).
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-ruler-combined"></i> Kilometer per Jam (km/jam)</span>
                            <div className="tool-text">
                                Kilometer per jam (disingkat km/jam atau km/h) adalah satuan besaran turunan yang mengukur kecepatan atau laju pergerakan suatu objek, didefinisikan sebagai jarak satu kilometer yang ditempuh dalam waktu satu jam.  Simbol resmi satuan ini adalah km/jam atau km·jam⁻¹. <br /><br />Meskipun meter per detik (m/s) adalah satuan baku dalam Sistem Satuan Internasional (SI), kilometer per jam adalah satuan yang paling umum digunakan dalam kehidupan sehari-hari, khususnya untuk penanda batas kecepatan di jalan raya dan tampilan speedometer kendaraan bermotor.  Penggunaannya secara luas telah diterima oleh Biro Internasional untuk Ukuran dan Timbangan (BIPM) meskipun bukan bagian dari sistem SI.

                                <div className="sub-info-box">
                                    <span className="sub-info-title">Berikut adalah detail teknis dan konversi satuan kecepatan:</span>
                                    <ul className="sub-list">
                                        <li className="sub-item">
                                            Rumus Dasar: Kecepatan (<Latex>v</Latex>) dihitung dengan membagi jarak (<Latex>s</Latex>) dalam kilometer dengan waktu (<Latex>t</Latex>) dalam jam, atau <Latex>{"v = \\frac{s}{t}"}</Latex>.
                                        </li>
                                        <li className="sub-item">
                                            Konversi ke m/s: Untuk mengubah km/jam ke meter per detik, bagi nilai dengan 3,6 (karena 1 km = 1000 m dan 1 jam = 3600 detik).
                                        </li>
                                        <div className="sub-list-under">
                                            <li className="sub-item">
                                                Contoh: 1 km/jam= <Latex>{"\\frac{3600\\,\\mathrm{s}}{1000\\,\\mathrm{m}}\\approx0.2778\\,\\mathrm{m/s}"}</Latex>.
                                            </li>
                                        </div>
                                        <li className="sub-item">
                                                Konversi ke mph: 1 km/jam setara dengan sekitar 0,6214 mil per jam (mph). 
                                            </li>
                                            <li className="sub-item">
                                                Contoh Penggunaan: Batas kecepatan umum di jalan tol atau kota sering dinyatakan dalam km/jam (misalnya 80 km/jam atau 100 km/jam).
                                            </li>
                                            <li className="sub-item">
                                                Satuan ini juga memiliki variasi lain seperti knot (mil laut per jam, umum di pelayaran dan penerbangan) dan Mach (rasio kecepatan terhadap kecepatan suara), namun km/jam tetap menjadi standar utama untuk transportasi darat di sebagian besar negara.
                                            </li>
                                    </ul>
                                </div>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-gauge"></i> Mil per jam (mph)</span>
                            <div className="tool-text">
                                Mil per jam (singkatan: mil/jam atau mph) adalah satuan imperial untuk kecepatan yang menyatakan jumlah mil yang ditempuh dalam satu jam.  Satuan ini secara umum digunakan di Amerika Serikat dan Britania Raya untuk penulisan kecepatan dan pembatasan kecepatan jalan raya, serta kadang digunakan dalam olahraga seperti kriket, tenis, dan baseball. 
                            </div>
                            
                        <div className="sub-info-box">
                                <span className="sub-info-title">Secara teknis, 1 mil per jam setara dengan:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">
                                        1,60934 kilometer per jam (km/jam)
                                    </li>
                                    <li className="sub-item">
                                    0,44704 meter per detik (m/s)
                                    </li>
                                    <li className="sub-item">
                                        1,4667 kaki per detik (ft/s) 
                                    </li>
                                    <li className="sub-item">
                                        Untuk mengonversi nilai dari mph ke km/jam, kalikan nilai mph dengan 1,60934.  Sebagai contoh, kecepatan 60 mph setara dengan sekitar 96,56 km/jam.  Meskipun sistem metrik lebih umum secara global, mph tetap menjadi standar utama untuk transportasi darat di negara-negara yang menggunakan sistem imperial. 
                                    </li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-stopwatch-20"></i> Meter per menit (m/min)</span>
                            <div className="tool-text">
                                Meter per menit adalah satuan kecepatan yang menunjukkan jumlah meter yang ditempuh dalam waktu satu menit.  Dalam Sistem Satuan Internasional (SI), satuan baku kecepatan adalah meter per detik (m/s), sehingga meter per menit sering digunakan untuk kecepatan yang lebih lambat atau dalam konteks khusus seperti konversi satuan. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi antara meter per menit dan meter per detik menggunakan faktor pengali berikut:</span>
                                <ul className="sub-list">
                                    <li className="sub-item">1 m/min = 0,0167 m/s (atau tepat <Latex>{"\\frac{1}{60} m/s"}</Latex>).</li>
                                    <li className="sub-item">1 m/s = 60 m/min.</li>
                                    <li className="sub-item">Untuk mengonversi nilai dari meter per menit ke meter per detik, bagi nilai tersebut dengan 60.  Sebaliknya, untuk mengonversi dari meter per detik ke meter per menit, kalikan nilai tersebut dengan 60.  Sebagai contoh, kecepatan 10 meter per menit setara dengan 0,167 meter per detik ($10 \div 60$). Satuan ini juga dapat dikonversi ke kilometer per jam (km/jam) dengan mengalikan nilai meter per menit dengan 0,06 (karena <Latex>{"1 \\text{ m/min}"}</Latex> = <Latex>{"0,06 \\text{ km/jam}"}</Latex>).</li>
                                </ul>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="bi bi-ship"></i> Knot (kt)</span>
                            <div className="tool-text">
                                Knot adalah satuan kecepatan yang setara dengan satu mil laut per jam (1,852 km/jam atau sekitar 0,514 m/s).  Satuan ini merupakan standar internasional dalam navigasi maritim, penerbangan, dan meteorologi, dengan singkatan resmi kn atau kt. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Asal Usul dan Definisi:</span>
                                <p>
                                    Istilah "knot" (simpul) berasal dari metode pengukuran kecepatan kapal di abad ke-17 menggunakan alat bernama common log atau chip log. Metode ini melibatkan:
                                </p>
                                <ul className="sub-list">
                                    <li className="sub-item">Melemparkan sepotong kayu (log) ke laut yang diikat dengan tali berbobot..</li>
                                    <li className="sub-item">Tali tersebut memiliki simpul-simpul (knots) dengan jarak interval tertentu (sekitar 14,4 meter).</li>
                                    <li className="sub-item">Pelaut menghitung jumlah simpul yang terlepas selama waktu tertentu (awalnya 30 detik, kemudian 28 detik) untuk menentukan kecepatan kapal. .</li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Hubungan dengan Navigasi</span>
                                <p>
                                    Penggunaan knot tetap bertahan karena keterkaitannya langsung dengan mil laut dan kelengkungan bumi:
                                </p>
                                <ul className="sub-list">
                                    <li className="sub-item">1 mil laut didefinisikan sebagai satu menit busur dari garis lintang bumi. </li>
                                    <li className="sub-item">Menggunakan knot memungkinkan navigator menghitung jarak dan waktu dengan lebih praktis, karena 1 knot = 1 mil laut/jam.</li>
                                    <li className="sub-item">Satu mil laut internasional secara resmi ditetapkan sebesar 1.852 meter pada tahun 1929. .</li>
                                </ul>
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Konversi Satuan</span>
                                <p>
                                    Berikut adalah konversi umum dari 1 knot ke satuan kecepatan lain:
                                </p>
                                <ul className="sub-list">
                                    <li className="sub-item">Kilometer per jam: 1,852 km/h </li>
                                    <li className="sub-item">Mil per jam: 1,151 mph</li>
                                    <li className="sub-item">Meter per detik: 0,514 m/s.</li>
                                </ul>
                                <p>
                                    Sebagai contoh, kecepatan 40 knot setara dengan 74,08 km/jam (40 × 1,852).
                                </p>
                            </div>
                        </li>

                        <li className="tool-item">
                            <span className="tool-label"><i className="fa-solid fa-plane-arrival"></i> Mach (Ma)</span>
                            <div className="tool-text">
                                Mach adalah satuan kecepatan relatif yang digunakan untuk mengukur kecepatan suatu objek (seperti pesawat atau peluru) dibandingkan dengan kecepatan suara di medium sekitarnya, biasanya udara.  Bilangan Mach dinamai dari fisikawan Austria Ernst Mach (1838–1916) dan bukan merupakan singkatan. 
                            </div>

                            <div className="sub-info-box">
                                <span className="sub-info-title">Secara detail, berikut adalah penjelasan mengenai Mach:</span>
                                <p>
                                    Istilah "knot" (simpul) berasal dari metode pengukuran kecepatan kapal di abad ke-17 menggunakan alat bernama common log atau chip log. Metode ini melibatkan:
                                </p>
                                <ul className="sub-list">
                                    <div className="sub-list-under">
                                    <li className="sub-item">
                                        Definisi Rasio: Bilangan Mach ($M$) dihitung sebagai rasio kecepatan objek terhadap kecepatan suara ($M = v / a$). Karena kecepatan suara bervariasi tergantung suhu dan tekanan atmosfer, nilai kecepatan absolut (km/jam atau m/s) untuk satu Mach juga berubah sesuai ketinggian. 
                                    </li>
                                    <li>
                                        Nilai Acuan: Pada kondisi standar permukaan laut (suhu 20°C), Mach 1 setara dengan sekitar 1.235 km/jam (atau 343 m/s).  Namun, di ketinggian terbang pesawat komersial (sekitar 11.000 meter dengan suhu -50°C), kecepatan suara turun menjadi sekitar 295 m/s, sehingga Mach 1 di ketinggian tersebut jauh lebih lambat secara absolut dibandingkan di permukaan laut.
                                    </li>
                                    <li>
                                        Klasifikasi Kecepatan: Bilangan Mach digunakan untuk membagi rezim penerbangan menjadi beberapa kategori:
                                    </li>
                                    <div className="sub-list-under">
                                        <li className="sub-item">
                                            Subsonik: <Latex>{"M < 0.8"}</Latex> (kecepatan di bawah kecepatan suara, umum pada pesawat penumpang).
                                        </li>
                                        <li>
                                            Transonik: <Latex>{"0.8 \\le M \\le 1.3"}</Latex> (perbatasan antara subsonik dan supersonik, di mana aliran udara di sekitar sayap mulai mencapai kecepatan suara).
                                        </li>
                                        <li>
                                            Supersonik: <Latex>{"1.3 < M < 5.0"}</Latex> (kecepatan di atas dua kali kecepatan suara, umum pada pesawat tempur).
                                        </li>
                                        <li>
                                            Hipersonik: <Latex>{"M \\ge 5.0"}</Latex> (kecepatan lima kali atau lebih dari kecepatan suara, digunakan dalam penelitian roket dan kendaraan ulang-alik).
                                        </li>
                                    </div>
                                        <li>
                                            Pentingnya Efek Kompresibilitas: Bilangan Mach menjadi parameter krusial karena menentukan efek kompresibilitas udara. Saat mendekati Mach 1, gangguan aliran udara tidak lagi menyebar merata, menciptakan gelombang kejut yang secara drastis mengubah gaya angkat dan hambatan pesawat. 
                                        </li>
                                        <p>
                                            Istilah "Mach" bukanlah singkatan atau akronim, melainkan penghormatan langsung kepada Ernst Mach.  Istilah ini sendiri baru dipopulerkan oleh insinyur Swiss Jacob Ackeret pada tahun 1929, beberapa tahun setelah Mach meninggal dunia. 
                                        </p>
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