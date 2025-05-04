"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

interface PrinterItemProps {
    printer: {
        id: string
        name: string
        address: string
        connected: boolean
    }
    onPress: () => void
}

const PrinterItem: React.FC<PrinterItemProps> = ({ printer, onPress }) => {
    const { theme } = useTheme()

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <Feather name="printer" size={24} color={printer.connected ? theme.success : theme.primary} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={[styles.name, { color: theme.text }]}>{printer.name}</Text>
                <Text style={[styles.address, { color: theme.text + "99" }]}>{printer.address}</Text>
            </View>
            <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: printer.connected ? theme.success : theme.border }]} />
                <Text style={[styles.statusText, { color: printer.connected ? theme.success : theme.text + "99" }]}>
                    {printer.connected ? "Connected" : "Disconnected"}
                </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.text + "66"} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    address: {
        fontSize: 14,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "500",
    },
})

export default PrinterItem
