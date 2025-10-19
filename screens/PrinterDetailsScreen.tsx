import type React from 'react';
import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/component/Button';
import type { StackNavigation } from '@/navigators/RootNavigator';
import { Printer, PrinterConstants } from 'react-native-esc-pos-printer';
import type { AppPrinterInfo } from '@/types/printer';

const PrinterDetailsScreen = ({ route, navigation }: { route: { params: { printer: AppPrinterInfo } }; navigation: StackNavigation }) => {
    const { theme } = useTheme();
    const printer = route.params.printer;
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const connectionHint = printer.connectionHint ?? (printer.target?.toLowerCase().startsWith('bt:') ? 'bluetooth' : 'network');
    const connectionLabel = connectionHint === 'bluetooth' ? 'Bluetooth' : 'Network';

    const printerInstance = useMemo(() => {
        return new Printer({
            target: printer.target,
            deviceName: printer.deviceName,
        });
    }, [printer]);

    const connectToPrinter = async () => {
        setIsConnecting(true);

        try {
            await printerInstance.addQueueTask(async () => {
                await printerInstance.connect();
                const status = await printerInstance.getStatus();
                const printerOnline = status.connection.statusCode === PrinterConstants.TRUE;
                setIsConnected(printerOnline);

                if (!printerOnline) {
                    throw new Error('PRINTER_OFFLINE');
                }

                await printerInstance.addTextAlign(PrinterConstants.ALIGN_CENTER);
                await printerInstance.addTextSize({ width: 1, height: 1 });
                await printerInstance.addText('Printer Connected Successfully!');
                await printerInstance.addFeedLine(2);

                // Line Separator
                await printerInstance.addText('-'.repeat(32));
                await printerInstance.addFeedLine();

                await printerInstance.addTextSize({ width: 1, height: 1 });
                await printerInstance.addText(
                    `Device Name: ${printer.deviceName} \n Mac address: ${
                        printer.macAddress ? printer.macAddress : 'Not found'
                    } \n Target: ${printer.target} \n`
                );
                await printerInstance.addFeedLine();

                // Line Separator
                await printerInstance.addText('-'.repeat(32));
                await printerInstance.addFeedLine(2);

                await printerInstance.addTextAlign(PrinterConstants.ALIGN_CENTER);
                await printerInstance.addTextSize({ width: 2, height: 2 });
                await printerInstance.addText('WELCOME!');
                await printerInstance.addFeedLine(3);

                await printerInstance.addCut();
                await printerInstance.sendData();
            });
        } catch (error) {
            setIsConnected(false);
            try {
                await printerInstance.disconnect();
            } catch (disconnectError) {
                console.log('Disconnect error: ', disconnectError);
            }
            console.log('Error: ', error);
            Alert.alert('Printer Error', 'Printing failed');
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectPrinter = async () => {
        try {
            await printerInstance.disconnect();
        } catch (error) {
            console.log('Disconnect error: ', error);
        } finally {
            setIsConnected(false);
            setIsConnecting(false);
        }
    };

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
                            <Text style={[styles.printerAddress, { color: theme.text + '99' }]}>
                                {printer?.target || 'Unknown Address'}
                            </Text>
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
                ]}>
                {label}
            </Text>
            <Text
                style={[
                    styles.detailValue,
                    {
                        color: theme.text,
                    },
                ]}>
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
        alignItems: 'center',
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
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    printerAddress: {
        fontSize: 14,
        marginBottom: 8,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginRight: 8,
        marginTop: 8,
    },
    metaText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    printerNotes: {
        marginTop: 12,
        fontSize: 13,
        lineHeight: 18,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
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
        fontWeight: '600',
        marginBottom: 16,
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    detailItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    detailIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    actionsContainer: {
        marginBottom: 24,
    },
    actionButton: {
        marginBottom: 12,
    },
});

export default PrinterDetailsScreen;
