import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import { showToast } from '../../utils/toasted';
import '../../../main/base/kuis.css';
import { apiFetch } from "../../../src/config/api";

export default function QuizFamily({ user, onLogout }) {
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // State Alur Permainan
    const [fase, setFase] = useState(1); 
    const [mapelTerpilih, setMapelTerpilih] = useState("");
    const [jumlahSoalPilihan, setJumlahSoalPilihan] = useState(5);
    const [modeGame, setModeGame] = useState("santai");

    // State Tempat Soal & Gameplay
    const [kumpulanSoal, setKumpulanSoal] = useState([]);
    const [indeksSoal, setIndeksSoal] = useState(0);
    const [jumlahBenar, setJumlahBenar] = useState(0);
    const [nyawa, setNyawa] = useState(3);
    const [waktuSisa, setWaktuSisa] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // State Baru: Penyimpanan Pilihan Sementara (Sebelum Dikonfirmasi)
    const [jawabanDipilih, setJawabanDipilih] = useState(null);

    // Ref untuk Timer & Canvas Animasi
    const timerRef = useRef(null);
    const canvasRef = useRef(null);

    const daftarMapel = [
        { id: 'matematika', nama: "📐 Matematika", desc: "Uji logika angka dan hitungan mutlak." },
        { id: 'ipa', nama: "🔬 Ilmu Pengetahuan Alam", desc: "Penelitian rahasia alam dan hukum semesta." },
        { id: 'ips', nama: "🌍 Ilmu Pengetahuan Sosial", desc: "Sejarah peradaban dan geografi dunia." },
        { id: 'umum', nama: "💡 Pengetahuan Umum", desc: "Wawasan global materi lintas sektoral." }
    ];

    const daftarJumlahSoal = [5, 10, 20, 30, 40, 50];

    const daftarMode = [
        { id: 'santai', nama: "☕ Mode Santai", desc: "Tanpa waktu, tanpa batas kesalahan. Cocok untuk belajar." },
        { id: 'kompetitif', nama: "⏱️ Mode Kompetitif", desc: "Dibatasi waktu total. Uji kecepatan berpikir Anda!" },
        { id: 'eliminasi', nama: "❌ Mode Eliminasi", desc: "Waktu terbatas & Hanya 3 nyawa. Salah 3 kali = GUGUR!" }
    ];

    const daftarKesulitan = [
        { id: 'mudah', nama: "🟢 Mudah", warna: "#2ecc71" },
        { id: 'sedang', nama: "🟡 Sedang", warna: "#f1c40f" },
        { id: 'susah', nama: "🟠 Susah", warna: "#e67e22" },
        { id: 'extreme', nama: "🔴 EXTREME", warna: "#e74c3c" }
    ];

    // Efek Pengendali Waktu Mundur (Timer Guard)
    useEffect(() => {
        if (fase === 4 && (modeGame === 'kompetitif' || modeGame === 'eliminasi')) {
            timerRef.current = setInterval(() => {
                setWaktuSisa(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setFase(5);
                        showToast(setToast, "Waktu Anda telah habis!", "error");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(timerRef.current);
    }, [fase, modeGame]);

    // Efek Animasi Canvas di Fase 5 (Hasil Akhir)
    useEffect(() => {
        if (fase !== 5 || !canvasRef.current || kumpulanSoal.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const skorPersen = (jumlahBenar / kumpulanSoal.length) * 100;
        const isLulus = skorPersen >= 70;

        // Inisialisasi Partikel
        const particles = [];
        const count = isLulus ? 120 : 60;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: isLulus ? Math.random() * canvas.height - canvas.height : Math.random() * canvas.height,
                size: Math.random() * 8 + 4,
                speedY: isLulus ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
                speedX: Math.random() * 2 - 1,
                color: isLulus 
                    ? ['#00f5d4', '#ffc107', '#2ecc71', '#e74c3c', '#9b59b6'][Math.floor(Math.random() * 5)]
                    : ['#e74c3c', '#c0392b', '#7f8c8d'][Math.floor(Math.random() * 3)],
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 4 - 2
            });
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;

                if (isLulus) {
                    // Confetti (Kotak / Persegi Panjang)
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                } else {
                    // Rain / Peringatan (Garis Vertikal Merah)
                    ctx.fillRect(-1, -p.size, 2, p.size * 2);
                }

                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotSpeed;

                // Loop Posisi
                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [fase, jumlahBenar, kumpulanSoal.length]);

    // Handler Fase 1: Pilih Mapel
    const handlePilihMapel = (id) => {
        setMapelTerpilih(id);
        setFase(2);
    };

    // Handler Fase 2: Konfirmasi Pengaturan
    const handleKonfirmasiPengaturan = () => {
        setFase(3);
    };

    // Handler Fase 3: Tembak API & Ambil Soal
    const handlePilihKesulitan = async (id) => {
        setIsProcessing(true);

        try {
            const { data: hasil } = await apiFetch(
                `/api/quiz-questions?mapel=${mapelTerpilih}&kesulitan=${id}&limit=${jumlahSoalPilihan}`,
                { 
                    method: 'GET', 
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                }
            );

            if (hasil.success) {
                const soalDariServer = hasil.data;

                if (modeGame === 'kompetitif' || modeGame === 'eliminasi') {
                    setWaktuSisa(soalDariServer.length * 30);
                }

                setKumpulanSoal(soalDariServer);
                setIndeksSoal(0);
                setJumlahBenar(0);
                setNyawa(3);
                setJawabanDipilih(null);
                setFase(4);
            } else {
                showToast(setToast, hasil.message || "Gagal mengambil soal dari server!", "error");
            }

        } catch (error) {
            console.error("Galat saat menghubungi API server:", error);
            showToast(setToast, "Koneksi ke server terputus! Gagal memuat data.", "error");
        } finally {
            setIsProcessing(false);
        }
    };

    // Handler Pilih Opsi Sementara
    const handlePilihOpsi = (opsi) => {
        if (isProcessing) return;
        setJawabanDipilih(opsi);
    };

    // Handler Eksekusi Konfirmasi Jawaban
    const handleKonfirmasiJawaban = () => {
        if (!jawabanDipilih || isProcessing) return;
        setIsProcessing(true);

        const soalSaatIni = kumpulanSoal[indeksSoal];
        let nyawaSisaSaatIni = nyawa;
        
        if (jawabanDipilih === soalSaatIni.jawaban) {
            setJumlahBenar(prev => prev + 1);
            showToast(setToast, "Jawaban Benar!", "success");
        } else {
            showToast(setToast, `Kurang Tepat! Jawaban benar: ${soalSaatIni.jawaban}`, "error");
            if (modeGame === 'eliminasi') {
                nyawaSisaSaatIni = nyawa - 1;
                setNyawa(prev => prev - 1);
            }
        }

        // Cek eliminasi
        if (modeGame === 'eliminasi' && nyawaSisaSaatIni <= 0) {
            setTimeout(() => {
                clearInterval(timerRef.current);
                setFase(5);
                showToast(setToast, "Eliminasi! Kesempatan Anda habis.", "error");
                setIsProcessing(false);
            }, 800);
            return;
        }

        // Pindah Soal
        setTimeout(() => {
            if (indeksSoal + 1 < kumpulanSoal.length) {
                setIndeksSoal(prev => prev + 1);
                setJawabanDipilih(null);
                setIsProcessing(false);
            } else {
                clearInterval(timerRef.current);
                setFase(5);
                setIsProcessing(false);
            }
        }, 800);
    };

    // Format Waktu (Menit:Detik)
    const formatWaktu = (totalDetik) => {
        const menit = Math.floor(totalDetik / 60);
        const detik = totalDetik % 60;
        return `${menit}:${detik < 10 ? '0' : ''}${detik}`;
    };

    const handleResetGame = () => {
        clearInterval(timerRef.current);
        setFase(1);
        setMapelTerpilih("");
        setKumpulanSoal([]);
        setIndeksSoal(0);
        setJumlahBenar(0);
        setWaktuSisa(0);
        setNyawa(3);
        setJawabanDipilih(null);
    };

    const skorAkhir = kumpulanSoal.length > 0 ? (jumlahBenar / kumpulanSoal.length) * 100 : 0;

    return (
        <>
            <Navbar user={user} onLogout={onLogout} />

            {/* Canvas overlay animasi saat fase 5 */}
            {fase === 5 && (
                <canvas 
                    ref={canvasRef} 
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999 }} 
                />
            )}

            <div className="quiz-page-wrapper" style={{ minHeight: '100vh', padding: '100px 20px 40px', boxSizing: 'border-box', color: 'var(--text-color)' }}>
                <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                    
                    {fase < 4 && (
                        <Link to="/container-brain-teaser" className="btn-back" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '20px' }}>
                            <i className="bi bi-arrow-left"></i> Kembali
                        </Link>
                    )}

                    {/* FASE 1: PILIH MAPEL */}
                    {fase === 1 && (
                        <section className="card-phase">
                            <h1 className='headers-mapel' style={{ marginBottom: '10px' }}>🎯 Pilih Mata Pelajaran</h1>
                            <p style={{ opacity: 0.7, marginBottom: '30px' }}>Silakan tentukan bidang kompetensi yang ingin Anda taklukkan hari ini.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                {daftarMapel.map(mapel => (
                                    <div key={mapel.id} onClick={() => handlePilihMapel(mapel.id)} style={{ padding: '25px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} onMouseOver={e => e.currentTarget.style.borderColor = '#00f5d4'} onMouseOut={e => e.currentTarget.style.borderColor = 'var(--card-border)'}>
                                        <h3 style={{ margin: '0 0 10px 0' }}>{mapel.nama}</h3>
                                        <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.7, lineHeight: '1.4' }}>{mapel.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FASE 2: PENGATURAN */}
                    {fase === 2 && (
                        <section className="card-phase" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '35px', borderRadius: '12px' }}>
                            <h2>⚙️ Pengaturan Pertandingan ({mapelTerpilih.toUpperCase()})</h2>
                            <p style={{ opacity: 0.6, marginBottom: '30px' }}>Konfigurasikan spesifikasi kuantitas dan regulasi permainan Anda.</p>

                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>🔢 Tentukan Jumlah Soal:</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {daftarJumlahSoal.map(jumlah => (
                                        <button key={jumlah} onClick={() => setJumlahSoalPilihan(jumlah)} style={{ padding: '10px 20px', borderRadius: '6px', border: jumlahSoalPilihan === jumlah ? '2px solid #00f5d4' : '1px solid var(--card-border)', backgroundColor: jumlahSoalPilihan === jumlah ? 'rgba(0, 245, 212, 0.15)' : 'transparent', color: 'var(--text-color)', fontWeight: '600', cursor: 'pointer' }}>
                                            {jumlah} Soal
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '35px' }}>
                                <hr />
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px' }}>🛡️ Pilih Mode Permainan:</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {daftarMode.map(mode => (
                                        <div key={mode.id} onClick={() => setModeGame(mode.id)} style={{ padding: '15px 20px', borderRadius: '8px', border: modeGame === mode.id ? '2px solid #00f5d4' : '1px solid var(--card-border)', background: modeGame === mode.id ? 'rgba(0, 245, 212, 0.05)' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <span style={{ fontWeight: '600', color: modeGame === mode.id ? '#00f5d4' : 'var(--text-color)' }}>{mode.nama}</span>
                                            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>{mode.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={handleKonfirmasiPengaturan} style={{ padding: '12px 30px', background: '#00f5d4', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Lanjutkan Latihan</button>
                                <button onClick={() => setFase(1)} style={{ padding: '12px 20px', background: 'transparent', color: 'var(--text-color)', border: '1px solid var(--card-border)', borderRadius: '6px', cursor: 'pointer' }}>Kembali</button>
                            </div>
                        </section>
                    )}

                    {/* FASE 3: PILIH KESULITAN */}
                    {fase === 3 && (
                        <section className="card-phase" style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}>
                            <h2 style={{ margin: '0 0 10px 0' }}>⚡ Tentukan Tingkat Kesulitan</h2>
                            <p style={{ opacity: 0.7, marginBottom: '30px' }}>Mode: <span style={{ color: '#00f5d4', fontWeight: '600' }}>{modeGame.toUpperCase()}</span> | Kuantitas: <span style={{ color: '#00f5d4', fontWeight: '600' }}>{jumlahSoalPilihan} Soal</span></p>
                            
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
                                {daftarKesulitan.map(level => (
                                    <button key={level.id} disabled={isProcessing} onClick={() => handlePilihKesulitan(level.id)} style={{ padding: '12px 30px', fontSize: '1rem', fontWeight: '600', color: '#fff', backgroundColor: 'transparent', border: `2px solid ${level.warna}`, borderRadius: '30px', cursor: isProcessing ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease', opacity: isProcessing ? 0.5 : 1 }} onMouseOver={e => { if(!isProcessing) { e.target.style.backgroundColor = level.warna; e.target.style.boxShadow = `0 0 15px ${level.warna}`; }}} onMouseOut={e => { if(!isProcessing) { e.target.style.backgroundColor = 'transparent'; e.target.style.boxShadow = 'none'; }}}>
                                        {level.nama}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setFase(2)} style={{ marginTop: '40px', background: 'none', border: 'none', color: 'var(--text-color)', opacity: 0.6, cursor: 'pointer', textDecoration: 'underline' }}>Ubah Mode & Jumlah</button>
                        </section>
                    )}

                    {/* FASE 4: ARENA KUIS */}
                    {fase === 4 && kumpulanSoal.length > 0 && (
                        <section className="card-phase" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '35px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', opacity: 0.8, marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
                                <div>
                                    <span>Mapel: <strong style={{ color: '#00f5d4' }}>{mapelTerpilih.toUpperCase()}</strong></span>
                                    <span style={{ marginLeft: '15px' }}>Soal: <strong>{indeksSoal + 1}/{kumpulanSoal.length}</strong></span>
                                </div>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    {(modeGame === 'kompetitif' || modeGame === 'eliminasi') && (
                                        <div style={{ padding: '5px 12px', background: waktuSisa <= 15 ? 'rgba(231, 76, 60, 0.2)' : 'rgba(255,255,255,0.05)', border: waktuSisa <= 15 ? '1px solid #e74c3c' : '1px solid var(--card-border)', borderRadius: '6px', fontWeight: '700', color: waktuSisa <= 15 ? '#e74c3c' : '#ffc107' }}>
                                            ⏱️ {formatWaktu(waktuSisa)}
                                        </div>
                                    )}
                                    {modeGame === 'eliminasi' && (
                                        <div style={{ padding: '5px 12px', background: 'rgba(231, 76, 60, 0.1)', border: '1px solid #e74c3c', borderRadius: '6px', fontWeight: '700', color: '#e74c3c' }}>
                                            {"❤️".repeat(nyawa)}{"🖤".repeat(3 - nyawa)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.4rem', lineHeight: '1.5', marginBottom: '30px', fontWeight: '500' }}>
                                {kumpulanSoal[indeksSoal].soal}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {kumpulanSoal[indeksSoal].opsi.map((opsi, idx) => {
                                    const isSelected = jawabanDipilih === opsi;
                                    return (
                                        <button 
                                            key={idx} 
                                            onClick={() => handlePilihOpsi(opsi)} 
                                            disabled={isProcessing}
                                            className="opsi-jawaban-btn"
                                            style={{
                                                width: '100%', 
                                                padding: '15px 20px', 
                                                textAlign: 'left', 
                                                fontSize: '1rem', 
                                                background: isSelected ? 'rgba(0, 245, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)', 
                                                border: isSelected ? '2px solid #00f5d4' : '1px solid var(--card-border)', 
                                                borderRadius: '8px', 
                                                color: 'var(--text-color)',
                                                opacity: isProcessing ? 0.6 : 1,
                                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span style={{ fontWeight: '600', marginRight: '10px', color: isSelected ? '#00f5d4' : 'inherit' }}>
                                                {String.fromCharCode(65 + idx)}.
                                            </span> 
                                            {opsi}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tombol Konfirmasi Jawaban */}
                            {jawabanDipilih && (
                                <div style={{ marginTop: '25px', textAlign: 'right' }}>
                                    <button
                                        onClick={handleKonfirmasiJawaban}
                                        disabled={isProcessing}
                                        style={{
                                            padding: '12px 30px',
                                            backgroundColor: '#00f5d4',
                                            color: '#0f172a',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                                            boxShadow: '0 0 15px rgba(0, 245, 212, 0.4)',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Yakin & Lanjutkan ➔
                                    </button>
                                </div>
                            )}
                        </section>
                    )}

                    {/* FASE 5: SKOR AKHIR */}
                    {fase === 5 && (
                        <section className="card-phase" style={{ textAlign: 'center', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '50px 30px', borderRadius: '12px' }}>
                            <i 
                                className={skorAkhir >= 70 ? "bi bi-trophy" : "bi bi-exclamation-triangle"} 
                                style={{ fontSize: '4.5rem', color: skorAkhir >= 70 ? '#ffc107' : '#e74c3c', display: 'block', marginBottom: '20px' }}
                            ></i>
                            <h2>{skorAkhir >= 70 ? "Performa Luar Biasa!" : "Evaluasi Perlu Ditingkatkan"}</h2>
                            <p style={{ opacity: 0.6, margin: '5px 0 25px 0' }}>Ringkasan performa permainan Anda di bawah pengawasan regulasi `{modeGame}`:</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '40px', flexWrap: 'wrap' }}>
                                <div style={{ padding: '15px 30px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', borderLeft: '4px solid #3498db' }}>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.6, display: 'block' }}>AKURASI JAWABAN</span>
                                    <span style={{ fontSize: '1.6rem', fontWeight: '700' }}>{jumlahBenar} / {kumpulanSoal.length} Benar</span>
                                </div>
                                <div style={{ padding: '15px 40px', background: 'rgba(0,0,0,0.15)', borderRadius: '10px', borderLeft: `4px solid ${skorAkhir >= 70 ? '#00f5d4' : '#e74c3c'}` }}>
                                    <span style={{ fontSize: '0.85rem', opacity: 0.6, display: 'block' }}>SKOR MATRIKS</span>
                                    <span style={{ fontSize: '2.2rem', fontWeight: '700', color: skorAkhir >= 70 ? '#00f5d4' : '#e74c3c' }}>{Math.round(skorAkhir)}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                <button onClick={handleResetGame} style={{ padding: '12px 25px', borderRadius: '6px', border: 'none', backgroundColor: '#00f5d4', color: '#0f172a', fontWeight: '600', cursor: 'pointer' }}>Main Lagi 🔄</button>
                                <Link to="/" style={{ padding: '12px 25px', borderRadius: '6px', border: '1px solid var(--card-border)', color: 'var(--text-color)', textDecoration: 'none', fontWeight: '600', background: 'transparent' }}>Ke Dashboard</Link>
                            </div>
                        </section>
                    )}

                </div>
            </div>

            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div className={`toast-box toast-${toast.type}`} style={{ position: 'fixed', bottom: '30px', right: '30px', padding: '15px 25px', borderRadius: '8px', backgroundColor: toast.type === 'success' ? '#2ecc71' : '#e74c3c', color: '#ffffff', fontWeight: '600', zIndex: 99999, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                    <span style={{color : 'white'}}>{toast.message}</span>
                </div>
            )}
        </>
    );
}