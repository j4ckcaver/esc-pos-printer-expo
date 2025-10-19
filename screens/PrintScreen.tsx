import { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import Button from "@/component/Button";
import { BluetoothEscposPrinter, BluetoothManager } from "react-native-bluetooth-escpos-printer";
import type { AppPrinterInfo } from "@/types/printer";

const PrintScreen = ({ navigation, route }: { navigation: any; route: { params: { printer: AppPrinterInfo } } }) => {
    const printer = route.params.printer;
    const { theme } = useTheme();
    const [isPrinting, setIsPrinting] = useState(false);

    const [receiptTitle, setReceiptTitle] = useState("My Store");
    const [receiptItems, setReceiptItems] = useState([
        { name: "Product 1", price: "9.99", quantity: 1 },
        { name: "Product 2", price: "15.50", quantity: 2 },
    ]);
    const [newItemName, setNewItemName] = useState("");
    const [newItemPrice, setNewItemPrice] = useState("");
    const [newItemQuantity, setNewItemQuantity] = useState("1");

    const bluetoothAddress = useMemo(() => {
        if (printer?.macAddress) return printer.macAddress;
        const match = printer?.target?.match(/bt[:\-]?(.+)/i);
        return match?.[1];
    }, [printer]);

    const addItem = () => {
        if (!newItemName || !newItemPrice) {
            Alert.alert("Error", "Please enter item name and price");
            return;
        }

        const quantity = Number.parseInt(newItemQuantity) || 1;

        setReceiptItems([...receiptItems, { name: newItemName, price: newItemPrice, quantity }]);

        setNewItemName("");
        setNewItemPrice("");
        setNewItemQuantity("1");
    };

    const removeItem = (index: number) => {
        const updatedItems = [...receiptItems];
        updatedItems.splice(index, 1);
        setReceiptItems(updatedItems);
    };

    const calculateTotal = () => {
        return receiptItems
            .reduce((total, item) => {
                return total + Number.parseFloat(item.price) * item.quantity;
            }, 0)
            .toFixed(2);
    };

    const printReceipt = async () => {
        if (!bluetoothAddress) {
            Alert.alert("Bluetooth Error", "Yazıcının Bluetooth adresi bulunamadı. Test profilini güncelleyin.");
            return;
        }

        setIsPrinting(true);

        try {
            const isEnabled = await BluetoothManager.isBluetoothEnabled();
            if (!isEnabled) {
                await BluetoothManager.enableBluetooth();
            }

            try {
                await BluetoothManager.connect(bluetoothAddress);
            } catch (connectionError) {
                console.warn("Bluetooth reconnect attempt:", connectionError);
            }

            await BluetoothEscposPrinter.printerInit();
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText(`${receiptTitle}\r\n`, {
                encoding: "UTF-8",
                widthtimes: 2,
                heigthtimes: 2,
                fonttype: 1,
            });

            await BluetoothEscposPrinter.printText(`${new Date().toLocaleString()}\r\n\r\n`, { encoding: "UTF-8" });

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            for (const item of receiptItems) {
                const line = `${item.name} x${item.quantity}`;
                const price = `$${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}`;
                await BluetoothEscposPrinter.printText(`${line}\r\n${price}\r\n`, { encoding: "UTF-8" });
                await BluetoothEscposPrinter.printText("\r\n", { encoding: "UTF-8" });
            }

            await BluetoothEscposPrinter.printText("--------------------------------\r\n", { encoding: "UTF-8" });
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText(`Total: $${calculateTotal()}\r\n\r\n`, { encoding: "UTF-8" });

            await BluetoothEscposPrinter.printText("Thank you!\r\n", { encoding: "UTF-8" });
            await BluetoothEscposPrinter.printText("Powered by React Native Bluetooth ESC/POS\r\n\r\n", { encoding: "UTF-8" });

            await BluetoothEscposPrinter.printText("\r\n\r\n", { encoding: "UTF-8" });

            Alert.alert("Success", "Receipt printed successfully");
        } catch (error) {
            console.log("Print error:", error);
            Alert.alert("Error", "Printing failed");
        } finally {
            try {
                await BluetoothManager.disconnect();
            } catch (disconnectError) {
                console.log("Disconnect error:", disconnectError);
            }
            setIsPrinting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.printerInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.printerInfoText, { color: theme.text }]}>
                        Printing to: <Text style={{ fontWeight: "600" }}>{printer.deviceName}</Text>
                    </Text>
                </View>

                <View style={[styles.receiptCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Receipt Preview</Text>

                    <View style={styles.receiptHeader}>
                        <TextInput
                            style={[styles.receiptTitle, { color: theme.text, borderColor: theme.border }]}
                            value={receiptTitle}
                            onChangeText={setReceiptTitle}
                            placeholder="Store Name"
                            placeholderTextColor={theme.text + "66"}
                        />
                        <Text style={[styles.receiptDate, { color: theme.text + "99" }]}>{new Date().toLocaleString()}</Text>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    {receiptItems.length > 0 ? (
                        <View style={styles.itemsContainer}>
                            {receiptItems.map((item, index) => (
                                <View key={index} style={styles.receiptItem}>
                                    <View style={styles.itemInfo}>
                                        <Text style={[styles.itemName, { color: theme.text }]}>
                                            {item.name} x{item.quantity}
                                        </Text>
                                        <Text style={[styles.itemPrice, { color: theme.text }]}>
                                            ${(Number.parseFloat(item.price) * item.quantity).toFixed(2)}
                                        </Text>
                                    </View>
                                    <Button
                                        title=""
                                        icon={<Feather name="trash-2" size={16} color={theme.notification} />}
                                        onPress={() => removeItem(index)}
                                        variant="outline"
                                        style={styles.removeButton}
                                    />
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyItems}>
                            <Text style={[styles.emptyText, { color: theme.text + "66" }]}>No items added yet</Text>
                        </View>
                    )}

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.totalContainer}>
                        <Text style={[styles.totalLabel, { color: theme.text }]}>Total:</Text>
                        <Text style={[styles.totalAmount, { color: theme.text }]}>${calculateTotal()}</Text>
                    </View>
                </View>

                <View style={[styles.addItemCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Item</Text>

                    <View style={styles.addItemForm}>
                        <TextInput
                            style={[
                                styles.input,
                                { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
                            ]}
                            value={newItemName}
                            onChangeText={setNewItemName}
                            placeholder="Item name"
                            placeholderTextColor={theme.text + "66"}
                        />

                        <View style={styles.priceQuantityRow}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.priceInput,
                                    { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
                                ]}
                                value={newItemPrice}
                                onChangeText={setNewItemPrice}
                                placeholder="Price"
                                placeholderTextColor={theme.text + "66"}
                                keyboardType="decimal-pad"
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.quantityInput,
                                    { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
                                ]}
                                value={newItemQuantity}
                                onChangeText={setNewItemQuantity}
                                placeholder="Qty"
                                placeholderTextColor={theme.text + "66"}
                                keyboardType="number-pad"
                            />
                        </View>

                        <Button title="Add Item" onPress={addItem} style={styles.addButton} />
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <Button title={isPrinting ? "Printing..." : "Print Receipt"} onPress={printReceipt} loading={isPrinting} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    printerInfo: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    printerInfoText: {
        fontSize: 16,
    },
    receiptCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    receiptHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    receiptTitle: {
        flex: 1,
        marginRight: 12,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 18,
        fontWeight: "600",
    },
    receiptDate: {
        fontSize: 12,
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    itemsContainer: {
        gap: 12,
    },
    receiptItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
    },
    removeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 0,
    },
    emptyItems: {
        alignItems: "center",
        paddingVertical: 16,
    },
    emptyText: {
        fontSize: 14,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: "700",
    },
    addItemCard: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    addItemForm: {
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    priceQuantityRow: {
        flexDirection: "row",
        gap: 12,
    },
    priceInput: {
        flex: 1,
    },
    quantityInput: {
        width: 80,
    },
    addButton: {
        alignSelf: "flex-end",
    },
    actionsContainer: {
        gap: 12,
        marginBottom: 24,
    },
});

export default PrintScreen;
