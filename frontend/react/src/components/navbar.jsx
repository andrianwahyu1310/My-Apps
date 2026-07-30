import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; 
import '../../main/second/navbar.css';

export default function Navbar({ user: userProp, onLogout }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('00:00:00 | Menghitung...');
    
    // Inisialisasi useRef untuk area dropdown
    const dropdownRef = useRef(null);

    // Ambil data user dari AuthContext
    const { user: userCtx } = useContext(AuthContext);

    // Sanitasi Username Display
    const rawUser = userProp || userCtx;
    const usernameDisplay = typeof rawUser === 'object' 
        ? (rawUser?.username || rawUser?.name || 'Guest') 
        : (rawUser || 'Guest');

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

    // Listener untuk mendeteksi klik di luar elemen dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Timer Detak Waktu Realtime
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
            {/* KANAN: JUDUL HALAMAN */}
            <div className="nav-bar-kanan">
                <p>Welcome to {getPageTitle(location.pathname)}</p>
            </div>

            {/* TENGAH: DETAK WAKTU REALTIME */}
            <div className="nav-bar-tengah">
                <p id="time">{currentTime}</p>
            </div>

            {/* KIRI: NAVIGASI & DROPDOWN SETTINGS */}
            <div className="nav-bar-kiri">
                {/* NAVIGASI DESKTOP */}
                <div className="nav-links-desktop">
                    <Link to="/detail" className={`${location.pathname === '/detail' ? 'active' : ''} unlock`}>Detail</Link>
                    <Link to="/contact" className={`${location.pathname === '/contact' ? 'active' : ''} unlock`}>Contact</Link>
                    <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                </div>

                {/* DROPDOWN CONTAINER */}
                <div className="settings-container" ref={dropdownRef}>
                    <button id="settings-btn" onClick={() => setIsOpen(!isOpen)}>
                        <img src="./assets/images/settings_2.svg" alt="Setting" />
                    </button>

                    {isOpen && (
                        <div className="dropdown-card">
                            <div className="dropdown-header">
                                <h4>Pengaturan Akun, {usernameDisplay}</h4>
                            </div>
                            <div className="dropdown-body">
                                
                                {/* NAVIGASI KHUSUS MOBILE */}
                                <div className="nav-links-mobile">
                                    <Link to="/detail" className={`dropdown-item ${location.pathname === '/detail' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                        <i className="bi bi-person-badge"></i> Detail
                                    </Link>
                                    <hr className="dropdown-divider" />
                                    <Link to="/contact" className={`dropdown-item ${location.pathname === '/contact' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                        <i className="bi bi-envelope"></i> Contact
                                    </Link>
                                    <hr className="dropdown-divider" />
                                    <Link to="/about" className={`dropdown-item ${location.pathname === '/about' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                        <i className="bi bi-info-circle"></i> About
                                    </Link>
                                    <hr className="dropdown-divider" />
                                </div>

                                {/* ITEM DROPDOWN REGULER */}
                                <Link to="/" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-house"></i> Beranda
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/mainTools" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-briefcase"></i> Tools
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/container-brain-teaser" className="dropdown-item" onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-controller"></i> Asah Otak
                                </Link>
                                <hr className="dropdown-divider" />
                                <Link to="/setTheme" className={`dropdown-item ${location.pathname === '/setTheme' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
                                    <i className="bi bi-palette"></i> Theme
                                </Link>
                                <hr className="dropdown-divider" />
                                
                                {/* AUTHENTICATION ACTION */}
                                {usernameDisplay !== "Guest" && usernameDisplay !== "" ? (
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