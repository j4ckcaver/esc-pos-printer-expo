import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRoute } from "@react-navigation/native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/context/ThemeContext"
import Button from "@/component/Button"

const PrintScreen = () => {
    const route = useRoute()
    const { theme } = useTheme()
    const [isPrinting, setIsPrinting] = useState(false)
    const [receiptTitle, setReceiptTitle] = useState("My Store")
    const [receiptItems, setReceiptItems] = useState([
        { name: "Product 1", price: "9.99", quantity: 1 },
        { name: "Product 2", price: "15.50", quantity: 2 },
    ])
    const [newItemName, setNewItemName] = useState("")
    const [newItemPrice, setNewItemPrice] = useState("")
    const [newItemQuantity, setNewItemQuantity] = useState("1")

    // Get printer from route params
    const printerInfo =
        route.params && (route.params as any).printer ? (route.params as any).printer : { name: "Unknown Printer" }

    const addItem = () => {
        if (!newItemName || !newItemPrice) {
            Alert.alert("Error", "Please enter item name and price")
            return
        }

        const quantity = Number.parseInt(newItemQuantity) || 1

        setReceiptItems([...receiptItems, { name: newItemName, price: newItemPrice, quantity }])

        // Clear inputs
        setNewItemName("")
        setNewItemPrice("")
        setNewItemQuantity("1")
    }

    const removeItem = (index: number) => {
        const updatedItems = [...receiptItems]
        updatedItems.splice(index, 1)
        setReceiptItems(updatedItems)
    }

    const calculateTotal = () => {
        return receiptItems
            .reduce((total, item) => {
                return total + Number.parseFloat(item.price) * item.quantity
            }, 0)
            .toFixed(2)
    }

    const printReceipt = () => {
        setIsPrinting(true)

        // Simulate printing
        setTimeout(() => {
            setIsPrinting(false)
            Alert.alert("Success", "Receipt printed successfully!")
        }, 2000)

        // In a real app, you would use the react-native-esc-pos-printer SDK:
        // try {
        //   // Create receipt content
        //   const commands = [
        //     { type: 'text', value: receiptTitle, align: 'center', weight: 'bold', width: 2, height: 2 },
        //     { type: 'text', value: new Date().toLocaleString(), align: 'center' },
        //     { type: 'text', value: '--------------------------------', align: 'center' },
        //   ];
        //
        //   // Add items
        //   receiptItems.forEach(item => {
        //     commands.push({
        //       type: 'text',
        //       value: `${item.name} x${item.quantity}`,
        //       align: 'left'
        //     });
        //     commands.push({
        //       type: 'text',
        //       value: `$${(parseFloat(item.price) * item.quantity).toFixed(2)}`,
        //       align: 'right'
        //     });
        //   });
        //
        //   commands.push({ type: 'text', value: '--------------------------------', align: 'center' });
        //   commands.push({
        //     type: 'text',
        //     value: `TOTAL: $${calculateTotal()}`,
        //     align: 'right',
        //     weight: 'bold'
        //   });
        //
        //   // Print
        //   await EscPosPrinter.print(commands);
        //   Alert.alert('Success', 'Receipt printed successfully!');
        // } catch (error) {
        //   Alert.alert('Print Error', 'Failed to print receipt');
        // } finally {
        //   setIsPrinting(false);
        // }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.printerInfo, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.printerInfoText, { color: theme.text }]}>
                        Printing to: <Text style={{ fontWeight: "600" }}>{printerInfo.name}</Text>
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
                    <Button
                        title={isPrinting ? "Printing..." : "Print Receipt"}
                        onPress={printReceipt}
                        loading={isPrinting}
                        style={styles.printButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    printerInfo: {
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    printerInfoText: {
        fontSize: 14,
    },
    receiptCard: {
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
    receiptHeader: {
        marginBottom: 12,
    },
    receiptTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 8,
        paddingVertical: 4,
        borderBottomWidth: 1,
    },
    receiptDate: {
        fontSize: 14,
        textAlign: "center",
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    itemsContainer: {
        marginBottom: 12,
    },
    receiptItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    itemInfo: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginRight: 8,
    },
    itemName: {
        fontSize: 16,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "500",
    },
    removeButton: {
        minWidth: 0,
        paddingHorizontal: 8,
        height: 32,
    },
    emptyItems: {
        alignItems: "center",
        paddingVertical: 24,
    },
    emptyText: {
        fontSize: 16,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: "600",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "700",
    },
    addItemCard: {
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
    addItemForm: {
        gap: 12,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    priceQuantityRow: {
        flexDirection: "row",
        gap: 12,
    },
    priceInput: {
        flex: 2,
    },
    quantityInput: {
        flex: 1,
    },
    addButton: {
        marginTop: 4,
    },
    actionsContainer: {
        marginBottom: 24,
    },
    printButton: {
        backgroundColor: "#10B981",
    },
})

export default PrintScreen
