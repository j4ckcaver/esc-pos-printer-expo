import type { DeviceInfo } from "react-native-esc-pos-printer"

export type PrinterConnectionHint = "bluetooth" | "network"

export type PrinterMeta = {
    pin?: string
    notes?: string
    connectionHint?: PrinterConnectionHint
    isTest?: boolean
}

export type AppPrinterInfo = DeviceInfo & PrinterMeta
