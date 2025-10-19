export type PrinterConnectionHint = "bluetooth" | "network"

export type PrinterMeta = {
    pin?: string
    notes?: string
    connectionHint?: PrinterConnectionHint
    isTest?: boolean
}

export type BasePrinterInfo = {
    deviceName: string
    target: string
    macAddress?: string
    bdAddress?: string
    ipAddress?: string
    deviceType?: string
}

export type AppPrinterInfo = BasePrinterInfo & PrinterMeta
