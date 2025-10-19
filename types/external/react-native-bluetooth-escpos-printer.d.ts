declare module 'react-native-bluetooth-escpos-printer' {
    type ScanDevice = {
        name?: string;
        address?: string;
    };

    type PrintTextOptions = {
        encoding?: string;
        codepage?: number;
        widthtimes?: number;
        heigthtimes?: number;
        fonttype?: number;
    };

    export const BluetoothManager: {
        isBluetoothEnabled(): Promise<boolean>;
        enableBluetooth(): Promise<void>;
        scanDevices(): Promise<string | { found?: ScanDevice[]; paired?: ScanDevice[] }>;
        connect(address: string): Promise<void>;
        disconnect(): Promise<void>;
    };

    export const BluetoothEscposPrinter: {
        ALIGN: {
            LEFT: number;
            CENTER: number;
            RIGHT: number;
        };
        printerInit(): Promise<void>;
        printerAlign(align: number): Promise<void>;
        printText(text: string, options?: PrintTextOptions): Promise<void>;
    };
}
