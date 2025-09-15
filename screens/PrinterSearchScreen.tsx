import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import Button from "@/component/Button"
import EmptyState from "@/component/EmptyState"
import PrinterItem from "@/component/PrinterItem"
import type { StackNavigation } from "@/navigators/RootNavigator"
import { DiscoveryFilterOption, type DeviceInfo, usePrintersDiscovery, DiscoveryDeviceModel, DiscoveryDeviceType} from 'react-native-esc-pos-printer';

const PrinterSearchScreen = () => {
    const { navigate } = useNavigation<StackNavigation>()
    const { theme } = useTheme()
    const { start, printers, isDiscovering } = usePrintersDiscovery();
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        searchPrinters();
    }, []);

    const handlePrinterSelect = (printer: DeviceInfo) => {
        try {
            console.log('Selected printer:', printer);
            navigate("PrinterDetails", { printer });
        } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert("Error", "Failed to navigate to printer details");
        }
    };

    const searchPrinters = async () => {
        try {
            console.log('Starting printer discovery...');

            // Clear any previous errors
            setHasSearched(false);

            start({
                timeout: 5000,
                filterOption: {
                    // deviceModel: DiscoveryDeviceModel.MODEL_ALL, // default
                    deviceType: DiscoveryDeviceType.TYPE_PRINTER,
                    // portType: DiscoveryFilterOption.PORTTYPE_ALL // can use for filter
                }
            });

            setHasSearched(true);

            console.log('Printer discovery started successfully');
        } catch (error: any) {
            setHasSearched(true);

            Alert.alert(
                "Discovery Error",
                `Failed to start printer discovery: ${error?.message || 'Unknown error'}`,
                [
                    { text: "Cancel" },
                    { text: "Try Again", onPress: searchPrinters }
                ]
            );
        }
    };

    // Debug printers array
    useEffect(() => {
        console.log('Printers state changed:', {
            printers,
            printersCount: printers?.length || 0,
            isDiscovering,
            hasSearched
        });
    }, [printers, isDiscovering, hasSearched]);

    const renderEmptyState = () => {
        if (isDiscovering) {
            return (
                <EmptyState
                    icon="search"
                    title="Searching for Printers"
                    description="This may take a moment..."
                />
            );
        }

        if (hasSearched && printers.length === 0) {
            return (
                <EmptyState
                    icon="printer"
                    title="No Printers Found"
                    description="Make sure your printer is turned on and connected to the same network."
                    buttonTitle="Try Again"
                    onButtonPress={searchPrinters}
                />
            );
        }

        return null;
    };

    const renderPrinterItem = ({ item, index }: { item: DeviceInfo, index: number }) => {
        console.log(`Rendering printer ${index}:`, item);

        // Safety check for item
        if (!item) {
            console.warn('Printer item is null/undefined at index:', index);
            return null;
        }

        return (
            <PrinterItem
                printer={item}
                onPress={() => handlePrinterSelect(item)}
            />
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.searchContainer}>
                <Button
                    title={isDiscovering ? "Searching..." : "Refresh Search"}
                    onPress={searchPrinters}
                    loading={isDiscovering}
                    style={styles.searchButton}
                />
            </View>

            <FlatList
                data={printers || []} // Ensure data is never null/undefined
                keyExtractor={(item, index) => {
                    // More robust key extraction
                    if (item?.target) return item.target;
                    if (item?.deviceName) return item.deviceName;
                    return `printer-${index}`;
                }}
                renderItem={renderPrinterItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState()}
                onRefresh={searchPrinters}
                refreshing={isDiscovering}
                // Add error boundary props
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
        borderBottomColor: "#E5E7EB",
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