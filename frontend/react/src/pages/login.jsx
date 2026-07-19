import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../utils/toasted";
import "../../main/login.css";
import API_URL from "../../src/config/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [errorMsg, setErrorMsg] = useState("");
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    
    const navigate = useNavigate();

    // ⁡⁣⁣⁢𝗞𝗶𝗿𝗶𝗺 𝗗𝗮𝘁𝗮 𝗸𝗲 𝗕𝗮𝗰𝗸𝗲𝗻𝗱 𝗔𝗣𝗜⁡
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setErrorMsg(""); 

        if (!API_URL) {
            alert("Fitur registrasi hanya tersedia saat backend dijalankan.");
            return;
        }

        if (!username || !password) {
            showToast(setToast, "Username dan password wajib diisi!", "error");
            setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showToast(setToast, "Login berhasil! Mengalihkan...", "success");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                showToast(setToast, "Akses ditolak", "error");
            }
        } catch (err) {
            console.error("Sistem Autentikasi Terganggu:", err);
            showToast(setToast, "Gagal terhubung.", "error");
        }
    };

    return (
        <div className="auth-body-wrapper"> {/* ⁡⁢⁣⁢𝙋𝙚𝙣𝙟𝙖𝙜𝙖 𝙡𝙖𝙮𝙤𝙪𝙩 𝙖𝙜𝙖𝙧 𝙩𝙚𝙧𝙞𝙨𝙤𝙡𝙖𝙨𝙞 ⁡*/}
        {/* ⁡⁢⁣⁣𝗥𝗘𝗡𝗗𝗘𝗥 𝗘𝗟𝗘𝗠𝗘𝗡𝗧 𝗧𝗢𝗔𝗦𝗧⁡ */}
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
                        autoComplete="current-username"
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