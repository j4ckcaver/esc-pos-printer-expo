import type { AppPrinterInfo, PrinterConnectionHint } from '@/types/printer';

type TestPrinterPreset = {
    label: string;
    target: string;
    ipAddress?: string;
    macAddress?: string;
    bdAddress?: string;
    pin?: string;
    notes?: string;
    connection?: PrinterConnectionHint;
};

const TEST_PRINTER_PRESETS: TestPrinterPreset[] = [
    {
        label: 'Mağaza Yazıcısı (Wi-Fi)',
        target: 'TCP:192.168.123.100',
        ipAddress: '192.168.123.100',
        macAddress: '00:47:50:35:10:DA',
        connection: 'network',
        notes: 'Statik IP ile ağ üzerinden test',
    },
    {
        label: 'Mağaza Yazıcısı (Bluetooth)',
        target: 'BT-DC-1D-30-EC-91-40',
        macAddress: 'DC-1D-30-EC-91-40',
        connection: 'bluetooth',
        notes: 'Bluetooth eşleştirme için PIN girmeniz gerekiyorsa ekleyin',
    },
];

const sanitize = (value?: string) => (value ?? '').trim();

const resolveConnection = (preset: TestPrinterPreset): PrinterConnectionHint => {
    if (preset.connection) return preset.connection;

    const target = preset.target?.toLowerCase();
    return target && target.startsWith('bt:') ? 'bluetooth' : 'network';
};

export const TEST_PRINTERS: AppPrinterInfo[] = TEST_PRINTER_PRESETS.reduce<AppPrinterInfo[]>((acc, preset) => {
    const target = sanitize(preset.target);
    if (!target) {
        return acc;
    }

    acc.push({
        deviceName: sanitize(preset.label) || target,
        target,
        deviceType: 'TYPE_PRINTER',
        ipAddress: sanitize(preset.ipAddress),
        macAddress: sanitize(preset.macAddress),
        bdAddress: sanitize(preset.bdAddress),
        pin: sanitize(preset.pin) || undefined,
        notes: preset.notes?.trim(),
        connectionHint: resolveConnection(preset),
        isTest: true,
    });

    return acc;
}, []);

export const hasTestPrinters = TEST_PRINTERS.length > 0;
