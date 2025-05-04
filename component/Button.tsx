import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, type ViewStyle, type TextStyle, } from "react-native"
import { useTheme } from "@/context/ThemeContext"

interface ButtonProps {
    title: string
    onPress: () => void
    variant?: "primary" | "secondary" | "outline"
    loading?: boolean
    disabled?: boolean
    style?: ViewStyle
    textStyle?: TextStyle
    icon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",
    loading = false,
    disabled = false,
    style,
    textStyle,
    icon,
}) => {
    const { theme } = useTheme()

    const getBackgroundColor = () => {
        if (disabled) return theme.border
        switch (variant) {
            case "primary":
                return theme.primary
            case "secondary":
                return theme.secondary
            case "outline":
                return "transparent"
            default:
                return theme.primary
        }
    }

    const getTextColor = () => {
        if (disabled) return theme.text + "66"
        switch (variant) {
            case "primary":
            case "secondary":
                return "#FFFFFF"
            case "outline":
                return theme.primary
            default:
                return "#FFFFFF"
        }
    }

    const getBorderColor = () => {
        if (disabled) return theme.border
        switch (variant) {
            case "outline":
                return theme.primary
            default:
                return "transparent"
        }
    }

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                    borderWidth: variant === "outline" ? 2 : 0,
                },
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} size="small" />
            ) : (
                <>
                    {icon && <View style={styles.iconContainer}>{icon}</View>}
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 120,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    disabled: {
        opacity: 0.7,
    },
    iconContainer: {
        marginRight: 8,
    },
})

export default Button
