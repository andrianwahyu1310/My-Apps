import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return 'dark';
        return window.localStorage.getItem('app-theme') || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
        if (document.body) {
            document.body.setAttribute('data-theme', theme);
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-theme', theme);
        }
    }, [theme]);

    const ubahTema = (temaBaru) => {
        setTheme(temaBaru);
    };

    return (
        <ThemeContext.Provider value={{ theme, ubahTema }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}