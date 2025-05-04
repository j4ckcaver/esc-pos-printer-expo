import { TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext"
import { Feather } from "@expo/vector-icons"

const ThemeToggleButton = () => {
    const { toggleTheme, isDark } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={{
                padding: 8,
                marginRight: 8,
            }}
        >
            <Feather
                name={isDark ? "sun" : "moon"}
                size={22} color="#fff"
            />
        </TouchableOpacity>
    )
}

export default ThemeToggleButton