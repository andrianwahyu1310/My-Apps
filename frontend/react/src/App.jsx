// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import toolsData from '../../../backend/data/tools.json';
import dataBrainAktif from '../../../backend/data/brainTeaser.json'

// ⁡⁣⁢⁣IMPOR KOMPONEN HALAMAN UTAMA⁡
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Register from "./pages/register";
import DetailAkun from "./pages/detail";
import Contact from './pages/contact';
import About from './pages/about';
import Tools from './pages/mainTools';
import ArsipKategoriBerita from './components/article';
import ContainerBrain from './components/container-brain-teaser';
import Theme from './components/setTheme';

// ⁡⁣⁢⁣IMPOR MODUL ALAT PERHITUNGAN (TOOLS)⁡
import Calc from './pages/tools/kalkulator';
import CalcHeavy from './pages/tools/konversi_berat';
import CalcDistance from './pages/tools/konversi_jarak';
import CalcDigital from './pages/tools/konversi_digital';
import CalcWide from './pages/tools/konversi_luas';
import CaclClock from './pages/tools/konversi_waktu';
import CalcVolCubic from './pages/tools/konversi_volumeKubik';
import CalcPressure from './pages/tools/konversi_tekanan';
import CalcSpeed from './pages/tools/konversi_kecepatan';
import CalcListrik from './pages/tools/kalkulatorListrik';
import CalcTemperatur from './pages/tools/konversi_suhu';
import CalcMoney from './pages/tools/konversi_mataUang';
import CalcLiter from './pages/tools/konversi_volumeLiter';

import Quiz from './pages/games/kuis';

import "./App.css";

export default function App() {
  // ⁡⁢⁣⁣Peta komponen untuk mencocokkan URL di JSON dengan Komponen React asli⁡
  const komponenAlat = {
    "/tools/kalkulator": <Calc />,
    "/tools/konversi_berat": <CalcHeavy />,
    "/tools/konversi_jarak": <CalcDistance />,
    "/tools/konversi_digital": <CalcDigital />,
    "/tools/konversi_luas": <CalcWide />,
    "/tools/konversi_waktu": <CaclClock />,
    "/tools/konversi_volumeKubik": <CalcVolCubic />,
    "/tools/konversi_tekanan": <CalcPressure />,
    "/tools/konversi_kecepatan": <CalcSpeed />,
    "/tools/kalkulatorListrik": <CalcListrik />,
    "/tools/konversi_suhu": <CalcTemperatur />,
    "/tools/konversi_mataUang": <CalcMoney />,
    "/tools/konversi_volumeLiter": <CalcLiter />
  };

  const komponenBrain = {
    "/games/kuis": <Quiz />
  }

  return (
    <Router basename="/My-Apps">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/detail" element={<DetailAkun />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/mainTools" element={<Tools />} />
          <Route path="/container-brain-teaser" element={<ContainerBrain />} />
          <Route path="/setTheme" element={<Theme />} />

          {/* ⁡⁣⁢⁣REGISTRASI OTOMATIS BERDASARKAN DATA JSON (HANYA UNTUK MODUL ALAT)⁡ */}
          {toolsData.map((alat) => (
            <Route 
              key={alat.id} 
              path={alat.url} 
              element={komponenAlat[alat.url] || (
                <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
                  Halaman sedang dalam perbaikan.
                </div>
              )} 
            />
          ))}

          {dataBrainAktif.map((brain) => (
            <Route 
              key={brain.id} 
              path={brain.url} 
              element={komponenBrain[brain.url] || (
                <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
                  Halaman sedang dalam perbaikan.
                </div>
              )} 
            />
          ))}
          
          {/* ⁡⁢⁣⁣Jalur ArsipKategoriBerita⁡ */}
          <Route path="/artikel" element={<ArsipKategoriBerita />} />
          
          {/* ⁡⁢⁣⁣Jalur Proteksi 404⁡ */}
          <Route path="*" element={
            <div style={{ textAlign: "center", marginTop: "50px", color: "#fff" }}>
              <h2>[404] Jalur Tidak Ditemukan.</h2>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}