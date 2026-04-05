import { useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeType } from './ThemeContext';
import { ConfigProvider, theme as antdTheme } from 'antd';

const KEY_THEME = 'theme'

function defaultThemeValue() {
    if (window === undefined) return 'light';
    const res = localStorage.getItem(KEY_THEME);

    return res === 'dark' ? 'dark' : 'light';
}

const AppContext = ({children}: {children: ReactNode}) => {
    const [theme, setTheme] = useState<ThemeType>(defaultThemeValue);
    const { darkAlgorithm, defaultAlgorithm } = antdTheme;

    // const toggleTheme = useCallback(() => {
    //     setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    // }, [])

    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <ConfigProvider 
                theme={{
                algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
            }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export default AppContext;