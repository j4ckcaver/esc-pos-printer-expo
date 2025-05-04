import { View, Text, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

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
});

export default FeatureItem;