import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '/main/base/global-tools.css';

// 1. Impor data dari backend menggunakan nama variabel lokal yang unik agar tidak bentrok
import jsonBackendTools from '../../../../backend/data/tools.json';

export default function MenuTools({ title = "Utama", user, onLogout }) {
    
    // 2. Taktik Penggabungan: Jika ada data dari props gunakan props, jika tidak ada pakai data JSON backend asli
    const dataAlatAktif = jsonBackendTools || [];

    // Taktik Deteksi di Konsol Browser
    console.log("Data alat yang berhasil dimuat oleh sistem:", dataAlatAktif);

    return (
        <>
            {/* Navbar berdiri secara independen dengan posisi fixed */}
            <Navbar user={user} onLogout={onLogout} />

            {/* 🌟 PEMBUNGKUS UTAMA: Menggunakan tag <div> yang utuh untuk menahan jarak dari Navbar */}
            <div className="tools-page-wrapper">
                
                <Link to="/dashboard" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
                </Link>

                <h1 style={{ 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)', 
                    paddingBottom: '15px', 
                    marginBottom: '30px' 
                }}>
                    Pusat Peralatan: <span className='headers'>{title}</span>
                </h1>

                {/* Logika kondisional membaca array dataAlatAktif */}
                {dataAlatAktif && dataAlatAktif.length > 0 ? (
                    <div className="tools-grid" id="tools-grids">
                        {dataAlatAktif.map((alat) => (
                            <article className="tools-card" key={alat.id}>
                                <div className="tools-content">
                                    <h2 className="tools-title">{alat.nama_alat}</h2>
                                    <p className="tools-desc">{alat.deskripsi}</p>
                                    
                                    {/* Link React Router mengarah ke path kustom dari JSON */}
                                    <Link to={alat.url} className="btn-read">
                                        Buka Alat
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <i className="bi bi-tools" style={{ fontSize: '3rem', color: '#ffc107', display: 'block', marginBottom: '15px' }}></i>
                        <h3>Sistem Gagal Memuat Kartu</h3>
                        <p style={{ color: '#aaa', margin: 0 }}>
                            Data JSON terdeteksi kosong atau jalurnya belum terhubung secara adil.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}