import { TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext"
import { Feather } from "@expo/vector-icons"

const ThemeToggleButton = () => {
    const { toggleTheme, isDark } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center"
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