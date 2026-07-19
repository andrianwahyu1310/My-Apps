import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_URL from "../../src/config/api";

export default function About() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // 🛡️ Menjaga Integritas Halaman: Memastikan Hanya User Terautentikasi yang Bisa Mengakses
    useEffect(() => {
        const verifikasiSesiLayanan = async () => {
            try {
                setIsLoading(true);
                if (!API_URL) {
                    alert("Fitur registrasi hanya tersedia saat backend dijalankan.");
                    return;
                }

                const respon = await fetch(`${API_URL}/api/auth-check`, {
                    method: 'GET',
                    credentials: 'include' // Amunisi lintas port untuk menyertakan cookie session
                });
                const data = await respon.json();

                if (!data.success || !data.loggedIn) {
                    console.warn("Akses halaman tentang ditolak, mengalihkan ke gerbang login...");
                    navigate('/login');
                }
            } catch (error) {
                console.error("Gagal memverifikasi sesi halaman tentang:", error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        verifikasiSesiLayanan();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p style={{ color: 'var(--text-color)', fontSize: '1.1rem' }}>
                    Memverifikasi Otoritas Akses Halaman...
                </p>
            </div>
        );
    }

    return (
        <div 
            className="about-page-wrapper" 
            style={{ 
                padding: '50px 60px', 
                boxSizing: 'border-box',
                minHeight: 'calc(100vh - 80px)', // Menyesuaikan sisa ruang di bawah navbar
                // display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Link to="/" className="btn-back" style={{width: '20%'}}>
                <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
            </Link>

            <main 
                className="about-content-container"
                style={{
                    maxWidth: '700px',
                    width: '100%',
                    margin: '40px auto',
                    padding: '40px',
                    borderRadius: '12px',
                    // Otomatis adaptif mengikuti skema warna tema dari theme.js Senpai
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Judul Utama */}
                <h1 
                    className="about-title" 
                    style={{ 
                        margin: '0 0 20px 0', 
                        fontSize: '2.2rem', 
                        fontWeight: '700',
                        color: 'var(--text-color)'
                    }}
                >
                    Tentang Aplikasi Kita
                </h1>
                
                {/* Deskripsi Aplikasi */}
                <p 
                    className="about-description" 
                    style={{ 
                        fontSize: '1.05rem', 
                        lineHeight: '1.7', 
                        opacity: 0.9, 
                        marginBottom: '30px',
                        color: 'var(--text-color)',
                        textAlign: 'justify'
                    }}
                >
                    Selamat datang di Aplikasi kami. Aplikasi ini dibuat untuk tes dan belajar, 
                    maka dari itu, aplikasi ini diharapkan bisa menjadi pertimbangan atau contoh 
                    untuk membuat aplikasi berbasis website, serta memberikan pengalaman dari konten 
                    yang interaktif, keren dan juga aplikasi yang efisien bagi seluruh pengguna.
                </p>

                {/* Subjudul Visi & Misi */}
                <h3 
                    className="about-subtitle" 
                    style={{ 
                        margin: '0 0 15px 0', 
                        fontSize: '1.4rem', 
                        fontWeight: '600',
                        color: 'var(--header, #2b6cb0)' // Menyala warna biru/hijau toska saat tema cyberpunk aktif
                    }}
                >
                    Visi & Misi
                </h3>
                
                {/* Daftar Visi & Misi */}
                <ul 
                    className="about-list" 
                    style={{ 
                        paddingLeft: '20px', 
                        marginBottom: '35px', 
                        fontSize: '1rem', 
                        lineHeight: '1.8',
                        color: 'var(--text-color)',
                        opacity: 0.85
                    }}
                >
                    <li style={{ marginBottom: '10px' }}>
                        Menyediakan akses informasi yang adil, transparan, dan aman bagi seluruh anggota.
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        Mengembangkan sistem proteksi sirkulasi data yang mutlak bebas dari celah keamanan.
                    </li>
                    <li style={{ marginBottom: '0' }}>
                        Mendukung digitalisasi ekosistem belajar mengajar secara modern, cepat, dan responsif.
                    </li>
                </ul>

                {/* Kotak Status Informasi Sistem */}
                <div 
                    className="about-status-box"
                    style={{
                        padding: '15px 20px',
                        borderRadius: '8px',
                        background: 'rgba(0, 0, 0, 0.2)', // Efek kontras gelap di dalam kartu komponen
                        borderLeft: '4px solid #00f5d4', // Aksen neon pelindung khas dashboard
                        marginTop: '20px'
                    }}
                >
                    <p 
                        className="about-status-text" 
                        style={{ 
                            margin: 0, 
                            fontSize: '0.95rem', 
                            color: 'var(--text-color)' 
                        }}
                    >
                        <strong style={{ color: '#00f5d4' }}>Status Sistem:</strong> Versi 1.0.0 (Production Ready - Arsitektur Web Terintegrasi)
                    </p>
                </div>

            </main>
        </div>
    );
}