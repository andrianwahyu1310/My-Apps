import React, { useState, useEffect, useRef } from 'react';
import { Latex } from "../../utils/autoLatex";
import { Link } from 'react-router-dom';
import '/main/base/tools.css';

// 🌟 DAFTAR SATUAN VOLUME LITER BESERTA NILAI BASIS NYATA TERHADAP LITER (L)
const DAFTAR_VOLUME = [
    { id: 'kL', label: 'Kiloliter (kL)', nilaiBasis: 1000, icon: 'fa-box-tissue' },
    { id: 'hL', label: 'Hektoliter (hL)', nilaiBasis: 100, icon: 'fa-wine-bottle' },
    { id: 'daL', label: 'Dekaliter (daL)', nilaiBasis: 10, icon: 'fa-bottle-water' },
    { id: 'L', label: 'Liter (L)', nilaiBasis: 1, icon: 'fa-glass-water' },
    { id: 'dL', label: 'Desiliter (dL)', nilaiBasis: 0.1, icon: 'fa-soap' },
    { id: 'cL', label: 'Sentiliter (cL)', nilaiBasis: 0.01, icon: 'fa-vial' },
    { id: 'mL', label: 'Mililiter (mL)', nilaiBasis: 0.001, icon: 'fa-eye-dropper' }
];

