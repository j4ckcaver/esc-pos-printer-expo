## Author
Created by [Md Muhaiminul](https://www.linkedin.com/in/aargon007).

## 📦 Overview

`esc-pos-printer-expo` is a React Native app built with Expo for interfacing with ESC/POS-compatible thermal printers. Designed for seamless receipt printing and real-time communication with printers, this project leverages `react-native-bluetooth-escpos-printer` and Expo's tooling to provide cross-platform development efficiency.

This app is ideal for retail POS systems, restaurant order slips, or any on-the-go printing solution using Bluetooth, USB, or network printers.

---

## 🚀 Features

- 🖨️ ESC/POS printing support using `react-native-bluetooth-escpos-printer`
- ⚛️ Modern React Native architecture
- 📱 Navigation via React Navigation
- 🧠 State management via Redux Toolkit + redux-persist
- 💅 Pre-configured with ESLint, Prettier, and TypeScript
- 🌐 Web support using Expo for Web
- 🔐 AsyncStorage integration for persistence
- 🛠️ Developer productivity scripts (linting, type checks, cleaning, etc.)

### 🔧 Test printer presets

For quick testing you can pre-fill printer details (name, target, MAC, PIN, notes, etc.) inside `config/testPrinters.ts`. Populate the sample array with your own devices and they will appear alongside discovered printers, marked as “Test” in the UI.

---
