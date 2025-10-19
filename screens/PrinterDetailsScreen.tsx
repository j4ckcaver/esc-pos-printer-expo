import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/component/Button';
import type { StackNavigation } from '@/navigators/RootNavigator';
import { BluetoothEscposPrinter, BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import type { AppPrinterInfo } from '@/types/printer';

const PrinterDetailsScreen = ({ route, navigation }: { route: { params: { printer: AppPrinterInfo } }; navigation: StackNavigation }) => {
    const { theme } = useTheme();
    const printer = route.params.printer;
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const connectionHint = printer.connectionHint ?? (printer.target?.toLowerCase().startsWith('bt:') ? 'bluetooth' : 'network');
    const connectionLabel = connectionHint === 'bluetooth' ? 'Bluetooth' : 'Network';

    const bluetoothAddress = useMemo(() => {
        if (printer.macAddress) return printer.macAddress;
        const match = printer.target?.match(/bt[:\-]?(.+)/i);
        return match?.[1];
    }, [printer.macAddress, printer.target]);

    const connectToPrinter = useCallback(async () => {
        if (connectionHint !== 'bluetooth') {
            Alert.alert('Bağlantı türü desteklenmiyor', 'Bu demo şu anda sadece Bluetooth yazıcıları destekliyor.');
            return;
        }

        if (!bluetoothAddress) {
            Alert.alert('Bluetooth Bilgisi Eksik', 'Yazıcının Bluetooth adresi bulunamadı. Test profilini güncelleyin.');
            return;
        }

        setIsConnecting(true);

        try {
            await BluetoothManager.connect(bluetoothAddress);
            setIsConnected(true);

            await BluetoothEscposPrinter.printerInit();
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText('Printer Connected Successfully!\r\n\r\n', { encoding: 'UTF-8' });

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            await BluetoothEscposPrinter.printText(`Device Name: ${printer.deviceName}\r\n`, { encoding: 'UTF-8' });
            await BluetoothEscposPrinter.printText(`MAC Address: ${printer.macAddress ?? 'Unknown'}\r\n`, { encoding: 'UTF-8' });
            await BluetoothEscposPrinter.printText(`Target: ${printer.target}\r\n`, { encoding: 'UTF-8' });
            await BluetoothEscposPrinter.printText('\r\n', { encoding: 'UTF-8' });

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText('WELCOME!\r\n\r\n', {
                encoding: 'UTF-8',
                codepage: 0,
                widthtimes: 2,
                heigthtimes: 2,
                fonttype: 1,
            });

            await BluetoothEscposPrinter.printText('\r\n\r\n', { encoding: 'UTF-8' });
        } catch (error) {
            setIsConnected(false);
            console.log('Error: ', error);
            Alert.alert('Printer Error', 'Bağlantı veya test baskısı başarısız oldu.');
        } finally {
            setIsConnecting(false);
        }
    }, [bluetoothAddress, connectionHint, printer.deviceName, printer.macAddress, printer.target]);

    const disconnectPrinter = useCallback(async () => {
        try {
            await BluetoothManager.disconnect();
        } catch (error) {
            console.log('Disconnect error: ', error);
        } finally {
            setIsConnected(false);
            setIsConnecting(false);
        }
    }, []);

    const navigateToPrint = () => {
        navigation.navigate('Print', { printer });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.printerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.printerHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
                            <Feather name={connectionHint === 'bluetooth' ? 'bluetooth' : 'printer'} size={32} color={theme.primary} />
                        </View>

                        <View style={styles.printerInfo}>
                            <Text style={[styles.printerName, { color: theme.text }]}>{printer?.deviceName || 'Printer'}</Text>
                            <Text style={[styles.printerAddress, { color: theme.text + '99' }]}>{printer?.target || 'Unknown Address'}</Text>
                            <View style={styles.statusContainer}>
                                <View style={[styles.statusIndicator, { backgroundColor: isConnected ? theme.success : theme.border }]} />
                                <Text style={[styles.statusText, { color: isConnected ? theme.success : theme.text + '99' }]}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </Text>
                            </View>
                            <View style={styles.metaContainer}>
                                <View style={[styles.metaPill, { backgroundColor: theme.primary + '15' }]}>
                                    <Feather name={connectionHint === 'bluetooth' ? 'bluetooth' : 'wifi'} size={12} color={theme.primary} />
                                    <Text style={[styles.metaText, { color: theme.primary }]}>{connectionLabel}</Text>
                                </View>
                                {printer.pin && (
                                    <View style={[styles.metaPill, { backgroundColor: theme.warning + '15' }]}>
                                        <Feather name="lock" size={12} color={theme.warning} />
                                        <Text style={[styles.metaText, { color: theme.warning }]}>PIN: {printer.pin}</Text>
                                    </View>
                                )}
                                {printer.isTest && (
                                    <View style={[styles.metaPill, { backgroundColor: theme.info + '15' }]}>
                                        <Feather name="tool" size={12} color={theme.info} />
                                        <Text style={[styles.metaText, { color: theme.info }]}>Test Profile</Text>
                                    </View>
                                )}
                            </View>
                            {printer.notes && <Text style={[styles.printerNotes, { color: theme.text + '80' }]}>{printer.notes}</Text>}
                        </View>
                    </View>
                </View>

                <View style={[styles.detailsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Printer Details</Text>

                    <View style={styles.detailsGrid}>
                        <DetailItem icon="check-circle" label="Status" value={isConnected ? 'Connected' : 'Disconnected'} theme={theme} />
                        <DetailItem
                            icon={connectionHint === 'bluetooth' ? 'bluetooth' : 'wifi'}
                            label="Connection"
                            value={connectionLabel}
                            theme={theme}
                        />
                        <DetailItem icon="navigation" label="Target" value={printer.target || 'Unknown'} theme={theme} />
                        {!!printer.macAddress && <DetailItem icon="cpu" label="MAC Address" value={printer.macAddress} theme={theme} />}
                        {!!printer.bdAddress && (
                            <DetailItem icon="smartphone" label="Bluetooth ID" value={printer.bdAddress} theme={theme} />
                        )}
                        {!!printer.ipAddress && <DetailItem icon="globe" label="IP Address" value={printer.ipAddress} theme={theme} />}
                        {!!printer.pin && <DetailItem icon="lock" label="PIN" value={printer.pin} theme={theme} />}
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    {!isConnected ? (
                        <Button
                            title={isConnecting ? 'Connecting...' : 'Connect to Printer'}
                            onPress={() => {
                                void connectToPrinter();
                            }}
                            loading={isConnecting}
                            style={styles.actionButton}
                        />
                    ) : (
                        <>
                            <Button title="Print Document" onPress={navigateToPrint} style={styles.actionButton} />

                            <Button
                                title="Disconnect"
                                onPress={() => {
                                    void disconnectPrinter();
                                }}
                                variant="outline"
                                style={styles.actionButton}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

interface DetailItemProps {
    icon: keyof typeof Feather.glyphMap;
    label: string;
    value: string;
    theme: any;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, theme }) => {
    return (
        <View style={styles.detailItem}>
            <View style={[styles.detailIconContainer, { backgroundColor: theme.primary + '15' }]}>
                <Feather name={icon} size={16} color={theme.primary} />
            </View>
            <Text
                style={[
                    styles.detailLabel,
                    {
                        color: theme.text + '99',
                    },
                ]}
            >
                {label}
            </Text>
            <Text
                style={[
                    styles.detailValue,
                    {
                        color: theme.text,
                    },
                ]}
            >
                {value}
            </Text>
        </View>
    );
};

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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    printerHeader: {
        flexDirection: 'row',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    printerInfo: {
        flex: 1,
    },
    printerName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    printerAddress: {
        fontSize: 14,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
    },
    printerNotes: {
        marginTop: 12,
        fontSize: 14,
        lineHeight: 20,
    },
    detailsCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    detailsGrid: {
        gap: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailLabel: {
        fontSize: 14,
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionsContainer: {
        gap: 12,
        marginTop: 12,
    },
    actionButton: {
        width: '100%',
    },
});

export default PrinterDetailsScreen;
