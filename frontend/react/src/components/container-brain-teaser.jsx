// import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import '/main/base/global-tools.css';

// 1. Impor data dari backend menggunakan nama variabel lokal yang unik agar tidak bentrok
import jsonBackendBrain from '../../../../backend/data/brainTeaser.json';

export default function MenuBrain({ title = "Utama", user, onLogout }) {
    
    // 2. Taktik Penggabungan Keamanan: Menyinkronkan nama variabel secara adil dan pas tanpa salah ketik
    const dataBrainAktif = jsonBackendBrain || [];

    // Taktik Deteksi Integritas Data di Konsol Browser
    console.log("Data brain yang berhasil dimuat oleh sistem:", dataBrainAktif);

    return (
        <>
            {/* Navbar berdiri secara independen dengan posisi fixed */}
            <Navbar user={user} onLogout={onLogout} />

            {/* 🌟 PEMBUNGKUS UTAMA: Menggunakan tag <div> yang utuh untuk menahan jarak dari Navbar */}
            <div className="tools-page-wrapper" style={{ minHeight: '100vh', padding: '100px 20px 40px' }}>
                
                <Link to="/" className="btn-back" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
                </Link>

                <h1 style={{ 
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)', 
                    paddingBottom: '15px', 
                    marginBottom: '30px',
                    color: 'var(--text-color)'
                }}>
                    Pusat Perbrainan: <span className='headers' style={{ color: 'var(--header, #00f5d4)' }}>{title}</span>
                </h1>

                {/* Logika kondisional membaca array dataBrainAktif secara protektif */}
                {dataBrainAktif && dataBrainAktif.length > 0 ? (
                    <div className="tools-grid" id="tools-grids">
                        {dataBrainAktif.map((brain) => (
                            <article 
                                className="tools-card" 
                                key={brain.id}
                                style={{
                                    background: 'var(--card-bg)',
                                    border: '1px solid var(--card-border)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                }}
                            >
                                <div className="tools-content" style={{ padding: '25px' }}>
                                    <h2 className="tools-title" style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: 'var(--text-color)' }}>
                                        {brain.nama_brain}
                                    </h2>
                                    <p className="tools-desc" style={{ opacity: 0.8, fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px', color: 'var(--text-color)' }}>
                                        {brain.deskripsi}
                                    </p>
                                    
                                    {/* Link React Router mengarah ke path kustom dari JSON */}
                                    <Link 
                                        to={brain.url} 
                                        className="btn-read"
                                        style={{
                                            display: 'inline-block',
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            backgroundColor: 'var(--header, #00f5d4)',
                                            color: '#0f172a',
                                            fontWeight: '600',
                                            textDecoration: 'none',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Buka Game 🎮
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    // Tampilan ketika array kosong atau gagal memuat data biner
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--card-border)' }}>
                        <i className="bi bi-controller" style={{ fontSize: '3.5rem', color: '#ffc107', display: 'block', marginBottom: '15px' }}></i>
                        <h3 style={{ color: 'var(--text-color)', margin: '0 0 10px 0' }}>Sistem Gagal Memuat Kartu Permainan</h3>
                        <p style={{ color: 'var(--text-color)', opacity: 0.6, margin: 0, fontSize: '0.95rem' }}>
                            Data JSON terdeteksi kosong atau jalur impor database `brainTeaser.json` belum terhubung secara adil.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}