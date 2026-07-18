import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 DAFTAR MATA UANG DENGAN IKON BENDERA/SIMBOL YANG RELEVAN
const DAFTAR_MATA_UANG = [
    { id: 'IDR', label: 'IDR (Rupiah Indonesia)', icon: 'fa-money-bill-wave', simbol: 'Rp' },
    { id: 'USD', label: 'USD (Dolar Amerika)', icon: 'fa-dollar-sign', simbol: '$' },
    { id: 'JPY', label: 'JPY (Yen Jepang)', icon: 'fa-yen-sign', simbol: '¥' },
    { id: 'EUR', label: 'EUR (Euro)', icon: 'fa-euro-sign', simbol: '€' },
    { id: 'SGD', label: 'SGD (Dolar Singapura)', icon: 'fa-coins', simbol: 'S$' }
];

export default function KalkulatorMataUang() {
    // State Utama Form
    const [inputValue, setInputValue] = useState('1');
    const [dariUang, setDariUang] = useState('USD');
    const [keUang, setKeUang] = useState('IDR');
    const [hasilKonversi, setHasilKonversi] = useState('Rp 0,00');
    
    // State Data API & Status Loading
    const [rates, setRates] = useState({});
    const [statusInfo, setStatusInfo] = useState('Menghubungkan ke server finansial...');
    const [isLoading, setIsLoading] = useState(true);

    // State Kendali Dropdown Melayang (Custom UI)
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);

    // Ref untuk penutupan otomatis saat klik di luar elemen dropdown
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);

    const opsiDariTerpilih = DAFTAR_MATA_UANG.find(m => m.id === dariUang) || DAFTAR_MATA_UANG[1];
    const opsiKeTerpilih = DAFTAR_MATA_UANG.find(m => m.id === keUang) || DAFTAR_MATA_UANG[0];

    // 🛡️ PROTEKSI GLOBAL: Deteksi klik luar untuk menutup dropdown otomatis
    useEffect(() => {
        const tanganiKlikLuar = (event) => {
            if (bukaDariDropdown && refDropdownDari.current && !refDropdownDari.current.contains(event.target)) {
                setBukaDariDropdown(false);
            }
            if (bukaKeDropdown && refDropdownKe.current && !refDropdownKe.current.contains(event.target)) {
                setBukaKeDropdown(false);
            }
        };
        document.addEventListener('mousedown', tanganiKlikLuar);
        return () => document.removeEventListener('mousedown', tanganiKlikLuar);
    }, [bukaDariDropdown, bukaKeDropdown]);

    // 🌐 FETCH DATA API KURS MATA UANG REAL-TIME
    useEffect(() => {
        const ambilDataKurs = async () => {
            try {
                // Menggunakan API publik exchange-rate bebas token untuk efisiensi
                const respon = await fetch('https://open.er-api.com/v6/latest/USD');
                if (!respon.ok) throw new Error('Gagal mengambil data dari server finansial.');
                
                const data = await respon.json();
                setRates(data.rates);
                setStatusInfo(`Data kurs berhasil diperbarui (Terakhir diupdate: ${data.time_last_update_utc.substring(0, 16)} UTC)`);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setStatusInfo('⚠️ Gagal memuat data finansial terbaru. Menggunakan kalkulasi lokal cadangan.');
                // Fallback data statis demi menjaga kelangsungan sistem jika API down
                setRates({ IDR: 16250, USD: 1, JPY: 155.5, EUR: 0.92, SGD: 1.34 });
                setIsLoading(false);
            }
        };

        ambilDataKurs();
    }, []);

    // 🌟 ENGINE UTAMA: Perhitungan Konversi Mata Uang secara Proporsional
    const hitungOtomatis = () => {
        const jumlahUang = parseFloat(inputValue);
        
        if (isNaN(jumlahUang) || jumlahUang <= 0) {
            setHasilKonversi('Hasil: Rp 0,00');
            return;
        }

        if (!rates[dariUang] || !rates[keUang]) {
            return;
        }

        // Jalur Logika Konversi: Konversikan jumlah uang dari mata uang asal ke USD, lalu kalikan ke mata uang tujuan
        const jumlahDalamUSD = jumlahUang / rates[dariUang];
        const hasilAkhir = jumlahDalamUSD * rates[keUang];

        // Pemformatan Mata Uang Internasional berdasarkan kultur lokal negara masing-masing
        let kodeLokal = 'id-ID';
        if (keUang === 'USD') kodeLokal = 'en-US';
        if (keUang === 'JPY') kodeLokal = 'ja-JP';
        if (keUang === 'EUR') kodeLokal = 'de-DE';
        if (keUang === 'SGD') kodeLokal = 'en-SG';

        const formatMataUang = new Intl.NumberFormat(kodeLokal, {
            style: 'currency',
            currency: keUang,
            minimumFractionDigits: keUang === 'JPY' ? 0 : 2
        }).format(hasilAkhir);

        setHasilKonversi(`Hasil: ${formatMataUang}`);
    };

    // Trigger kalkulasi otomatis secara berkala setiap kali input nilai atau jenis mata uang diganti
    useEffect(() => {
        if (!isLoading) {
            hitungOtomatis();
        }
    }, [inputValue, dariUang, keUang, rates, isLoading]);

    return (
        <>
            <div className="tools-page-wrapper" style={{ paddingTop: '100px' }}>
                <Link to="/mainTools" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
                </Link>

                {/* SINKRONISASI VISUAL: Struktur .tool-container yang kokoh dan presisi */}
                <div className="tool-container">
                    <div className="tool-header">
                        <h2>
                            <i className="bi bi-currency-exchange" style={{ marginRight: '10px' }}></i> 
                            Kurs Real-Time
                        </h2>
                    </div>

                    {/* INPUT JUMLAH NOMINAL UANG */}
                    <div className="form-group">
                        <label htmlFor="inputUang">Masukkan Jumlah Uang</label>
                        <input 
                            type="number" 
                            id="inputUang" 
                            className="form-control" 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            step="any"
                            min="0"
                            placeholder="Masukkan nominal..."
                        />
                    </div>

                    {/* CUSTOM DROPDOWN: MATA UANG ASAL */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownDari}>
                        <label>Mata Uang Asal</label>
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
                                {DAFTAR_MATA_UANG.map((item) => (
                                    <div 
                                        key={`dari-${item.id}`}
                                        className="option-item"
                                        onClick={() => {
                                            setDariUang(item.id);
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

                    {/* CUSTOM DROPDOWN: MATA UANG TUJUAN */}
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
                                <i className={`fa-solid ${opsiKeTerpilih.icon}`} style={{ marginRight: '8px', color: '#10b981' }}></i>
                                <span className="text-normal">{opsiKeTerpilih.label}</span>
                            </div>
                            <i className={`fa-solid ${bukaKeDropdown ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </div>

                        {bukaKeDropdown && (
                            <div className="dropdown-options" style={{ display: 'block', maxHeight: '220px', overflowY: 'auto' }}>
                                {DAFTAR_MATA_UANG.map((item) => (
                                    <div 
                                        key={`ke-${item.id}`}
                                        className="option-item"
                                        onClick={() => {
                                            setKeUang(item.id);
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

                    {/* STATUS INFORMASI SERVER */}
                    <span 
                        className="kurs-info" 
                        id="labelKurs" 
                        style={{ 
                            display: 'block', 
                            fontSize: '0.8rem', 
                            color: isLoading ? '#f59e0b' : '#64748b',
                            marginBottom: '15px',
                            fontStyle: 'italic'
                        }}
                    >
                        <i className={`bi ${isLoading ? 'bi-arrow-clockwise animate-spin' : 'bi-info-circle'}`} style={{ marginRight: '5px' }}></i>
                        {statusInfo}
                    </span>

                    {/* TOMBOL AKSI MANUAL (Sinkronisasi Event Pemicu) */}
                    <button 
                        className="btn-hitung" 
                        id="btnHitung" 
                        onClick={hitungOtomatis} 
                        disabled={isLoading}
                        style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                        {isLoading ? 'Memuat Data Kurs...' : 'Hitung Konversi Aktual'}
                    </button>

                    {/* BOX UTAMA HASIL PERTUKARAN VALUTA ASING */}
                    <div 
                        className="result-box" 
                        id="hasilUang"
                        style={{ 
                            background: '#f0fdf4', 
                            borderLeft: '4px solid #10b981', 
                            fontSize: '1.4rem', 
                            fontWeight: 'bold', 
                            color: '#166534',
                            marginTop: '15px',
                            minHeight: '55px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {hasilKonversi}
                    </div>
                </div>
            </div>
        </>
    );
}