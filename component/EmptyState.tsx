import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import Button from "./Button"

interface EmptyStateProps {
    icon: keyof typeof Feather.glyphMap
    title: string
    description: string
    buttonTitle?: string
    onButtonPress?: () => void
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, buttonTitle, onButtonPress }) => {
    const { theme } = useTheme()

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + "15" }]}>
                <Feather name={icon} size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.description, { color: theme.text + "99" }]}>{description}</Text>
            {buttonTitle && onButtonPress && <Button title={buttonTitle} onPress={onButtonPress} style={styles.button} />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        maxWidth: 300,
    },
    button: {
        minWidth: 200,
    },
})

export default EmptyState
