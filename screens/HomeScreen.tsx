import type React from "react"
import { View, Text, StyleSheet, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import Button from "@/component/Button"

const HomeScreen = () => {
    const navigation = useNavigation()
    const { theme, toggleTheme, isDark } = useTheme()

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>Thermal Printer App</Text>
                    <Button
                        title=""
                        icon={<Feather name={isDark ? "sun" : "moon"} size={20} color={theme.text} />}
                        onPress={toggleTheme}
                        variant="outline"
                        style={styles.themeToggle}
                    />
                </View>

                <View style={[styles.heroContainer, { backgroundColor: theme.primary }]}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Print Anywhere</Text>
                        <Text style={styles.heroSubtitle}>Connect to thermal printers and create beautiful receipts with ease</Text>
                    </View>
                    <View style={styles.heroImageContainer}>
                        <Image source={{ uri: "/placeholder.svg?height=150&width=150" }} style={styles.heroImage} />
                    </View>
                </View>

                <View style={styles.featuresContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>

                    <View style={styles.features}>
                        <FeatureItem
                            icon="search"
                            title="Discover Printers"
                            description="Find and connect to nearby thermal printers"
                            theme={theme}
                        />
                        <FeatureItem
                            icon="printer"
                            title="Print Documents"
                            description="Create and print receipts, labels and more"
                            theme={theme}
                        />
                        <FeatureItem
                            icon="settings"
                            title="Printer Settings"
                            description="Configure printer settings and preferences"
                            theme={theme}
                        />
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <Button
                        title="Find Printers"
                        onPress={() => navigation.navigate("PrinterSearch" as never)}
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

interface FeatureItemProps {
    icon: keyof typeof Feather.glyphMap
    title: string
    description: string
    theme: any
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, theme }) => {
    return (
        <View style={[styles.featureItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={[styles.featureIconContainer, { backgroundColor: theme.primary + "15" }]}>
                <Feather name={icon} size={24} color={theme.primary} />
            </View>
            <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.featureDescription, { color: theme.text + "99" }]}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    themeToggle: {
        paddingHorizontal: 12,
        minWidth: 0,
    },
    heroContainer: {
        flexDirection: "row",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 24,
        padding: 20,
    },
    heroContent: {
        flex: 1,
        justifyContent: "center",
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: "#FFFFFF",
        opacity: 0.9,
    },
    heroImageContainer: {
        width: 120,
        alignItems: "center",
        justifyContent: "center",
    },
    heroImage: {
        width: 120,
        height: 120,
    },
    featuresContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
    },
    features: {
        flexDirection: "column",
        gap: 16,
    },
    featureItem: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    featureIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },
    featureDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
    },
})

export default HomeScreen
