import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../main/second/navbar.css';

export default function Navbar({ user, onLogout }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00:00 | Menghitung...');

    const getPageTitle = (path) => {
        switch (path) {
            case '/dashboard': return 'Dashboard Utama';
            case '/detail': return 'Detail Akun';
            case '/contact': return 'Layanan Kontak';
            case '/about': return 'About';
            case '/setTheme': return 'Theme Settings';
            case '/tools': return 'Tools Utama';
            case '/brainTeaser': return 'Asah Otak';
            default: return 'Dashboard Utama';
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const jam = now.toLocaleTimeString('id-ID'); 
            const tanggal = now.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            setCurrentTime(`${jam} | ${tanggal}`);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="nav-bar">
            {/* ⁡⁣⁣⁢KANAN: JUDUL HALAMAN⁡ */}
            <div className="nav-bar-kanan">
                <p>Welcome to {getPageTitle(location.pathname)}</p>
            </div>

            {/* ⁡⁣⁣⁢TENGAH: DETAK WAKTU REALTIME⁡ */}
            <div className="nav-bar-tengah">
                <p id="time">{currentTime}</p>
            </div>

            {/* ⁡⁣⁣⁢KIRI: NAVIGASI & DROPDOWN SETTINGS⁡ */}
            <div className="nav-bar-kiri">
                {/* <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Beranda</Link> */}
                <Link to="/detail" className={`${location.pathname === '/detail' ? 'active' : ''} unlock`}>Detail</Link>
                <Link to="/contact" className={`${location.pathname === '/contact' ? 'active' : ''} unlock`}>Contact</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>

                {/* ⁡⁣⁣⁢DROPDOWN CONTAINER⁡ */}
                <div className="settings-container">
                    <button id="settings-btn" onClick={() => setIsOpen(!isOpen)}>
                        <img src="/images/settings_2.svg" alt="setting"/>
                    </button>

                    {/* ⁡⁢⁣⁣Logika Taktis: Hanya render card ke DOM jika state isOpen bernilai true⁡ */}
                    {isOpen && (
                        <div className="dropdown-card">
                            <div className="dropdown-header">
                                <h4>Pengaturan Akun, {user || 'Guest'}</h4>
                            </div>
                            <div className="dropdown-body">
                                <Link to="/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-house"></i> Beranda
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/mainTools" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-briefcase"></i> Tools
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/container-brain-teaser" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-briefcase"></i> Asah Otak
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/setTheme" className={`dropdown-item ${location.pathname === '/setTheme' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-palette"></i> Theme
                                </Link>
                                <hr className="dropdown-divider" />
                                
                                {user && user !== "Guest" && user !== "" ? (
                                    <button 
                                        className="dropdown-item logout" 
                                        onClick={() => {
                                            setIsOpen(false);
                                            if (onLogout) onLogout();
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right"></i> Logout
                                    </button>
                                ) : (
                                    <Link to="/login" className="dropdown-item login" onClick={() => setIsOpen(false)}>
                                        <i className="bi bi-box-arrow-in-right"></i> Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}