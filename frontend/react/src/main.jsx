import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Mengarah ke berkas App.jsx Anda
import { ThemeProvider } from './components/theme'; // Pembungkus Tema Global Anda
import '../main/base/theme.css';
import './index.css';

// 🌟 PERTAHANAN KONSOL: Blokir pesan promosi React DevTools secara adil
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalLog = console.log;
  console.log = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("Download the React DevTools")) {
      return; // Abaikan dan jangan cetak log ini ke konsol browser
    }
    originalLog(...args);
  };
}

// 🌟 GERBANG UTAMA MERENDER APLIKASI DAN MENYUNTIKKAN TEMA GLOBAL
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);