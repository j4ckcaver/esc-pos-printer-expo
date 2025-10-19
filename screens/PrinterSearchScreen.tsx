import { useState, useEffect, useMemo, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import Button from "@/component/Button";
import EmptyState from "@/component/EmptyState";
import PrinterItem from "@/component/PrinterItem";
import type { StackNavigation } from "@/navigators/RootNavigator";
import { Feather } from "@expo/vector-icons";
import { TEST_PRINTERS } from "@/config/testPrinters";
import type { AppPrinterInfo } from "@/types/printer";
import { useBluetoothPrinters } from "@/hooks/useBluetoothPrinters";

type DiscoveryMode = "all" | "network" | "bluetooth";

const PrinterSearchScreen = () => {
    const { navigate } = useNavigation<StackNavigation>();
    const { theme } = useTheme();
    const { printers: bluetoothPrinters, scan, isScanning, error, clearError } = useBluetoothPrinters();
    const [hasSearched, setHasSearched] = useState(false);
    const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("all");
    const testPrinters = useMemo(() => TEST_PRINTERS, []);

    const modeOptions: Array<{
        value: DiscoveryMode;
        label: string;
        icon: keyof typeof Feather.glyphMap;
    }> = useMemo(
        () => [
            { value: "all", label: "All", icon: "grid" },
            { value: "network", label: "Wi-Fi", icon: "wifi" },
            { value: "bluetooth", label: "Bluetooth", icon: "bluetooth" },
        ],
        []
    );

    const isBluetoothDevice = useCallback((printer: { target: string; bdAddress?: string | null }) => {
        if (!printer?.target) return false;
        const normalizedTarget = printer.target.toLowerCase();
        return normalizedTarget.startsWith("bt:") || Boolean(printer.bdAddress);
    }, []);

    const mergedPrinters = useMemo<AppPrinterInfo[]>(() => {
        const printerMap = new Map<string, AppPrinterInfo>();

        testPrinters.forEach((printer) => {
            const key = printer.target.toLowerCase();
            printerMap.set(key, printer);
        });

        bluetoothPrinters.forEach((printer) => {
            const key = printer.target?.toLowerCase?.() || `${printer.deviceName}-${printer.ipAddress}`;
            const existing = key ? printerMap.get(key) : undefined;
            const connectionHint = existing?.connectionHint ?? (isBluetoothDevice(printer) ? "bluetooth" : "network");

            const normalizedKey = key || printer.target.toLowerCase();
            printerMap.set(normalizedKey, {
                ...printer,
                deviceName: printer.deviceName || existing?.deviceName || printer.target,
                macAddress: printer.macAddress || existing?.macAddress || "",
                bdAddress: printer.bdAddress || existing?.bdAddress || "",
                ipAddress: printer.ipAddress || existing?.ipAddress || "",
                connectionHint,
                pin: existing?.pin,
                notes: existing?.notes,
                isTest: existing?.isTest ?? false,
            });
        });

        return Array.from(printerMap.values());
    }, [bluetoothPrinters, isBluetoothDevice, testPrinters]);

    const displayPrinters = useMemo(() => {
        return mergedPrinters.filter((printer) => {
            if (discoveryMode === "all") return true;

            const connectionHint = printer.connectionHint ?? (isBluetoothDevice(printer) ? "bluetooth" : "network");
            return discoveryMode === connectionHint;
        });
    }, [discoveryMode, isBluetoothDevice, mergedPrinters]);

    const handlePrinterSelect = useCallback(
        (printer: AppPrinterInfo) => {
            try {
                console.log("Selected printer:", printer);
                navigate("PrinterDetails", { printer });
            } catch (navigationError) {
                console.error("Navigation error:", navigationError);
                Alert.alert("Error", "Failed to prepare printer connection");
            }
        },
        [navigate]
    );

    const searchPrinters = useCallback(async () => {
        try {
            setHasSearched(false);

            if (discoveryMode !== "network") {
                console.log("Starting Bluetooth discovery...", { discoveryMode });
                await scan();
                console.log("Bluetooth discovery finished");
            } else {
                console.log("Skipping Bluetooth discovery for network mode");
            }

            setHasSearched(true);
        } catch (scanError: any) {
            setHasSearched(true);

            Alert.alert("Discovery Error", scanError?.message ?? "Unknown error occurred during discovery.", [
                { text: "Cancel" },
                { text: "Try Again", onPress: () => { void searchPrinters(); } },
            ]);
        }
    }, [discoveryMode, scan]);

    useEffect(() => {
        void searchPrinters();
    }, [searchPrinters]);

    useEffect(() => {
        console.log("Printers state changed:", {
            bluetoothPrinters,
            discoveredPrintersCount: bluetoothPrinters?.length || 0,
            displayPrintersCount: displayPrinters.length,
            isDiscovering: isScanning,
            hasSearched,
            discoveryMode,
        });
    }, [bluetoothPrinters, displayPrinters.length, isScanning, hasSearched, discoveryMode]);

    useEffect(() => {
        if (!error) return;

        Alert.alert("Bluetooth Error", error, [{ text: "Tamam", onPress: () => clearError() }]);
    }, [clearError, error]);

    const renderEmptyState = () => {
        const searchContextTitle =
            discoveryMode === "bluetooth" ? "Bluetooth Printers" : discoveryMode === "network" ? "Network Printers" : "Printers";

        const notFoundDescription =
            discoveryMode === "bluetooth"
                ? "Ensure your printer is turned on, discoverable, or already paired via Bluetooth."
                : discoveryMode === "network"
                  ? "Make sure your printer is turned on and connected to the same network."
                  : "Make sure your printer is turned on and reachable over Wi-Fi, Ethernet, or Bluetooth.";

        if (isScanning) {
            return <EmptyState icon="search" title={`Searching for ${searchContextTitle}`} description="This may take a moment..." />;
        }

        if (hasSearched && displayPrinters.length === 0) {
            return (
                <EmptyState
                    icon={discoveryMode === "bluetooth" ? "bluetooth" : "printer"}
                    title={`No ${searchContextTitle} Found`}
                    description={notFoundDescription}
                    buttonTitle="Try Again"
                    onButtonPress={() => { void searchPrinters(); }}
                />
            );
        }

        return null;
    };

    const renderPrinterItem = ({ item, index }: { item: AppPrinterInfo; index: number }) => {
        console.log(`Rendering printer ${index}:`, item);

        if (!item) {
            console.warn("Printer item is null/undefined at index:", index);
            return null;
        }

        return <PrinterItem printer={item} onPress={() => { void handlePrinterSelect(item); }} />;
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
                <View style={styles.modeToggle}>
                    {modeOptions.map((option) => {
                        const isActive = discoveryMode === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.modeButton,
                                    {
                                        borderColor: isActive ? theme.primary : theme.border,
                                        backgroundColor: isActive ? theme.primary + "20" : theme.card,
                                    },
                                    option.value !== modeOptions[modeOptions.length - 1].value && styles.modeButtonSpacing,
                                ]}
                                onPress={() => {
                                    if (!isActive) {
                                        setDiscoveryMode(option.value);
                                    }
                                }}
                            >
                                <Feather name={option.icon} size={16} color={isActive ? theme.primary : theme.text + "99"} />
                                <Text
                                    style={[
                                        styles.modeButtonLabel,
                                        {
                                            color: isActive ? theme.primary : theme.text + "99",
                                        },
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Button
                    title={isScanning ? "Searching..." : "Refresh Search"}
                    onPress={() => { void searchPrinters(); }}
                    loading={isScanning}
                    style={styles.searchButton}
                />
            </View>

            <FlatList
                data={displayPrinters}
                keyExtractor={(item, index) => {
                    if (item?.target) return item.target;
                    if (item?.deviceName) return item.deviceName;
                    return `printer-${index}`;
                }}
                renderItem={renderPrinterItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState()}
                onRefresh={() => { void searchPrinters(); }}
                refreshing={isScanning}
                removeClippedSubviews={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 16,
        borderBottomWidth: 1,
    },
    modeToggle: {
        flexDirection: "row",
        marginBottom: 12,
    },
    modeButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    modeButtonSpacing: {
        marginRight: 12,
    },
    modeButtonLabel: {
        fontSize: 14,
        fontWeight: "600",
        marginLeft: 8,
    },
    searchButton: {
        width: "100%",
    },
    listContent: {
        flexGrow: 1,
        paddingVertical: 8,
    },
});

export default PrinterSearchScreen;
