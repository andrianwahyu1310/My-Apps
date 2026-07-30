import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/theme';
import Navbar from '../components/navbar';
import "../../main/base/theme.css"

export default function PengaturanTema({user, onLogout}) {
    // ⁡⁢⁣⁣Ambil state tema aktif dan fungsi pengubahnya dari Context Global⁡
    const { theme, ubahTema } = useTheme();

    const daftarPilihanTema = [
        { id: 'light', judul: 'Light', deskripsi: 'Terang & Bersih' },
        { id: 'dark', judul: 'Dark', deskripsi: 'Gelap & Tenang' },
        { id: 'cyberpunk', judul: 'Cyberpunk', deskripsi: 'Neon & Futuristik' }
    ];

    return (

        <div className="main-content">
            <Navbar user={user} onLogout={onLogout} />

            <div className="settings-container-theme">
                <Link to="/" className="btn-back" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '0px', marginBottom: '40px' }}>
                    <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
                </Link>

                <h2>Pilih Tema Aplikasi</h2>
                <p>Silakan pilih tema yang paling nyaman untuk mata Anda.</p>
                
                <div className="theme-options">
                    {daftarPilihanTema.map((item) => (
                        <div 
                            key={item.id}
                            className={`theme-card ${item.id} ${theme === item.id ? 'active' : ''}`}
                            onClick={() => ubahTema(item.id)}
                            style={{
                                border: theme === item.id ? '2px solid #00f5d4' : '2px solid transparent',
                                cursor: 'pointer'
                            }}
                        >
                            <h3>{item.judul}</h3>
                            <p>{item.deskripsi}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}