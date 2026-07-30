import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../utils/toasted';
import { apiFetch } from "../../src/config/api";
import { AuthContext } from '../contexts/AuthContext';
import '/main/base/global-tools.css';

export default function Contact() {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    
    const { user, loading } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sendVia, setSendVia] = useState("whatsapp"); // Default kirim via WhatsApp
    const [screenshot, setScreenshot] = useState(null); // Menyimpan file gambar dari perangkat
    const [previewUrl, setPreviewUrl] = useState(null); // Untuk menampilkan preview gambar di form
    const [isSubmitting, setIsSubmitting] = useState(false);

    const NOMOR_WA = "6281585760151";
    // 💡 Tautan URL ke GitHub yang ditambahkan
    const GITHUB_URL = "https://github.com/andrianwahyu1310/My-Apps"; 

    useEffect(() => {
        if (loading) return;

        if (user) {
            const namaUser = typeof user === 'object' ? user.username : user;
            setUsername(namaUser || "");
        } else {
            showToast(setToast, "Silakan login terlebih dahulu untuk mengakses pengaduan.", "error");
            navigate('/login', { replace: true });
        }
    }, [loading, user, navigate]);

    // Membersihkan URL objek untuk mencegah kebocoran memori (memory leak)
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Handler ketika user memilih file gambar dari perangkat
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showToast(setToast, "Ukuran gambar terlalu besar! Maksimal adalah 5MB.", "warning");
                return;
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setScreenshot(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleKirimPengaduan = async (e) => {
        e.preventDefault();

        if (!subject || !message.trim()) {
            showToast(setToast, "Harap isi seluruh kolom kategori dan detail kendala!", "warning");
            return;
        }

        const mapSubjek = {
            bug: "🐛 Laporan Masalah Sistem (Bug)",
            buku: "💡 Usulan Fitur Baru",
            akun: "🔐 Kendala Akun & Keanggotaan",
            lainnya: "📁 Lainnya"
        };
        const teksSubjek = mapSubjek[subject] || subject;

        // JALUR 1: EMAIL
        if (sendVia === "email") {
            try {
                setIsSubmitting(true);
                showToast(setToast, "Sedang mengirimkan laporan ke email pengembang...", "info");

                const formData = new FormData();
                formData.append('username', username);
                formData.append('subject', subject);
                formData.append('message', message);
                formData.append('sendVia', sendVia);
                if (screenshot) {
                    formData.append('screenshot', screenshot);
                }

                const { data: hasil } = await apiFetch('/api/contact/report', {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (hasil.success) {
                    showToast(setToast, hasil.message, "success", 5000);
                    setMessage("");
                    setSubject("");
                    setScreenshot(null);
                    setPreviewUrl(null);
                } else {
                    showToast(setToast, hasil.message || "Gagal mengirim email.", "error");
                }
            } catch (err) {
                console.error("Error submit email:", err);
                showToast(setToast, "Terjadi kesalahan jaringan saat menghubungi server.", "error");
            } finally {
                setIsSubmitting(false);
            }
        } 
        // JALUR 2: WHATSAPP
        else {
            let infoGambarText = screenshot ? `\n🖼️ _[User melampirkan berkas gambar: ${screenshot.name}]_` : "";
            
            const formatPesan = `*PENGADUAN LAYANAN SISTEM*\n` +
                                `-----------------------------------------\n` +
                                `👤 *Nama Pengguna:* ${username}\n` +
                                `📌 *Kategori:* ${teksSubjek}\n` +
                                `💬 *Isi Detail Kendala:*\n${message}\n` +
                                `-----------------------------------------${infoGambarText}\n` +
                                `_Dikirim via Aplikasi React SPA Pengaduan._`;

            const urlWhatsApp = `https://api.whatsapp.com/send?phone=${NOMOR_WA}&text=${encodeURIComponent(formatPesan)}`;
            
            showToast(setToast, "Mengalihkan ke WhatsApp Anda...", "success");
            window.open(urlWhatsApp, '_blank');
            
            if (screenshot) {
                showToast(setToast, "Catatan: Silakan lampirkan gambar Anda manual di obrolan WA.", "info");
            }
        }
    };

    if (loading) {
        return (
            <div className="main-content" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <p style={{ color: 'var(--text-color)' }}>Mempersiapkan Lembar Pengaduan...</p>
            </div>
        );
    }

    return (
        <main className="contact-wrapper" style={{ padding: '40px 50px', boxSizing: 'border-box' }}>
            {toast.show && (
                <div id="toast" className={`toast ${toast.type} toast-show`}>
                    {toast.message}
                </div>
            )}

            <Link to="/" className="btn-back">
                <i className="bi bi-arrow-left"></i> Kembali
            </Link>
                
            <div className="card-contact" style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)', backdropFilter: 'blur(4px)' }}>
                <h2 className='headers-contact' style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>Hubungi Layanan Pengaduan</h2>
                <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '15px' }}>
                    Silakan kirimkan kritik, bug, atau saran secara nyata langsung ke hadapan pengembang.
                </p>

                {/* SEKSI TAMBAHAN: LINK KE GITHUB */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                    <i className="bi bi-github" style={{ fontSize: '1.2rem' }}></i>
                    <a 
                        href={GITHUB_URL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#00f5d4', textDecoration: 'none', fontWeight: '500' }}
                    >
                        Lihat Repository GitHub &rarr;
                    </a>
                </div>

                <hr style={{ opacity: 0.15, margin: '15px 0', border: 'none', height: '1px', backgroundColor: 'var(--text-color)' }} />

                <form onSubmit={handleKirimPengaduan}>
                    {/* INPUT 1: USERNAME */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nama Pengguna</label>
                        <input 
                            type="text" 
                            value={typeof username === 'object' ? username?.username : username} 
                            readOnly 
                            className="input-readonly" 
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                border: '1px solid var(--card-border)', 
                                background: 'rgba(0, 0, 0, 0.15)', 
                                color: 'var(--text-color)', 
                                opacity: 0.7, 
                                cursor: 'not-allowed' 
                            }} 
                        />
                    </div>

                    {/* INPUT 2: METODE PENGIRIMAN */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Saluran Pengiriman Pesan</label>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <label className='label-message-dev' style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="via" value="whatsapp" checked={sendVia === "whatsapp"} onChange={() => setSendVia("whatsapp")} /> 
                                WhatsApp
                            </label>
                            <label className='label-message-dev' style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="via" value="email" checked={sendVia === "email"} onChange={() => setSendVia("email")} /> 
                                Email
                            </label>
                        </div>
                    </div>

                    {/* INPUT 3: KATEGORI SUBJEK */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Kategori Masalah</label>
                        <select value={subject} onChange={(e) => setSubject(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'var(--bg-color, #1e1e1e)', color: 'var(--text-color)' }}>
                            <option value="" disabled>-- Pilih Kategori Kendala --</option>
                            <option value="bug">Laporan Masalah Sistem (Bug)</option>
                            <option value="buku">Usulan Fitur Baru</option>
                            <option value="akun">Kendala Akun & Keanggotaan</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    {/* INPUT 4: TEXTAREA DETAIL */}
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Isi Pesan / Detail Kendala</label>
                        <textarea rows="5" placeholder="Ketikkan pesan Anda dengan sejelas-jelasnya di sini..." value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'var(--bg-color, #1e1e1e)', color: 'var(--text-color)', resize: 'vertical' }}></textarea>
                    </div>

                    {/* INPUT 5: UNGGAH BERKAS SCREENSHOT GAMBAR BUG */}
                    <div className="form-group" style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Lampiran Gambar Bukti Bug (Opsional)</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: 'var(--text-color)', cursor: 'pointer' }} />
                        
                        {previewUrl && (
                            <div style={{ marginTop: '15px', border: '1px dashed var(--card-border)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.85rem', margin: '0 0 10px 0', opacity: 0.7 }}>Pratinjau Gambar:</p>
                                <img src={previewUrl} alt="Preview Bug" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '6px', objectFit: 'contain' }} />
                            </div>
                        )}
                    </div>

                    {/* TOMBOL AKSI SUBMIT */}
                    <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: isSubmitting ? '#555' : '#00f5d4', color: '#0f172a', fontSize: '1rem', fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(0, 245, 212, 0.2)', transition: 'all 0.2s ease' }}>
                        {isSubmitting ? "Sedang Memproses Pengiriman..." : sendVia === "email" ? "Kirim Laporan ke Email" : "Kirim Pesan via WhatsApp"}
                    </button>
                </form>
            </div>
        </main>
    );
}