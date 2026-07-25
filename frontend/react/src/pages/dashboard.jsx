import  { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

// IMPORT DATA BARU
import { databaseChangelog } from '../utils/changelogData'; 
import { databaseQuotes } from '../utils/quotes';
import { typewriterMessages } from '../utils/typewritter';
import Navbar from '../components/navbar';
import "../../main/dashboard.css";
import { apiFetch } from "../../src/config/api";
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
    // ⁡⁣⁣⁢=== SEKTOR STATE ===⁡
    const [username, setUsername] = useState('Guest');
    const [categories, setCategories] = useState([]);
    const [typewriterText, setTypewriterText] = useState('');

    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const currentUsername = user || 'Guest';

    const handleLogoutAction = async () => {
    try {

        // ⁡⁢⁣⁣Taktik Penyerangan ke Backend: Hancurkan Cookie Sesi di Server⁡
        const { data } = await apiFetch("/api/logout", {
            method: "GET",
            credentials: "include"
        });

        if (data.success) {
            console.log("Sesi di server berhasil dihancurkan.");
        } else {
            console.warn("Backend menolak atau sesi sudah kedaluwarsa terlebih dahulu.");
        }
    } catch (err) {
        // ⁡⁢⁣⁡⁢⁣⁣Tetap lanjutkan evakuasi frontend meskipun server sedang down/terjadi galat jaringan⁡
        console.error("Gagal menghubungi server untuk logout:", err);
    } finally {
        // ⁡⁢⁣⁣Pembersihan Total Pos Pertahanan Frontend⁡
        sessionStorage.clear(); //⁡⁢⁣⁢ Menghapus token atau status login sementara⁡
        localStorage.removeItem("user_data"); // ⁡⁢⁣⁢Jika ada data persisten yang Anda simpan di sini⁡

        // ⁡⁢⁣⁣Lempar user kembali ke halaman login⁡
        navigate("/login", { replace: true }); 
    }
};
    
    // ⁡⁣⁣⁢--- 𝗦𝗧𝗔𝗧𝗘 𝗪𝗜𝗗𝗚𝗘𝗧 𝗖𝗨𝗔𝗖𝗔 & 𝗞𝗨𝗧𝗜𝗣𝗔𝗡 ---⁡
    const [koordinatCuaca, setKoordinatCuaca] = useState('-6.28,106.71');
    const [infoCuaca, setInfoCuaca] = useState({ deg: '--°C', desc: 'Memuat Cuaca...', wind: '-- km/jam', humidity: '--%' });
    const [quote, setQuote] = useState({ text: 'Memuat Kutipan...', author: '' });
    
    // ⁡⁣⁣⁢--- 𝗦𝗧𝗔𝗧𝗘 𝗖𝗛𝗔𝗡𝗚𝗘𝗟𝗢𝗚 𝗔𝗗𝗔𝗣𝗧𝗜𝗙 ---⁡
    const daftarVersi = Object.keys(databaseChangelog); 
    const [versiTerpilih, setVersiTerpilih] = useState(daftarVersi[0] || 'v1.2.5');
    const [tabAktif, setTabAktif] = useState('updates');

    // ⁡⁣⁣⁢--- 𝗦𝗘𝗞𝗧𝗢𝗥 𝗘𝗙𝗙𝗘𝗖𝗧 (𝗟𝗢𝗚𝗜𝗞𝗔 𝗦𝗜𝗦𝗧𝗘𝗠) ---⁡
    useEffect(() => {
        // tunggu hasil auth check dari AuthContext sebelum mengambil kategori
        if (loading) return;

        if (user) {
            setUsername(user);
            apiFetch("/api/categories")
                .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
                .catch(err => console.error("Gagal memuat kategori:", err));
        } else {
            navigate("/login", { replace: true });
        }
    }, [loading, user, navigate]);

    // ⁡⁣⁣⁢--- 𝗔𝗡𝗜𝗠𝗔𝗦𝗜 𝗧𝗬𝗣𝗘𝗪𝗥𝗜𝗧𝗘𝗥 ---⁡
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        let i = 0;
        let teksTerakumulasi = ''; // ⁡⁢⁣⁢POS PERTAHANAN:⁡ ⁡⁢⁣⁣Mengunci teks lokal agar tidak bercampur dengan state usang⁡

        const resetTypewriter = window.setTimeout(() => {
            setTypewriterText('');
            setShowCursor(true);
        }, 0);

        // 💡 PERBAIKAN: Pastikan namaClean adalah String murni, bukan Object!
        const namaClean = typeof username === 'object' 
            ? (username?.username || username?.name || 'Guest') 
            : (username || 'Guest');

        const teksLengkap = namaClean === 'Guest'
            ? typewriterMessages.guest
            : `${namaClean}! ${typewriterMessages.user}`;

        const intervalKetik = setInterval(() => {
            if (i < teksLengkap.length) {
                // ⁡⁢⁣⁣Menambahkan karakter ke variabel lokal terlebih dahulu, baru masukkan ke state⁡
                teksTerakumulasi += teksLengkap.charAt(i); 
                setTypewriterText(teksTerakumulasi); // ⁡⁢⁣⁢Langsung timpa state tanpa menggunakan (prev)⁡
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

    // ⁡⁣⁣⁢--- 𝗪𝗜𝗗𝗚𝗘𝗧 𝗞𝗨𝗧𝗜𝗣𝗔𝗡 (𝗤𝗢𝗨𝗧𝗘) ---⁡
    useEffect(() => {
        const gantiKutipan = () => {
            // ⁡⁢⁣⁣Mengambil langsung dari databaseQuotes yang di-import⁡
            const acak = databaseQuotes[Math.floor(Math.random() * databaseQuotes.length)];
            setQuote(acak);
        };

        gantiKutipan(); // ⁡⁢⁣⁢Eksekusi awal⁡
        const intervalQuote = setInterval(gantiKutipan, 10000); // ⁡⁢⁣⁢Rotasi 10 detik⁡
        return () => clearInterval(intervalQuote);
    }, []);

    // ⁡⁢⁣⁣⁡⁣⁡⁣⁣⁢--- 𝗪𝗜𝗗𝗚𝗘𝗧 𝗔𝗣𝗜 𝗖𝗨𝗔𝗖𝗔 ---⁡
    useEffect(() => {
        const resetWeatherStatus = window.setTimeout(() => {
            setInfoCuaca(prev => ({ ...prev, desc: 'Memuat Cuaca...' }));
        }, 0);

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${koordinatCuaca.split(',')[0]}&longitude=${koordinatCuaca.split(',')[1]}&current_weather=true`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Weather API request failed');
                }
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
            }).catch(() => setInfoCuaca({ deg: '29°C', desc: 'Koneksi Terbatasi', wind: '12 km/jam', humidity: '80%' }));

        return () => {
            window.clearTimeout(resetWeatherStatus);
        };
    }, [koordinatCuaca]);

    // ⁡⁣⁣⁢=== 𝗜𝗡𝗧𝗘𝗥𝗙𝗔𝗖𝗘 𝗗𝗔𝗦𝗛𝗕𝗢𝗔𝗥𝗗 (𝗝𝗦𝗫) ===⁡
    return (
        <div className="main-content">
            <Navbar user={currentUsername} onLogout={handleLogoutAction} />

            {/* ⁡⁢⁣⁣𝗧𝗘𝗞𝗦 𝗠𝗘𝗦𝗜𝗡 𝗞𝗘𝗧𝗜𝗞⁡ */}
            <h1 className="typewriter-container" style={{ fontFamily: "'Courier New', Courier, monospace", fontStyle: 'italic', fontSize: '24px' }}>
                Hello, <span>{typewriterText}</span>
                {showCursor && <span className="typewriter-cursor">|</span>}
            </h1>

            {/* ⁡⁢⁣⁣𝗔𝗥𝗘𝗔 𝗦𝗧𝗥𝗨𝗞𝗧𝗨𝗥 𝗨𝗧𝗔𝗠𝗔 𝗪𝗜𝗗𝗚𝗘𝗧⁡ */}
            <div className="dashboard-widgets">
                
                {/* ⁡⁢⁣⁣𝗪𝗜𝗗𝗚𝗘𝗧 𝗞𝗨𝗧𝗜𝗣𝗔𝗡⁡ */}
                <div className="quote-widget">
                    <h2 className="quote-text">"{quote.text}"</h2>
                    <p className="quote-author">- {quote.author}</p>
                </div>

                {/* ⁡⁢⁣⁣𝗪𝗜𝗗𝗚𝗘𝗧 𝗖𝗨𝗔𝗖𝗔⁡ */}
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

                {/* ⁡⁢⁣⁣𝗪𝗜𝗗𝗚𝗘𝗧 𝗟𝗢𝗚 𝗣𝗘𝗠𝗕𝗔𝗥𝗨𝗔𝗡 (𝗖𝗛𝗔𝗡𝗚𝗘𝗟𝗢𝗚)⁡ */}
                <div className="changelog-container">
                    <div className="changelog-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="bi bi-journal-text" style={{ fontSize: '1.2rem', color: '#00f5d4' }}></i>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Log Pembaruan</h3>
                        </div>
                        <select className='version-badge' value={versiTerpilih} onChange={(e) => setVersiTerpilih(e.target.value)} style={{ background: 'rgba(0, 245, 212, 0.1)', color: '#00f5d4', fontSize: '0.75rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid rgba(0, 245, 212, 0.2)', cursor: 'pointer', width: '120px' }}>
                            {daftarVersi.map(versi => (
                                <option key={versi} value={versi} style={{ background: '#121212', color: '#fff' }}>
                                    {versi} {versi === daftarVersi[0] ? '(Terbaru)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="toggle-buttons-wrapper">
                        <button className={`toggle-nav-btn ${tabAktif === 'updates' ? 'active-state' : ''}`} onClick={() => setTabAktif('updates')} style={{borderRadius: '10px'}}>
                            Fitur Baru
                        </button>
                        <button className={`toggle-nav-btn ${tabAktif === 'fixes' ? 'active-state' : ''}`} onClick={() => setTabAktif('fixes')} style={{borderRadius: '10px'}}>
                            Perbaikan Bug
                        </button>
                    </div>

                    <div className={`content-display-box ${tabAktif === 'updates' ? 'border-updates' : 'border-fixes'}`}>
                        <div className="content-pane">
                            <ul className="changelog-list">
                                {databaseChangelog[versiTerpilih]?.[tabAktif]?.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="changelog-footer">
                        Diperbarui pada: {databaseChangelog[versiTerpilih]?.tanggal || '---'}
                    </div>
                </div>
            </div>

            {/* ⁡⁢⁣⁣𝗦𝗘𝗞𝗦𝗜 𝗞𝗔𝗧𝗘𝗚𝗢𝗥𝗜 𝗕𝗘𝗥𝗜𝗧𝗔⁡ */}
            <div className="outerFiture">
                <div style={{ borderTop: '2px solid rgba(255, 255, 255, 0.15)', margin: '0 auto 40px', width: '100%' }}></div>
                <p className="desc-category">Baca Berita Sesuai Kategori</p>
                <div className="mainFiture">
                    {categories.map((ctgr) => (
                        <div key={ctgr.id} className="fiture-box">
                            <Link to={`/artikel?category=${ctgr.id}`}>
                                <img src={`/images/${ctgr.gambar}`} alt={ctgr.nama} />
                                <h4>{ctgr.nama}</h4>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}