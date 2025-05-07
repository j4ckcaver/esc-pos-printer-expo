import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import Button from "@/component/Button"
import EmptyState from "@/component/EmptyState"
import PrinterItem from "@/component/PrinterItem"
import type { StackNavigation } from "@/navigators/RootNavigator"
import { DiscoveryFilterOption, type DeviceInfo, usePrintersDiscovery } from 'react-native-esc-pos-printer';

const PrinterSearchScreen = () => {
    const { navigate } = useNavigation<StackNavigation>()
    const { theme } = useTheme()
    const { start, printers, isDiscovering } = usePrintersDiscovery();
    const [hasSearched, setHasSearched] = useState(false)

    useEffect(() => {
        searchPrinters();
    }, []);

    const handlePrinterSelect = (printer: DeviceInfo) => {
        navigate("PrinterDetails", { printer })
    };

    const searchPrinters = () => {
        try {
            start({
                timeout: 5000,
                filterOption: {
                    deviceModel: DiscoveryFilterOption.MODEL_ALL
                },
            });
            setHasSearched(true);
        } catch (error) {
            console.error('Error starting printer discovery:', error);
        }
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

            {hasSearched && printers.length === 0 && !isDiscovering ? (
                <EmptyState
                    icon="printer"
                    title="No Printers Found"
                    description="Make sure your printer is turned on and Bluetooth is enabled on your device."
                    buttonTitle="Try Again"
                    onButtonPress={searchPrinters}
                />
            ) : (
                <FlatList
                    data={printers}
                    keyExtractor={(item) => item?.target}
                    renderItem={({ item }) => <PrinterItem printer={item} onPress={() => handlePrinterSelect(item)} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        isDiscovering ? (
                            <EmptyState icon="search" title="Searching for Printers" description="This may take a moment..." />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    )
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
})

export default PrinterSearchScreen
