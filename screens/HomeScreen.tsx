import type React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "@/context/ThemeContext"
import Button from "@/component/Button"
import FeatureItem from "@/component/home/FeatureItem"

const HomeScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.heroContainer, { backgroundColor: theme.primary }]}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>
                            Print Anywhere
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            Connect to thermal printers and create beautiful receipts with ease
                        </Text>
                    </View>
                </View>

                <View style={styles.featuresContainer}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Features
                    </Text>

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
};

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
    featuresContainer: {
        marginBottom: 24,
    },
    features: {
        flexDirection: "column",
        gap: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
    },
})

export default HomeScreen
