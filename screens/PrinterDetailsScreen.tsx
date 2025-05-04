"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import Button from "@/component/Button"
import type { StackNavigation } from "@/navigators/RootNavigator"

const PrinterDetailsScreen = () => {
    const navigation = useNavigation<StackNavigation>();
    const route = useRoute()
    const { theme } = useTheme()
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [printerInfo, setPrinterInfo] = useState<any>({})

    // Get printer from route params
    useEffect(() => {
        if (route.params && (route.params as any).printer) {
            setPrinterInfo((route.params as any).printer)
        }
    }, [route.params])

    const connectToPrinter = () => {
        setIsConnecting(true)

        // Simulate connection
        setTimeout(() => {
            setIsConnected(true)
            setIsConnecting(false)

            // Update printer info
            setPrinterInfo((prev:any) => ({
                ...prev,
                connected: true,
                status: "Ready",
                paperWidth: "80mm",
                dpi: "203 dpi",
                firmware: "v1.2.3",
            }))
        }, 1500)

        // In a real app, you would use the react-native-esc-pos-printer SDK:
        // try {
        //   await EscPosPrinter.connect(printerInfo.address);
        //   const status = await EscPosPrinter.getStatus();
        //   setPrinterInfo(prev => ({
        //     ...prev,
        //     connected: true,
        //     status: status.ready ? 'Ready' : 'Error',
        //     paperWidth: status.paperWidth,
        //     dpi: status.dpi,
        //     firmware: status.firmware,
        //   }));
        // } catch (error) {
        //   Alert.alert('Connection Error', 'Failed to connect to printer');
        // } finally {
        //   setIsConnecting(false);
        // }
    }

    const disconnectPrinter = () => {
        // Simulate disconnection
        setIsConnected(false)
        setPrinterInfo((prev:any) => ({
            ...prev,
            connected: false,
        }))

        // In a real app:
        // await EscPosPrinter.disconnect();
    }

    const navigateToPrint = () => {
        navigation.navigate("Print", { printer: printerInfo })
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.printerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.printerHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.primary + "15" }]}>
                            <Feather name="printer" size={32} color={theme.primary} />
                        </View>
                        <View style={styles.printerInfo}>
                            <Text style={[styles.printerName, { color: theme.text }]}>{printerInfo.name || "Printer"}</Text>
                            <Text style={[styles.printerAddress, { color: theme.text + "99" }]}>
                                {printerInfo.address || "Unknown Address"}
                            </Text>
                            <View style={styles.statusContainer}>
                                <View
                                    style={[styles.statusIndicator, { backgroundColor: isConnected ? theme.success : theme.border }]}
                                />
                                <Text style={[styles.statusText, { color: isConnected ? theme.success : theme.text + "99" }]}>
                                    {isConnected ? "Connected" : "Disconnected"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {isConnected && (
                    <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Printer Details</Text>

                        <View style={styles.detailsGrid}>
                            <DetailItem icon="check-circle" label="Status" value={printerInfo.status || "Unknown"} theme={theme} />
                            <DetailItem
                                icon="maximize"
                                label="Paper Width"
                                value={printerInfo.paperWidth || "Unknown"}
                                theme={theme}
                            />
                            <DetailItem icon="grid" label="Resolution" value={printerInfo.dpi || "Unknown"} theme={theme} />
                            <DetailItem icon="code" label="Firmware" value={printerInfo.firmware || "Unknown"} theme={theme} />
                        </View>
                    </View>
                )}

                <View style={styles.actionsContainer}>
                    {!isConnected ? (
                        <Button
                            title={isConnecting ? "Connecting..." : "Connect to Printer"}
                            onPress={connectToPrinter}
                            loading={isConnecting}
                            style={styles.actionButton}
                        />
                    ) : (
                        <>
                            <Button title="Print Document" onPress={navigateToPrint} style={styles.actionButton} />
                            <Button title="Disconnect" onPress={disconnectPrinter} variant="outline" style={styles.actionButton} />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

interface DetailItemProps {
    icon: keyof typeof Feather.glyphMap
    label: string
    value: string
    theme: any
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, theme }) => {
    return (
        <View style={styles.detailItem}>
            <View style={[styles.detailIconContainer, { backgroundColor: theme.primary + "15" }]}>
                <Feather name={icon} size={16} color={theme.primary} />
            </View>
            <Text style={[styles.detailLabel, { color: theme.text + "99" }]}>{label}</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
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
    printerCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    printerHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    printerInfo: {
        flex: 1,
    },
    printerName: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 4,
    },
    printerAddress: {
        fontSize: 14,
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
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
    detailsCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -8,
    },
    detailItem: {
        width: "50%",
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "500",
    },
    actionsContainer: {
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
    },
})

export default PrinterDetailsScreen
