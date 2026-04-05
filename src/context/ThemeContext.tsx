import { createContext } from "react";

export type ThemeType = 'light' | 'dark';

interface ThemeContextType {
    theme: ThemeType,
    setTheme: (value: ThemeType) => void,
}

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => {},
})