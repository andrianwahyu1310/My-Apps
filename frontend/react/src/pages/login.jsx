import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toasted";
import "../../main/login.css";
import API_URL, { apiFetch } from "../../src/config/api";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    // 💡 PENGECEKAN SESSION OTOMATIS SAAT COMPONENT DI-MOUNT
    // Mencegah login ulang jika cookie session masih valid di backend
    useEffect(() => {
        const checkExistingSession = async () => {
            if (!API_URL) {
                setIsCheckingAuth(false);
                return;
            }

            try {
                const { data } = await apiFetch("/api/me", {
                    method: "GET",
                    credentials: "include"
                });

                if (data && data.success && data.user) {
                    if (setUser) setUser(data.user);
                    // Redirect langsung ke Dashboard jika sesi terdeteksi aktif
                    navigate("/", { replace: true });
                }
            } catch (err) {
                // Sesi tidak ditemukan/expired, izinkan user mengisi form login
                console.log("Belum ada sesi aktif:", err.message);
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkExistingSession();
    }, [navigate, setUser]);

    // Kirim Data ke Backend API
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            showToast(setToast, "Username dan password wajib diisi!", "error");
            return;
        }

        if (!API_URL) {
            showToast(setToast, "Fitur login hanya tersedia saat backend dijalankan.", "error");
            return;
        }

        try {
            const { data } = await apiFetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });

            if (data.success) {
                // Update global auth state
                if (setUser) setUser(data.user || null);

                showToast(setToast, "Login berhasil! Mengalihkan...", "success");

                // Jeda singkat agar browser menyelesaikan penyimpanan cookie cross-origin
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 700);
            } else {
                showToast(setToast, data.message || "Akses ditolak", "error");
            }
        } catch (err) {
            console.error("Sistem Autentikasi Terganggu:", err);
            showToast(setToast, err.message || "Gagal terhubung ke server.", "error");
        }
    };

    // TAMPILKAN LOADING SEDERHANA SAAT MENGECEK SESI
    if (isCheckingAuth) {
        return (
            <div className="auth-body-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff' }}>
                <p>Memeriksa sesi login...</p>
            </div>
        );
    }

    return (
        <div className="auth-body-wrapper">
            {/* RENDER ELEMENT TOAST */}
            {toast.show && (
                <div id="toast" className={`toast ${toast.type} toast-show`}>
                    {toast.message}
                </div>
            )}

            <div className="box-form">
                <h2>Login</h2>

                <form id="loginForm" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                    
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Masukkan password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button 
                            type="button" 
                            id="toggleBtn" 
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    
                    <button id="subBtn" type="submit">Kirim</button>
                </form>
                
                <p className="auth">Belum punya akun? <Link to="/register">Buat di sini</Link></p>
            </div>

            <div className="desc">
                <span>ⓘ</span>
                <p>Aplikasi ini merupakan proyek pengembangan dan demonstrasi. Semua data akun baru maupun aktivitas login di halaman ini hanya tersimpan di lingkungan simulasi lokal <strong>(sandbox)</strong> dan tidak terhubung dengan sistem atau basis data komersial mana pun. Silakan gunakan data fiktif untuk kenyamanan Anda.</p>
            </div>
        </div>
    );
}