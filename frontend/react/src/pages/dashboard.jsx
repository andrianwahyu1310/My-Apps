import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

// IMPORT DATA BARU
import { databaseChangelog } from '../utils/changelogData'; 
import { databaseQuotes } from '../utils/quotes';
import { typewriterMessages } from '../utils/typewritter';
import Navbar from '../components/navbar';
import "../../main/dashboard.css";
import { apiFetch } from "../../src/config/api";
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
    // === SEKTOR STATE ===
    const [username, setUsername] = useState('Guest');
    const [categories, setCategories] = useState([]);
    const [typewriterText, setTypewriterText] = useState('');

    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const currentUsername = user || 'Guest';

    const handleLogoutAction = async () => {
        try {
            const { data } = await apiFetch("/api/logout", {
                method: "GET",
                credentials: "include"
            });

            if (data?.success) {
                console.log("Sesi di server berhasil dihancurkan.");
            } else {
                console.warn("Backend menolak atau sesi sudah kedaluwarsa terlebih dahulu.");
            }
        } catch (err) {
            console.error("Gagal menghubungi server untuk logout:", err);
        } finally {
            sessionStorage.clear();
            localStorage.removeItem("user_data");
            navigate("/login", { replace: true }); 
        }
    };
    
    // --- STATE WIDGET CUACA & KUTIPAN ---
    const [koordinatCuaca, setKoordinatCuaca] = useState('-6.28,106.71');
    const [infoCuaca, setInfoCuaca] = useState({ deg: '--°C', desc: 'Memuat Cuaca...', wind: '-- km/jam', humidity: '--%' });
    const [quote, setQuote] = useState({ text: 'Memuat Kutipan...', author: '' });
    
    // --- STATE CHANGELOG ADAPTIF ---
    const daftarVersi = Object.keys(databaseChangelog || {}); 
    const [versiTerpilih, setVersiTerpilih] = useState(() => daftarVersi[0] || 'v1.2.5');
    const [tabAktif, setTabAktif] = useState('updates'); // Sesuaikan key ini jika di changelogData menggunakan key lain (misal: 'fitur')

    // Pertahanan: Jika daftarVersi berubah atau versiTerpilih tidak valid, reset ke versi pertama
    useEffect(() => {
        if (daftarVersi.length > 0 && !daftarVersi.includes(versiTerpilih)) {
            setVersiTerpilih(daftarVersi[0]);
        }
    }, [daftarVersi, versiTerpilih]);

    // --- SEKTOR EFFECT (LOGIKA SISTEM) ---
