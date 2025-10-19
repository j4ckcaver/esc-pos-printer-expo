import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { BluetoothManager } from 'react-native-bluetooth-escpos-printer';
import type { AppPrinterInfo } from '@/types/printer';

type BluetoothScanResult = {
    found?: Array<{ name?: string; address?: string }>;
    paired?: Array<{ name?: string; address?: string }>;
};

const parseScanResult = (value: unknown): BluetoothScanResult => {
    if (!value) return {};

    if (typeof value === 'string') {
        try {
            return JSON.parse(value) as BluetoothScanResult;
        } catch (error) {
            console.warn('Failed to parse Bluetooth scan result:', error);
            return {};
        }
    }

    if (typeof value === 'object') {
        return value as BluetoothScanResult;
    }

    return {};
};

const normalizePrinter = (device: { name?: string; address?: string }): AppPrinterInfo | null => {
    const address = device.address?.trim();
    const name = device.name?.trim() || address;

    if (!address || !name) return null;

    const target = `BT:${address}`;

    return {
        deviceName: name,
        target,
        macAddress: address,
        connectionHint: 'bluetooth',
        deviceType: 'BLUETOOTH_PRINTER',
    };
};

export const useBluetoothPrinters = () => {
    const [printers, setPrinters] = useState<AppPrinterInfo[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestBluetoothEnabled = useCallback(async () => {
        try {
            const isEnabled = await BluetoothManager.isBluetoothEnabled();
            if (isEnabled) return true;

            if (Platform.OS === 'android') {
                await BluetoothManager.enableBluetooth();
                return true;
            }

            Alert.alert(
                'Bluetooth Kapalı',
                'Yazıcıları bulabilmek için Bluetooth bağlantısını etkinleştirin.'
            );
            return false;
        } catch (err) {
            console.warn('Bluetooth enable request failed:', err);
            setError('Bluetooth etkinleştirilemedi. Lütfen ayarlardan kontrol edin.');
            return false;
        }
    }, []);

    const scan = useCallback(async () => {
        setIsScanning(true);
        setError(null);

        try {
            const canScan = await requestBluetoothEnabled();
            if (!canScan) return;

            const rawResult = await BluetoothManager.scanDevices();
            const result = parseScanResult(rawResult);

            const discovered = [
                ...(result.paired ?? []),
                ...(result.found ?? []),
            ];

            const normalized = discovered
                .map(normalizePrinter)
                .filter((printer): printer is AppPrinterInfo => Boolean(printer));

            const uniquePrinters = normalized.reduce<AppPrinterInfo[]>((acc, printer) => {
                const existingIndex = acc.findIndex((item) => item.macAddress === printer.macAddress);
                if (existingIndex >= 0) {
                    acc[existingIndex] = { ...acc[existingIndex], ...printer };
                } else {
                    acc.push(printer);
                }
                return acc;
            }, []);

            setPrinters(uniquePrinters);
        } catch (err: any) {
            console.warn('Bluetooth scan failed:', err);
            const message = err?.message ?? 'Bluetooth taraması başarısız oldu.';
            setError(message);
        } finally {
            setIsScanning(false);
        }
    }, [requestBluetoothEnabled]);

    return {
        printers,
        isScanning,
        error,
        scan,
        clearError: () => setError(null),
    };
};

export type UseBluetoothPrintersReturn = ReturnType<typeof useBluetoothPrinters>;
