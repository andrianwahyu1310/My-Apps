import React from 'react';
import { useTheme } from '../components/theme';
import "../../main/base/theme.css"

export default function PengaturanTema() {
    // ⁡⁢⁣⁣Ambil state tema aktif dan fungsi pengubahnya dari Context Global⁡
    const { theme, ubahTema } = useTheme();

    const daftarPilihanTema = [
        { id: 'light', judul: 'Light', deskripsi: 'Terang & Bersih' },
        { id: 'dark', judul: 'Dark', deskripsi: 'Gelap & Tenang' },
        { id: 'cyberpunk', judul: 'Cyberpunk', deskripsi: 'Neon & Futuristik' }
    ];

    return (
        <div className="main-content">
            <div className="settings-container">
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