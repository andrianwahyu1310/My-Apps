import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../main/register.css";
import { showToast } from "../utils/toasted";
import { isValidUsername, isValidPassword } from "../utils/validator";
import API_URL, { apiFetch } from "../../src/config/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    // 🌟 Konsisten menggunakan satu state objek untuk semua jenis toast
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // Bersihkan eror lama setiap kali tombol ditekan

        // 🛡️ 1. Validasi Pertama: Pastikan form tidak kosong terlebih dahulu
        if (!username || !password) {
            showToast(setToast, "Formulir pendaftaran tidak boleh kosong!", "error");
            return;
        }

        if (!API_URL) {
            showToast(setToast, "Fitur registrasi hanya tersedia saat backend dijalankan.", "error");
            return;
        }

        // 🛡️ 2. Validasi Kedua: Periksa format username
        if (!isValidUsername(username)) {
            showToast(setToast, "Username tidak valid! Harus diawali huruf, alfanumerik, dan panjang 5-20 karakter.", "error");
            return;
        }

        // 🛡️ 3. Validasi Ketiga: Periksa kekuatan password
        if (!isValidPassword(password)) {
            showToast(setToast, "Password lemah! Wajib memiliki minimal 8 karakter yang terdiri dari huruf, angka, dan simbol khusus.", "error");
            return;
        }
        
        try {
            const { data } = await apiFetch("/api/register", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ username, password })
            });
            
            if (data.success) {
                // 🌟 Gunakan showToast untuk memberikan sinyal sukses yang adil
                showToast(setToast, "Akun berhasil dibuat! Silakan login...", "success", 2000);
                setTimeout(() => {
                    navigate("/login"); 
                }, 2000);
            } else {
                // Jika server menolak (misal: username sudah terpakai)
                showToast(setToast, data.message || "Pendaftaran ditolak oleh otoritas sistem.", "error");
            }
        } catch (err) {
            console.error(err);
    console.error("Nama:", err.name);
    console.error("Pesan:", err.message);
    console.error("Stack:", err.stack);
            console.error("Sistem Registrasi Terganggu:", err);
            showToast(setToast, err.message || "Gagal menghubungi server pendaftaran.", "error");
        }
    };

    return (
        <div className="auth-body-wrapper">
            {/* 🌟 Penyelarasan JSX untuk Toast Reaktif */}
                {toast.show && (
                    <div id="toast" className={`toast ${toast.type} toast-show`}>
                        {toast.message}
                    </div>
                )}
                
            <div className="box-form">
                <h2>Register</h2>
                
                {errorMsg && <div id="error-msg" className="alert-danger">{errorMsg}</div>}

                <form id="registerForm" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Buat username baru"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="current-username"
                    />
                    
                    <div className="password-wrapper">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Buat password aman"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <button 
                            type="button" 
                            id="toggleBtn" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    
                    <button id="subBtn" type="submit">Daftar Akun</button>
                </form>
                
                <p className="auth">Sudah punya akun? <Link to="/login">Login di sini</Link></p>
            </div>

            {/* 🌟 KOTAK WADAH PERINGATAN (Sesuai Cetak Biru CSS Anda) */}
            <div className="desc">
                <span>ⓘ</span>
                <p>Aplikasi ini merupakan proyek pengembangan dan demonstrasi. Semua data akun baru maupun aktivitas login di halaman ini hanya tersimpan di lingkungan simulasi lokal <strong>(sandbox)</strong> dan tidak terhubung dengan sistem atau basis data komersial mana pun. Silakan gunakan data fiktif untuk kenyamanan Anda.</p>
            </div>
        </div>
    );
}