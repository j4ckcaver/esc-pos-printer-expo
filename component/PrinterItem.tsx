import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import type { AppPrinterInfo } from "@/types/printer"

interface PrinterItemProps {
    printer: AppPrinterInfo;
    onPress: () => void;
}

const PrinterItem: React.FC<PrinterItemProps> = ({ printer, onPress }) => {
    const { theme } = useTheme();
    const normalizedTarget = printer?.target ? printer.target.toLowerCase() : "";
    const derivedConnection = Boolean(normalizedTarget.startsWith("bt:") || printer?.bdAddress) ? "bluetooth" : "network";
    const connectionHint = printer.connectionHint ?? derivedConnection;
    const isBluetooth = connectionHint === "bluetooth";
    const connectionLabel = isBluetooth ? "Bluetooth" : "Network";
    const secondaryIdentifier = isBluetooth
        ? printer?.macAddress || printer?.bdAddress || printer?.target
        : printer?.ipAddress || printer?.target;

    return (
        <TouchableOpacity
            style={[styles.container, {
                backgroundColor: theme.card,
                borderColor: theme.border
            }]}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <Feather
                    name={isBluetooth ? "bluetooth" : "wifi"}
                    size={24}
                    color={theme.primary}
                />
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                    <Text style={[styles.name, { color: theme.text }]}>
                        {printer?.deviceName || "Printer"}
                    </Text>
                    <View style={[styles.typeBadge, { backgroundColor: theme.primary + "12" }]}>
                        <Text style={[styles.typeBadgeText, { color: theme.primary }]}>
                            {connectionLabel}
                        </Text>
                    </View>
                    {printer.isTest && (
                        <View style={[styles.testBadge, { backgroundColor: theme.info + "20" }]}>
                            <Text style={[styles.testBadgeText, { color: theme.info }]}>
                                Test
                            </Text>
                        </View>
                    )}
                </View>
                {!!secondaryIdentifier && (
                    <Text style={[styles.address, { color: theme.text + "99" }]}>
                        {secondaryIdentifier}
                    </Text>
                )}
                {printer.pin && (
                    <Text style={[styles.metaText, { color: theme.text + "66" }]}>
                        PIN: {printer.pin}
                    </Text>
                )}
                {printer.notes && (
                    <Text style={[styles.metaText, { color: theme.text + "66" }]}>
                        {printer.notes}
                    </Text>
                )}
            </View>

            {/* <View style={styles.statusContainer}>
                <View style={[styles.statusIndicator, { backgroundColor: printer.target ? theme.success : theme.border }]} />
                <Text style={[styles.statusText, { color: printer.target ? theme.success : theme.text + "99" }]}>
                    {printer.target ? "Connected" : "Disconnected"}
                </Text>
            </View> */}

            <Feather
                name="chevron-right"
                size={20}
                color={theme.text + "66"}
            />
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
    titleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    typeBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    testBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    testBadgeText: {
        fontSize: 12,
        fontWeight: "600",
    },
    address: {
        fontSize: 14,
    },
    metaText: {
        fontSize: 13,
        marginTop: 4,
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