// --- SEKTOR EFFECT (PENGAMBILAN DATA KATEGORI) ---
useEffect(() => {
    if (loading) return;

    if (user) {
        setUsername(user);
        
        apiFetch("/api/categories")
            .then(({ data }) => {
                // console.log("Response Categories API:", data); // Untuk debugging Senpai di console

                // Ekstrak array dari berbagai kemungkinan struktur respon backend
                let categoryArray = [];
                if (Array.isArray(data)) {
                    categoryArray = data;
                } else if (Array.isArray(data?.data)) {
                    categoryArray = data.data;
                } else if (Array.isArray(data?.categories)) {
                    categoryArray = data.categories;
                }

                setCategories(categoryArray);
            })
            .catch(err => {
                console.error("Gagal memuat kategori:", err);
                setCategories([]);
            });
    } else {
        navigate("/login", { replace: true });
    }
}, [loading, user, navigate]);

    // --- ANIMASI TYPEWRITER ---
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        let teksTerakumulasi = '';

        const resetTypewriter = window.setTimeout(() => {
            setTypewriterText('');
            setShowCursor(true);
        }, 0);

        const namaClean = typeof username === 'object' 
            ? (username?.username || username?.name || 'Guest') 
            : (username || 'Guest');

        const teksLengkap = namaClean === 'Guest'
            ? typewriterMessages?.guest || 'Selamat Datang!'
            : `${namaClean}! ${typewriterMessages?.user || 'Selamat Datang kembali!'}`;

        const intervalKetik = setInterval(() => {
            if (i < teksLengkap.length) {
                teksTerakumulasi += teksLengkap.charAt(i); 
                setTypewriterText(teksTerakumulasi);
                i++;
            } else {
                clearInterval(intervalKetik);
                setShowCursor(false);
            }
        }, 80);

        return () => {
            window.clearTimeout(resetTypewriter);
            clearInterval(intervalKetik);
        };
    }, [username]);

    // --- WIDGET KUTIPAN (QUOTE) ---
    useEffect(() => {
        const gantiKutipan = () => {
            if (Array.isArray(databaseQuotes) && databaseQuotes.length > 0) {
                const acak = databaseQuotes[Math.floor(Math.random() * databaseQuotes.length)];
                setQuote(acak);
            }
        };

        gantiKutipan();
        const intervalQuote = setInterval(gantiKutipan, 10000);
        return () => clearInterval(intervalQuote);
    }, []);

    // --- WIDGET API CUACA ---
    useEffect(() => {
        const resetWeatherStatus = window.setTimeout(() => {
            setInfoCuaca(prev => ({ ...prev, desc: 'Memuat Cuaca...' }));
        }, 0);

        const [lat, lon] = koordinatCuaca.split(',');

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
            .then(res => {
                if (!res.ok) throw new Error('Weather API request failed');
                return res.json();
            })
            .then(data => {
                if (data.current_weather) {
                    setInfoCuaca({
                        deg: `${Math.round(data.current_weather.temperature)}°C`,
                        desc: data.current_weather.weathercode === 0 ? 'Cerah Benderang' : 'Berawan Ringan',
                        wind: `${data.current_weather.windspeed} km/jam`, 
                        humidity: '75%'
                    });
                }
            })
            .catch(() => setInfoCuaca({ deg: '29°C', desc: 'Koneksi Terbatasi', wind: '12 km/jam', humidity: '80%' }));

        return () => {
            window.clearTimeout(resetWeatherStatus);
        };
    }, [koordinatCuaca]);

    // Ambil daftar item log berdasarkan versi dan tab yang aktif
    const currentChangelogData = databaseChangelog?.[versiTerpilih];
    const listKontenLog = currentChangelogData?.[tabAktif] || currentChangelogData?.[tabAktif === 'updates' ? 'fitur' : 'bug'] || [];

    return (
        <div className="main-content">
            <Navbar user={currentUsername} onLogout={handleLogoutAction} />

            {/* TEKS MESIN KETIK */}
            <h1 className="typewriter-container" style={{ fontFamily: "'Courier New', Courier, monospace", fontStyle: 'italic', fontSize: '24px' }}>
                Hello, <span>{typewriterText}</span>
                {showCursor && <span className="typewriter-cursor">|</span>}
            </h1>

            {/* AREA STRUKTUR UTAMA WIDGET */}
            <div className="dashboard-widgets">
                
                {/* WIDGET KUTIPAN */}
                <div className="quote-widget">
                    <h2 className="quote-text">"{quote.text}"</h2>
                    <p className="quote-author">- {quote.author}</p>
                </div>

                {/* WIDGET CUACA */}
                <div className="weather-widget">
                    <div className="weather-header">
                        <select id="weather-location-select" value={koordinatCuaca} onChange={(e) => setKoordinatCuaca(e.target.value)}>
                            <option value="-6.28,106.71">Tangerang Selatan</option>
                            <option value="-6.20,106.83">Jakarta</option>
                            <option value="-6.91,107.61">Bandung</option>
                            <option value="-7.25,112.75">Surabaya</option>
                            <option value="-8.65,115.22">Bali (Denpasar)</option>
                            <option value="35.67,139.65">Jepang (Tokyo)</option>
                        </select>
                        <span className="weather-status">{infoCuaca.desc}</span>
                    </div>
                    <div className="weather-body">
                        <div className="weather-display-main">
                            <h1 className="weather-temp">{infoCuaca.deg}</h1>
                            <i className="bi bi-cloud-sun" id="weather-icon" style={{ fontSize: '5.5rem', marginRight: '110px' }}></i>
                        </div>
                        <div className="weather-details">
                            <div className="detail-item"><span>Kecepatan Angin</span><strong>{infoCuaca.wind}</strong></div>
                            <div className="detail-item"><span>Kelembapan</span><strong>{infoCuaca.humidity}</strong></div>
                        </div>
                    </div>
                </div>

                {/* WIDGET LOG PEMBARUAN (CHANGELOG) */}
                <div className="changelog-container">
                    <div className="changelog-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="bi bi-journal-text" style={{ fontSize: '1.2rem', color: '#00f5d4' }}></i>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Log Pembaruan</h3>
                        </div>
                        <select 
                            className='version-badge' 
                            value={versiTerpilih} 
                            onChange={(e) => setVersiTerpilih(e.target.value)} 
                            style={{ background: 'rgba(0, 245, 212, 0.1)', color: '#00f5d4', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid rgba(0, 245, 212, 0.2)', cursor: 'pointer', width: '120px' }}
                        >
                            {daftarVersi.map(versi => (
                                <option key={versi} value={versi} style={{ background: '#121212', color: '#fff' }}>
                                    {versi} {versi === daftarVersi[0] ? '(Terbaru)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="toggle-buttons-wrapper">
                        <button 
                            className={`toggle-nav-btn ${tabAktif === 'updates' ? 'active-state' : ''}`} 
                            onClick={() => setTabAktif('updates')} 
                            style={{ borderRadius: '10px' }}
                        >
                            Fitur Baru
                        </button>
                        <button 
                            className={`toggle-nav-btn ${tabAktif === 'fixes' ? 'active-state' : ''}`} 
                            onClick={() => setTabAktif('fixes')} 
                            style={{ borderRadius: '10px' }}
                        >
                            Perbaikan Bug
                        </button>
                    </div>

                    <div className={`content-display-box ${tabAktif === 'updates' ? 'border-updates' : 'border-fixes'}`}>
                        <div className="content-pane">
                            <ul className="changelog-list">
                                {listKontenLog.length > 0 ? (
                                    listKontenLog.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))
                                ) : (
                                    <li style={{ fontStyle: 'italic', opacity: 0.6 }}>Tidak ada catatan untuk kategori ini.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="changelog-footer">
                        Diperbarui pada: {currentChangelogData?.tanggal || '---'}
                    </div>
                </div>
            </div>

            {/* SEKSI KATEGORI BERITA */}
            <div className="outerFiture">
                <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.15)', margin: '0 auto 40px', width: '100%' }}></div>
                <p className="desc-category">Baca Berita Sesuai Kategori</p>
                
                <div className="mainFiture">
                    {categories && categories.length > 0 ? (
                        categories.map((ctgr) => (
                            <div key={ctgr.id || ctgr._id} className="fiture-box">
                                <Link to={`/artikel?category=${ctgr.id || ctgr._id}`}>
                                    <img 
                                        src={ctgr.gambar ? `./assets/images/${ctgr.gambar}` : '/assets/images/default.jpg'} 
                                        alt={ctgr.nama || 'Kategori'} 
                                        onError={(e) => {
                                            // Fallback jika gambar gagal dimuat
                                            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><rect width='100%' height='100%' fill='%232a2a2a'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-size='14' font-family='sans-serif'>No Image</text></svg>";
                                        }}
                                    />
                                    <h4>{ctgr.nama || ctgr.name}</h4>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', width: '100%' }}>
                            Belum ada kategori yang tersedia.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}