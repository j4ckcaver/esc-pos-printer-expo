import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"
import Button from "@/component/Button"
import EmptyState from "@/component/EmptyState"
import PrinterItem from "@/component/PrinterItem"
import type { StackNavigation } from "@/navigators/RootNavigator"

// Mock data for printers
const mockPrinters = [
    {
        id: "1",
        name: "Epson TM-T20III",
        address: "BT:00:11:22:33:44:55",
        connected: false,
    },
    {
        id: "2",
        name: "Star TSP100",
        address: "BT:AA:BB:CC:DD:EE:FF",
        connected: false,
    },
    {
        id: "3",
        name: "Zebra ZD410",
        address: "BT:12:34:56:78:90:AB",
        connected: false,
    },
]

const PrinterSearchScreen = () => {
    const navigation = useNavigation<StackNavigation>()
    const { theme } = useTheme()
    const [printers, setPrinters] = useState<typeof mockPrinters>([])
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const searchPrinters = () => {
        setIsSearching(true)
        setHasSearched(true)

        // Simulate printer discovery
        setTimeout(() => {
            setPrinters(mockPrinters)
            setIsSearching(false)
        }, 2000)

        // In a real app, you would use the react-native-esc-pos-printer SDK:
        // try {
        //   const devices = await EscPosPrinter.discover();
        //   setPrinters(devices);
        // } catch (error) {
        //   Alert.alert('Error', 'Failed to discover printers');
        // } finally {
        //   setIsSearching(false);
        // }
    }

    const handlePrinterSelect = (printer: (typeof mockPrinters)[0]) => {
        navigation.navigate("PrinterDetails", { printer })
    }

    useEffect(() => {
        // Start searching automatically when the screen loads
        searchPrinters()
    }, [])

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.searchContainer}>
                <Button
                    title={isSearching ? "Searching..." : "Refresh Search"}
                    onPress={searchPrinters}
                    loading={isSearching}
                    style={styles.searchButton}
                />
            </View>

            {hasSearched && printers.length === 0 && !isSearching ? (
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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <PrinterItem printer={item} onPress={() => handlePrinterSelect(item)} />}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        isSearching ? (
                            <EmptyState icon="search" title="Searching for Printers" description="This may take a moment..." />
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    )
}

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