export default function KalkulatorVolume() {
    // State Utama Form
    const [inputValue, setInputValue] = useState('1');
    const [dariSatuan, setDariSatuan] = useState('L');
    const [keSatuan, setKeSatuan] = useState('mL');
    const [hasilKonversi, setHasilKonversi] = useState(1000);
    const [teksRumus, setTeksRumus] = useState('');

    // State Kendali Dropdown Melayang & Popup Modal
    const [bukaDariDropdown, setBukaDariDropdown] = useState(false);
    const [bukaKeDropdown, setBukaKeDropdown] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);

    // Ref untuk penutupan otomatis saat klik di luar elemen (Dropdown & Modal)
    const refDropdownDari = useRef(null);
    const refDropdownKe = useRef(null);
    const refKontenModal = useRef(null);

    const opsiDariTerpilih = DAFTAR_VOLUME.find(v => v.id === dariSatuan) || DAFTAR_VOLUME[3];
    const opsiKeTerpilih = DAFTAR_VOLUME.find(v => v.id === keSatuan) || DAFTAR_VOLUME[6];

    // 🛡️ PROTEKSI GLOBAL: Deteksi klik luar untuk menutup dropdown & modal secara otomatis
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

    // 🌟 ENGINE UTAMA: Perhitungan Konversi Volume Berdasarkan Tingkatan Tangga Matematika
    const hitungKonversiVolume = () => {
        const nilaiInput = parseFloat(inputValue);

        if (isNaN(nilaiInput)) {
            setHasilKonversi('-');
            setTeksRumus('Masukkan nilai angka volume yang valid, Senpai.');
            return;
        }

        if (dariSatuan === keSatuan) {
            setHasilKonversi(nilaiInput);
            setTeksRumus('Satuan sama, tidak diperlukan operasi perkalian atau pembagian.');
            return;
        }

        const nilaiDalamLiter = nilaiInput * opsiDariTerpilih.nilaiBasis;
        const hasilAkhir = nilaiDalamLiter / opsiKeTerpilih.nilaiBasis;

        let rumusStr = '';
        const faktorPengali = opsiDariTerpilih.nilaiBasis / opsiKeTerpilih.nilaiBasis;

        if (faktorPengali > 1) {
            rumusStr = `Langkah: ${nilaiInput} ${dariSatuan} × ${faktorPengali} = ${hasilAkhir.toLocaleString('id-ID')} ${keSatuan}`;
        } else {
            const faktorPembagi = 1 / faktorPengali;
            rumusStr = `Langkah: ${nilaiInput} ${dariSatuan} ÷ ${faktorPembagi.toLocaleString('id-ID')} = ${hasilAkhir.toString()} ${keSatuan}`;
        }

        setHasilKonversi(Number(hasilAkhir.toFixed(6)));
        setTeksRumus(rumusStr);
    };

    useEffect(() => {
        hitungKonversiVolume();
    }, [inputValue, dariSatuan, keSatuan]);

    return (
        <>
            <div className="tools-page-wrapper" style={{ paddingTop: '100px' }}>
                <Link to="/mainTools" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
                </Link>

                {/* VISUAL CONTAINER SINKRON */}
                <div className="tool-container">
                    <div className="tool-header">
                        <h2>
                            <i className="bi bi-funnel" style={{ marginRight: '10px' }}></i> 
                            Konversi Volume Satuan Liter
                        </h2>
                        {/* BUTTON INFO POPUP MODAL (Gaya Ikon Kembar Identik dengan Suhu) */}
                        <button className="btn-info-popup" onClick={() => setIsModalActive(true)}>
                            <i className="bi bi-question-lg"></i>
                        </button>
                    </div>

                    {/* INPUT NILAI VOLUME */}
                    <div className="form-group">
                        <label>Masukkan Nilai Volume</label>
                        <input 
                            type="number" 
                            className="form-control" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            step="any"
                            placeholder="Masukkan nominal volume..."
                        />
                    </div>

                    {/* CUSTOM DROPDOWN: SATUAN ASAL */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownDari}>
                        <label>Dari Satuan</label>
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
                                {DAFTAR_VOLUME.map((item) => (
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

                    {/* CUSTOM DROPDOWN: SATUAN TUJUAN */}
                    <div className="form-group" style={{ position: 'relative' }} ref={refDropdownKe}>
                        <label>Konversi Ke Satuan</label>
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
                                {DAFTAR_VOLUME.map((item) => (
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

                    {/* TAMPILAN BOX HASIL AKHIR */}
                    <div className="form-group" style={{ marginTop: '20px' }}>
                        <label style={{ color: '#10b981', fontWeight: 'bold' }}>Hasil Konversi Aktual</label>
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
                            {typeof hasilKonversi === 'number' ? hasilKonversi.toLocaleString('id-ID', { maximumFractionDigits: 6 }) : hasilKonversi} {opsiKeTerpilih.id}
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

            {/* MODAL PANDUAN TANGGA VOLUME (Sinkron dengan Sistem Penutup Suhu) */}
            <div className={`modal-overlay ${isModalActive ? 'active' : ''}`}>
                <div className="desc-tool" ref={refKontenModal}>
                    <button className="btn-close-modal" onClick={() => setIsModalActive(false)}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                    <h3 style={{ color: 'var(--primary-color)', marginBottom: '15px' }}>
                        <i className="fa-solid fa-circle-info" style={{ marginRight: '8px' }}></i>
                        Panduan Tangga Konversi Volume
                    </h3>
                    <p className="tool-text" style={{ marginBottom: '10px' }}>
                        Setiap turun satu anak tangga dikalikan 10, dan setiap naik satu anak tangga dibagi 10:
                    </p>
                    <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        <li><strong>kL ke hL:</strong> <Latex>{String.raw`1\text{ kL} = 10\text{ hL}`}</Latex></li>
                        <li><strong>hL ke daL:</strong> <Latex>{String.raw`1\text{ hL} = 10\text{ daL}`}</Latex></li>
                        <li><strong>daL ke L:</strong> <Latex>{String.raw`1\text{ daL} = 10\text{ L}`}</Latex></li>
                        <li><strong>L ke dL:</strong> <Latex>{String.raw`1\text{ L} = 10\text{ dL}`}</Latex></li>
                        <li><strong>dL ke cL:</strong> <Latex>{String.raw`1\text{ dL} = 10\text{ cL}`}</Latex></li>
                        <li><strong>cL ke mL:</strong> <Latex>{String.raw`1\text{ cL} = 10\text{ mL}`}</Latex></li>
                    </ul>
                </div>
            </div>
        </>
    );
}