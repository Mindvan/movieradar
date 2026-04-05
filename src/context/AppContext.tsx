import { useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeType } from './ThemeContext';

const KEY_THEME = 'theme'

function defaultThemeValue() {
    if (window === undefined) return 'light';
    const res = localStorage.getItem(KEY_THEME);

    return res === 'dark' ? 'dark' : 'light';
}

const AppContext = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState<ThemeType>(defaultThemeValue);

    // const toggleTheme = useCallback(() => {
    //     setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    // }, [])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

export default AppContext;