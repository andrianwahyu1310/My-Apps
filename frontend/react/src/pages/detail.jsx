import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_URL, { apiFetch } from "../../src/config/api";

export default function DetailAkun() {
    const navigate = useNavigate();
    
    // 1. Inisialisasi State Komponen
    const [accountData, setAccountData] = useState(null);
    const [sessionToken, setSessionToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 2. Siklus Pengambilan Data Akun Spesifik dari Backend
    useEffect(() => {
        const ambilDetailAkun = async () => {
            try {
                setIsLoading(true);
                
                if (!API_URL) {
                    alert("Fitur registrasi hanya tersedia saat backend dijalankan.");
                    return;
                }

                // Menembak rute spesifik yang telah kita daftarkan di backend Express
                const { data } = await apiFetch('/api/detail', {
                    method: 'GET',
                    credentials: 'include', // AMUNISI KRUSIAL: Memastikan cookie session (connect.sid) ikut terkirim lintas port
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (data.success) {
                    // Menyimpan data spesifik hasil filter users.json dari server
                    setAccountData(data); 
                } else {
                    // Jika session kosong atau kedaluwarsa, lemparkan user kembali ke gerbang login
                    console.warn("Sesi tidak valid, mengalihkan ke halaman login...");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Gagal memuat data detail akun:", error.message);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        // Mengunci token acak di dalam useEffect agar nilainya konisten dan tidak berubah-ubah saat re-render
        const tokenAcak = "SES_ID_" + Math.random().toString(36).substr(2, 9).toUpperCase();
        setSessionToken(tokenAcak);

        // Eksekusi fungsi penjemputan data
        ambilDetailAkun();
    }, [navigate]);

    // 3. Tampilan Loading saat Menunggu Konfirmasi Server
    if (isLoading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p style={{ color: 'var(--text-color)', fontSize: '1.2rem' }}>
                    Memverifikasi Otoritas Sesi Akun Senpai...
                </p>
            </div>
        );
    }

    // 4. Struktur Utama Tampilan Komponen Detail Akun
    return (
        <main className="detail-wrapper" style={{ padding: '50px 50px', boxSizing: 'border-box' }}>
            <Link to="/" className="btn-back" style={{width: '20%'}}>
                <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
            </Link>

            <div 
                className="card-detail" 
                style={{ 
                    maxWidth: '600px',
                    margin: '100px auto',
                    padding: '30px',
                    borderRadius: '12px',
                    // Mengikuti variabel global tema agar selaras dengan dashboard.css
                    background: 'var(--card-bg)', 
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease'
                }}
            >
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: '600' }}>
                    Informasi Detail Akun & Sistem
                </h2>
                <hr style={{ opacity: 0.15, margin: '15px 0', border: 'none', height: '1px', backgroundColor: 'var(--text-color)' }} />
                
                {/* GRUP DATA 1: USERNAME (DINAMIS DARI SERVER) */}
                <div className="info-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px', fontWeight: '5px' }}>
                        Nama Pengguna (Username)
                    </label>
                    <div 
                        className="info-value"
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            padding: '4px 12px',
                        }}>
                        {accountData?.username}
                    </div>
                </div>

                {/* GRUP DATA 2: STATUS HAK AKSES (DINAMIS DARI SERVER) */}
                <div className="info-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px' }}>
                        Status Hak Akses
                    </label>
                    <span 
                        className="badge-status" 
                        style={{ 
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            backgroundColor: 'rgba(46, 204, 113, 0.2)',
                            color: '#2ecc71',
                            border: '1px solid rgba(46, 204, 113, 0.3)'
                        }}
                    >
                        {accountData?.statusAkses}
                    </span>
                </div>

                {/* GRUP DATA 3: TOKEN KEAMANAN SESI (DIKUNCI FRONTEND) */}
                <div className="info-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px' }}>
                        Token Keamanan Sesi
                    </label>
                    <p 
                        className="code-style" 
                        style={{ 
                            fontFamily: 'Courier New, Courier, monospace',
                            margin: 0,
                            padding: '8px 12px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            borderRadius: '6px',
                            display: 'inline-block',
                            fontSize: '0.95rem',
                            letterSpacing: '1px'
                        }}
                    >
                        {sessionToken}
                    </p>
                </div>

                {/* GRUP DATA 4: DEDIKASI SISTEM (DINAMIS DARI SERVER) */}
                <div className="info-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px' }}>
                        Dedikasi Sistem
                    </label>
                    <p 
                        className="info-value" 
                        style={{ 
                            margin: 0,
                            fontWeight: '600',
                            // Variabel warna header akan menyala hijau terang saat mode cyberpunk aktif
                            color: 'var(--header, #2b6cb0)', 
                            transition: 'color 0.2s ease'
                        }}
                    >
                        {accountData?.dedikasi}
                    </p>
                </div>
            </div>
        </main>
    );
}