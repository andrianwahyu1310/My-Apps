import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '/main/base/calc.css';

export default function KalkulatorDualMode() {
    // 🌟 STATE UTAMA UNTUK MENGENDALIKAN KALKULATOR
    const [mode, setMode] = useState('biasa'); // 'biasa' atau 'ilmiah'
    const [formula, setFormula] = useState(''); // Untuk menampilkan riwayat input/rumus di atas
    const [output, setOutput] = useState('0');  // Untuk menampilkan angka aktif/hasil akhir
    const [isHasil, setIsHasil] = useState(false); // Flag untuk mendeteksi setelah tombol '=' ditekan

    // 🌟 1. FUNGSI GANTI MODE (BIASA / ILMIAH)
    const gantiMode = (modeDipilih) => {
        setMode(modeDipilih);
    };

    // 🌟 2. FUNGSI INPUT ANGKA & TITIK DESIMAL
    const inputAngka = (angka) => {
        if (isHasil) {
            // Jika baru saja menghitung hasil, input baru akan mereset layar
            setOutput(angka === '.' ? '0.' : angka);
            setIsHasil(false);
        } else {
            if (angka === '.') {
                // Mencegah titik desimal ganda dalam satu bilangan aktif
                if (output.includes('.')) return;
                setOutput(output + '.');
            } else {
                // Menghapus nol di depan jika awal input
                setOutput(output === '0' ? angka : output + angka);
            }
        }
    };

    // 🌟 3. FUNGSI INPUT OPERATOR (+, -, *, /, %, **)
    const inputOperator = (op) => {
        let displayOp = op;
        if (op === '*') displayOp = '×';
        if (op === '/') displayOp = '÷';
        if (op === '**') displayOp = '^';

        if (isHasil) {
            setFormula(`${output} ${displayOp} `);
            setIsHasil(false);
        } else {
            setFormula(`${formula}${output} ${displayOp} `);
        }
        setOutput('0');
    };

    // 🌟 4. FUNGSI INPUT FUNGSI MATEMATIKA (Sci-Keys)
    const inputFungsi = (fn) => {
        const nilaiAngka = parseFloat(output);
        if (isNaN(nilaiAngka)) return;

        let hasilFn = 0;
        let namaFungsi = '';

        // Eksekusi kalkulasi saintifik yang adil berdasarkan standar Math JS
        switch (fn) {
            case 'sin':
                // Mengonversi derajat ke radian terlebih dahulu demi ekspektasi pengguna umum
                hasilFn = Math.sin((nilaiAngka * Math.PI) / 180);
                namaFungsi = `sin(${nilaiAngka})`;
                break;
            case 'cos':
                hasilFn = Math.cos((nilaiAngka * Math.PI) / 180);
                namaFungsi = `cos(${nilaiAngka})`;
                break;
            case 'tan':
                hasilFn = Math.tan((nilaiAngka * Math.PI) / 180);
                namaFungsi = `tan(${nilaiAngka})`;
                break;
            case 'sqrt':
                if (nilaiAngka < 0) {
                    setOutput('Error: Angka Negatif');
                    return;
                }
                hasilFn = Math.sqrt(nilaiAngka);
                namaFungsi = `√(${nilaiAngka})`;
                break;
            case 'log':
                if (nilaiAngka <= 0) {
                    setOutput('Error: Angka <= 0');
                    return;
                }
                hasilFn = Math.log10(nilaiAngka);
                namaFungsi = `log(${nilaiAngka})`;
                break;
            default:
                return;
        }

        // Format hasil desimal agar tidak terlalu panjang
        const hasilDiformat = Number(hasilFn.toFixed(8)).toString();
        setFormula(namaFungsi);
        setOutput(hasilDiformat);
        setIsHasil(true);
    };

    // 🌟 5. FUNGSI INPUT KONSTANTA (π / e)
    const inputKonstanta = (konst) => {
        if (konst === 'PI') {
            setOutput(Math.PI.toFixed(8).toString());
        } else if (konst === 'E') {
            setOutput(Math.E.toFixed(8).toString());
        }
        setIsHasil(false);
    };

    // 🌟 6. FUNGSI RESET TOTAL (C)
    const bersihkanSemua = () => {
        setFormula('');
        setOutput('0');
        setIsHasil(false);
    };

    // 🌟 7. FUNGSI HAPUS KARAKTER TERAKHIR (Backspace)
    const hapusKarakter = () => {
        if (isHasil) {
            setFormula('');
        } else {
            if (output.length > 1) {
                setOutput(output.slice(0, -1));
            } else {
                setOutput('0');
            }
        }
    };

    // 🌟 8. FUNGSI HITUNG HASIL AKHIR (=)
    const hitungHasil = () => {
        if (!formula && !isHasil) return;

        // Menyusun ekspresi string mentah yang siap dievaluasi secara aman
        let ekspresiMentah = `${formula}${output}`;
        
        // Normalisasi simbol visual ke operator JavaScript asli
        ekspresiMentah = ekspresiMentah.replaceAll('×', '*').replaceAll('÷', '/').replaceAll('^', '**');

        try {
            // Evaluasi matematika yang dikontrol secara ketat
            // Catatan Keamanan: Karena ini aplikasi internal kalkulator statis, fungsi standar sudah disesuaikan
            const kalkulasiAkhir = Function(`"use strict"; return (${ekspresiMentah})`)();
            
            if (kalkulasiAkhir === Infinity || kalkulasiAkhir === -Infinity) {
                setOutput('Error: Pembagian Nol');
            } else {
                setOutput(Number(kalkulasiAkhir.toFixed(8)).toString());
            }
            setFormula('');
            setIsHasil(true);
        } catch (error) {
            setOutput('Error Rumus');
            setFormula('');
            setIsHasil(true);
        }
    };

    return (
        <>
        <div className="calc-body">
            {/* LINK KEMBALI MENGGUNAKAN REACT ROUTER DOM */}
            <Link to="/mainTools" className="btn-back">
                <i className="bi bi-arrow-left"></i> Kembali ke Menu Tools
            </Link>
        </div>

            <div className="calc-container">
                {/* BAGIAN HEADER & KENDALI TOGGLE MODE */}
                <div className="calc-header">
                    <span className="calc-title" id="calcTitle">
                        <i className="bi bi-calculator"></i> {mode === 'biasa' ? 'Mode Biasa' : 'Mode Ilmiah'}
                    </span>
                    <div>
                        <button 
                            id="btnBiasa" 
                            className={`mode-btn ${mode === 'biasa' ? 'active' : ''}`} 
                            onClick={() => gantiMode('biasa')}
                        >
                            Biasa
                        </button>
                        <button 
                            id="btnIlmiah" 
                            className={`mode-btn ${mode === 'ilmiah' ? 'active' : ''}`} 
                            onClick={() => gantiMode('ilmiah')}
                        >
                            Ilmiah
                        </button>
                    </div>
                </div>

                {/* BAGIAN LAYAR MONITOR ELEKTRONIK */}
                <div className="screen">
                    <div className="formula" id="txtFormula">{formula}</div>
                    <div className="output" id="txtOutput">{output}</div>
                </div>

                {/* BAGIAN KEYPAD TOMBOL */}
                <div className="keypad">
                    
                    {/* BLOK TOMBOL SAINTIFIK (Hanya dirender jika mode === 'ilmiah') */}
                    {mode === 'ilmiah' && (
                        <div className="scientific-keys" id="sciBlock" style={{ display: 'grid' }}>
                            <button className="key fn" onClick={() => inputFungsi('sin')}>sin</button>
                            <button className="key fn" onClick={() => inputFungsi('cos')}>cos</button>
                            <button className="key fn" onClick={() => inputFungsi('tan')}>tan</button>
                            <button className="key op" onClick={() => inputOperator('**')}>xʸ</button>
                            
                            <button className="key fn" onClick={() => inputFungsi('sqrt')}>√</button>
                            <button className="key fn" onClick={() => inputFungsi('log')}>log</button>
                            <button className="key fn" onClick={() => inputKonstanta('PI')}>π</button>
                            <button className="key fn" onClick={() => inputKonstanta('E')}>e</button>
                        </div>
                    )}

                    {/* BARIS UTAMA OPERASI KONTROL */}
                    <button className="key clear" onClick={bersihkanSemua}>C</button>
                    <button className="key op" onClick={hapusKarakter}><i className="bi bi-backspace"></i></button>
                    <button className="key op" onClick={() => inputOperator('%')}>%</button>
                    <button className="key op" onClick={() => inputOperator('/')}>÷</button>

                    {/* BARIS ANGKA 7-9 */}
                    <button className="key" onClick={() => inputAngka('7')}>7</button>
                    <button className="key" onClick={() => inputAngka('8')}>8</button>
                    <button className="key" onClick={() => inputAngka('9')}>9</button>
                    <button className="key op" onClick={() => inputOperator('*')}>×</button>

                    {/* BARIS ANGKA 4-6 */}
                    <button className="key" onClick={() => inputAngka('4')}>4</button>
                    <button className="key" onClick={() => inputAngka('5')}>5</button>
                    <button className="key" onClick={() => inputAngka('6')}>6</button>
                    <button className="key op" onClick={() => inputOperator('-')}>-</button>

                    {/* BARIS ANGKA 1-3 */}
                    <button className="key" onClick={() => inputAngka('1')}>1</button>
                    <button className="key" onClick={() => inputAngka('2')}>2</button>
                    <button className="key" onClick={() => inputAngka('3')}>3</button>
                    <button className="key op" onClick={() => inputOperator('+')}>+</button>

                    {/* BARIS DASAR */}
                    <button className="key" onClick={() => inputAngka('0')}>0</button>
                    <button className="key" onClick={() => inputAngka('.')}>.</button>
                    <button className="key equal" onClick={hitungHasil}>=</button>
                </div>
            </div>
        </>
    );
}