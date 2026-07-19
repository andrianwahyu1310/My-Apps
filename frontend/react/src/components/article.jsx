import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../../main/article.css';
import API_URL from "../config/api";

export default function ArsipKategoriBerita() {
    // ⁡⁢⁣⁢𝗣𝗔𝗥𝗔𝗠𝗘𝗧𝗘𝗥 𝗤𝗨𝗘𝗥𝗬 𝗦𝗧𝗥𝗜𝗡𝗚 (?𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝘆=𝗼𝗹𝗮𝗵𝗿𝗮𝗴𝗮)⁡
    const [searchParams] = useSearchParams();
    const idKategori = searchParams.get('category'); 

    // ⁡⁢⁣⁣𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧 𝗦𝗧𝗔𝗧𝗘 𝗖𝗢𝗠𝗣𝗢𝗡𝗘𝗡𝗧⁡
    const [namaKategori, setNamaKategori] = useState('Berita'); 
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ⁡⁢⁣⁣𝗢𝗣𝗘𝗥𝗔𝗦𝗜 𝗣𝗘𝗡𝗔𝗥𝗜𝗞𝗔𝗡 𝗗𝗔𝗧𝗔 𝗞𝗔𝗧𝗘𝗚𝗢𝗥𝗜⁡
    useEffect(() => {
        const selesaiMemuat = () => {
            window.setTimeout(() => {
                setIsLoading(false);
            }, 0);
        };

        const ambilDataDariServer = async () => {
            try {
                if (!API_URL) {
                    alert("Fitur registrasi hanya tersedia saat backend dijalankan.");
                    return;
                }

                setIsLoading(true);

                const respon = await fetch(`http://localhost:3000/api/artikel/${idKategori}`);
                const data = await respon.json();

                if (data.success && data.articles) {
                    // ⁡⁢⁣⁣--- 𝗔𝗟𝗚𝗢𝗥𝗜𝗧𝗠𝗔 𝗦𝗛𝗨𝗙𝗙𝗟𝗘 𝗙𝗜𝗦𝗛𝗘𝗥-𝗬𝗔𝗧𝗘𝗦 ---⁡
                    let dataAcak = [...data.articles];
                    for (let i = dataAcak.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [dataAcak[i], dataAcak[j]] = [dataAcak[j], dataAcak[i]];
                    }
                    
                    setNamaKategori(data.namaKategori || idKategori);
                    setArticles(dataAcak);
                } else {
                    setArticles([]);
                    setNamaKategori(idKategori);
                }
            } catch (error) {
                console.error("Gagal terhubung ke server Express:", error);
                setArticles([]);
                setNamaKategori(idKategori || 'Tidak Diketahui');
            } finally {
                selesaiMemuat();
            }
        };

        if (idKategori) {
            ambilDataDariServer();
        } else {
            selesaiMemuat();
        }
    }, [idKategori]);

    // ⁡⁢⁣⁣𝗜𝗻𝘁𝗲𝗿𝗳𝗮𝗰𝗲 𝗧𝗿𝗮𝗻𝘀𝗶𝘀𝗶 𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗦𝗽𝗶𝗻𝗻𝗲𝗿⁡
    if (isLoading) {
        return (
            <div style={{ color: '#fff', textAlign: 'center', paddingTop: '100px' }}>
                <div className="spinner" style={{ 
                    border: '4px solid rgba(255,255,255,0.1)', 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    borderLeftColor: '#00f5d4', 
                    margin: '0 auto 15px',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: '#aaa' }}>Memuat Arsip Berita...</p>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <>
        <div className='body-arc'>
            {/* ⁡⁣⁣⁢𝗕𝗨𝗧𝗧𝗢𝗡 𝗕𝗔𝗖𝗞 𝗧𝗢 𝗗𝗔𝗦𝗛𝗕𝗢𝗔𝗥𝗗⁡ */}
            <Link to="/" className="btn-back">
                <i className="bi bi-arrow-left"></i> Kembali ke Dashboard
            </Link>
        </div>

            {/* ⁡⁣⁣⁢HEADER KATEGORI⁡ */}
            <h1 style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '15px', color: '#fff', margin: '0 30px 30px 30px' }}>
                Arsip Berita: <span style={{ color: '#00f5d4', textTransform: 'capitalize' }}>{namaKategori}</span>
            </h1>

            {/* ⁡⁣⁣⁢𝗗𝗢𝗖𝗞𝗜𝗡𝗚 𝗞𝗔𝗥𝗧𝗨 𝗕𝗘𝗥𝗜𝗧𝗔⁡ */}
            {articles.length > 0 ? (
                <div className="news-grid" id="news-grids">
                    {articles.map((art, index) => (
                        <article className="news-card" key={art.id || index}>
                            {/* ⁡⁢⁣⁢𝗚𝗮𝗺𝗯𝗮𝗿 𝗔𝗿𝘁𝗶𝗸𝗲𝗹 𝗱𝗲𝗻𝗴𝗮𝗻 𝗽𝗲𝗻𝗴𝗮𝗺𝗮𝗻 (𝗷𝗶𝗸𝗮 𝗽𝗮𝘁𝗵 𝗴𝗮𝗺𝗯𝗮𝗿 𝗲𝗿𝗿𝗼𝗿)⁡ */}
                            <img 
                                src={`/images/news/${art.gambar}`} 
                                alt={art.judul} 
                                className="news-img" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250?text=No+Image'; }}
                            />
                            
                            {/* ⁡⁢⁣⁣𝗞𝗼𝗻𝘁𝗲𝗻 𝗨𝘁𝗮𝗺𝗮 𝗞𝗮𝗿𝘁𝘂 𝗕𝗲𝗿𝗶𝘁𝗮⁡ */}
                            <div className="news-content">
                                <div className="news-date">
                                    <i className="bi bi-calendar3"></i> {art.tanggal}
                                </div>
                                <h2 className="news-title">{art.judul}</h2>
                                <p className="news-desc">{art.ringkasan}</p>
                                
                                <a 
                                    href={art.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn-read"
                                >
                                    Baca Selengkapnya <i className="bi bi-box-arrow-up-right" style={{ fontSize: '0.8rem', marginLeft: '4px' }}></i>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                /*⁡⁣⁣⁢ 𝗘𝗠𝗣𝗧𝗬 𝗦𝗧𝗔𝗧𝗘 𝗝𝗜𝗞𝗔 𝗕𝗘𝗥𝗜𝗧𝗔 𝗞𝗢𝗦𝗢𝗡𝗚⁡ */
                <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="bi bi-journal-x" style={{ fontSize: '3.5rem', color: '#ffc107', display: 'block', marginBottom: '15px' }}></i>
                    <h3 style={{ color: '#fff', marginBottom: '10px' }}>Belum Ada Berita Tersedia</h3>
                    <p style={{ color: '#aaa', margin: 0 }}>
                        Maaf, saat ini belum ada kiriman artikel untuk kategori <span style={{ color: '#00f5d4' }}>{namaKategori}</span>.
                    </p>
                </div>
            )}
        </>
    );
}