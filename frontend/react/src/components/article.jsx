import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../../main/article.css';
import { apiFetch } from "../config/api";

export default function ArsipKategoriBerita() {
    // PARAMETER QUERY STRING (?category=olahraga)
    const [searchParams] = useSearchParams();
    const idKategori = searchParams.get('category'); 

    // LIMIT BATCH PER PAGE
    const LIMIT_PER_PAGE = 8;

    // MANAGEMENT STATE COMPONENT
    const [namaKategori, setNamaKategori] = useState('Berita'); 
    const [displayedArticles, setDisplayedArticles] = useState([]); // Artikel yang telah dimuat
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Ref untuk elemen penanda scroll paling bawah (Sentinel)
    const observerTarget = useRef(null);

    // GAMBAR FALLBACK LOKAL (SVG Data URI)
    const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16' font-family='sans-serif'>Gambar Tidak Tersedia</text></svg>";

    // 1. PENARIKAN DATA AWAL (Saat kategori berubah)
    useEffect(() => {
        const fetchInitialArticles = async () => {
            try {
                setIsLoading(true);
                setPage(1);
                setDisplayedArticles([]);

                // Request ke Express dengan parameter page=1 & limit=8
                const { data } = await apiFetch(`/api/artikel/${idKategori}?page=1&limit=${LIMIT_PER_PAGE}`);

                if (data.success && data.articles) {
                    setNamaKategori(data.namaKategori || idKategori);
                    setDisplayedArticles(data.articles);
                    setHasMore(data.pagination ? data.pagination.hasMore : false);
                } else {
                    setDisplayedArticles([]);
                    setNamaKategori(idKategori);
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Gagal terhubung ke server Express:", error);
                setDisplayedArticles([]);
                setNamaKategori(idKategori || 'Tidak Diketahui');
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        if (idKategori) {
            fetchInitialArticles();
        } else {
            setIsLoading(false);
        }
    }, [idKategori]);

    // 2. FUNGSI MEMUAT HALAMAN BERIKUTNYA DARI SERVER
    const loadMoreArticles = useCallback(async () => {
        if (isFetchingMore || !hasMore || isLoading) return;

        setIsFetchingMore(true);
        const nextPage = page + 1;

        try {
            // Ambil halaman berikutnya dari backend
            const { data } = await apiFetch(`/api/artikel/${idKategori}?page=${nextPage}&limit=${LIMIT_PER_PAGE}`);

            if (data.success && data.articles.length > 0) {
                setDisplayedArticles(prev => [...prev, ...data.articles]);
                setPage(nextPage);
                setHasMore(data.pagination ? data.pagination.hasMore : false);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Gagal memuat artikel tambahan:", error);
            setHasMore(false);
        } finally {
            setIsFetchingMore(false);
        }
    }, [isFetchingMore, hasMore, isLoading, page, idKategori]);

    // 3. OBSERVER SCROLL (IntersectionObserver)
    useEffect(() => {
        const target = observerTarget.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading && !isFetchingMore) {
                    loadMoreArticles();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [loadMoreArticles, hasMore, isLoading, isFetchingMore]);

    // INTERFACE LOADING SPINNER UTAMA
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
                {/* BUTTON BACK TO DASHBOARD */}
                <Link to="/" className="btn-back">
                    <i className="bi bi-arrow-left"></i> Kembali
                </Link>
            </div>

            {/* HEADER KATEGORI */}
            <h1 className='headers-arct' >
                Arsip Berita: <span style={{ color: '#00f5d4', textTransform: 'capitalize' }}>{namaKategori}</span>
            </h1>

            {/* DOCKING KARTU BERITA */}
            {displayedArticles.length > 0 ? (
                <>
                    <div className="news-grid" id="news-grids">
                        {displayedArticles.map((art, index) => (
                            <article className="news-card" key={art.id || index}>
                                {/* Gambar Artikel dengan pengaman SVG lokal */}
                                <img 
                                    src={`./assets/images/news/${art.gambar}`}
                                    alt={art.judul || "Berita"} 
                                    className="news-img" 
                                    onError={(e) => { 
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGE; 
                                    }}
                                />
                                
                                {/* Konten Utama Kartu Berita */}
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

                    {/* ELEMEN OBSERVER TARGET (Sinyal Auto Load saat Dilihat) */}
                    <div ref={observerTarget} style={{ height: '50px', margin: '20px 0', textAlign: 'center' }}>
                        {isFetchingMore && (
                            <div style={{ color: '#00f5d4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <div className="spinner-sm" style={{
                                    border: '3px solid rgba(255,255,255,0.1)',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    borderLeftColor: '#00f5d4',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Memuat berita lainnya...</span>
                            </div>
                        )}
                        {!hasMore && displayedArticles.length > 0 && (
                            <p style={{ color: '#666', fontSize: '0.85rem' }}>Semua artikel telah ditampilkan.</p>
                        )}
                    </div>
                </>
            ) : (
                /* EMPTY STATE JIKA BERITA KOSONG */
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