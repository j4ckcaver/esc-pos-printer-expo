import type React from "react"
import { createContext, useContext, useState } from "react"

// Define theme colors
export const lightTheme = {
    primary: "#6366F1", // Indigo
    secondary: "#8B5CF6", // Purple
    background: "#F9FAFB",
    card: "#FFFFFF",
    text: "#1F2937",
    border: "#E5E7EB",
    notification: "#EF4444",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
}

export const darkTheme = {
    primary: "#818CF8", // Lighter Indigo for dark mode
    secondary: "#A78BFA", // Lighter Purple for dark mode
    background: "#111827",
    card: "#1F2937",
    text: "#F9FAFB",
    border: "#374151",
    notification: "#F87171",
    success: "#34D399",
    warning: "#FBBF24",
    info: "#60A5FA",
}

type Theme = typeof lightTheme

interface ThemeContextType {
    theme: Theme
    isDark: boolean
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => { },
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDark, setIsDark] = useState(false)
    const theme = isDark ? darkTheme : lightTheme

    const toggleTheme = () => {
        setIsDark(!isDark)
    }

    return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}
