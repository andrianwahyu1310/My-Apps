import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from "../../src/config/api";
import { AuthContext } from '../contexts/AuthContext';

export default function DetailAkun() {
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    
    // 1. Inisialisasi State Komponen
    const [accountData, setAccountData] = useState(null);
    const [sessionToken, setSessionToken] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 2. Siklus Pengambilan Data Akun Spesifik dari Backend
    useEffect(() => {
        if (loading) return;

        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        const ambilDetailAkun = async () => {
            try {
                setIsLoading(true);

                // apiFetch sudah otomatis menangani credentials & Content-Type
                const { data } = await apiFetch('/api/detail');

                if (data.success && data.user) {
                    // 💡 PERBAIKAN 1: Simpan data.user secara langsung agar praktis
                    setAccountData(data.user);
                } else {
                    console.warn("Sesi tidak valid, mengalihkan ke halaman login...");
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Gagal memuat data detail akun:", error.message);
                // Beri penanganan gracefully tanpa langsung melempar jika hanya glitch network
            } finally {
                setIsLoading(false);
            }
        };

        const tokenAcak = "SES_ID_" + Math.random().toString(36).substr(2, 9).toUpperCase();
        setSessionToken(tokenAcak);

        ambilDetailAkun();
    }, [loading, user, navigate]);

    // 3. Tampilan Loading saat Menunggu Konfirmasi Server
    if (loading || isLoading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p style={{ color: 'var(--text-color, #fff)', fontSize: '1.2rem' }}>
                    Memverifikasi Otoritas Sesi Akun Senpai...
                </p>
            </div>
        );
    }

    // 4. Struktur Utama Tampilan Komponen Detail Akun
    return (
        <main className="detail-wrapper" style={{ padding: '50px 50px', boxSizing: 'border-box' }}>
            <Link to="/" className="btn-back" style={{ width: '20%' }}>
                <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
            </Link>

            <div 
                className="card-detail" 
                style={{ 
                    maxWidth: '600px',
                    margin: '50px auto',
                    padding: '30px',
                    borderRadius: '12px',
                    background: 'var(--card-bg, rgba(255, 255, 255, 0.05))', 
                    border: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease'
                }}
            >
                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem', fontWeight: '600' }}>
                    Informasi Detail Akun & Sistem
                </h2>
                <hr style={{ opacity: 0.15, margin: '15px 0', border: 'none', height: '1px', backgroundColor: 'var(--text-color, #fff)' }} />
                
                {/* GRUP DATA 1: USERNAME */}
                <div className="info-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px' }}>
                        Nama Pengguna (Username)
                    </label>
                    <div 
                        className="info-value"
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            padding: '4px 12px',
                        }}>
                        {accountData?.username || "Tidak diketahui"}
                    </div>
                </div>

                {/* GRUP DATA 2: STATUS HAK AKSES */}
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
                        {accountData?.status || "Aktif"}
                    </span>
                </div>

                {/* GRUP DATA 3: TOKEN KEAMANAN SESI */}
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

                {/* GRUP DATA 4: TANGGAL PEMBUATAN AKUN / TEMA */}
                <div className="info-group">
                    <label style={{ display: 'block', fontSize: '0.9rem', opacity: 0.7, marginBottom: '6px' }}>
                        Tema Aktif Akun
                    </label>
                    <p 
                        className="info-value" 
                        style={{ 
                            margin: 0,
                            fontWeight: '600',
                            color: 'var(--header, #2b6cb0)', 
                            transition: 'color 0.2s ease',
                            textTransform: 'capitalize'
                        }}
                    >
                        {accountData?.theme || "Default"}
                    </p>
                </div>
            </div>
        </main>
    );
}