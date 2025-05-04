import * as React from 'react';
import { type NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';

export type ScreenNames = ['Home', 'PrinterSearch',"PrinterDetails","Print"];

export type RootStackParamList = {
    Home: undefined;
    PrinterSearch: undefined;
    PrinterDetails: undefined;
    Print: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                autoHideHomeIndicator: true,
                headerShown: true,
                headerStyle: {
                    backgroundColor: "#6366F1",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "600",
                },
                contentStyle: {
                    backgroundColor: "#F9FAFB",
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "Thermal Printer" }}
            />

            <Stack.Screen
                name="PrinterSearch"
                component={PrinterSearchScreen}
                options={{ title: "Find Printers" }}
            />

            <Stack.Screen
                name="PrinterDetails"
                component={PrinterDetailsScreen}
                options={{ title: "Printer Details" }}
            />

            <Stack.Screen
                name="Print"
                component={PrintScreen}
                options={{ title: "Print Document" }}
            />
        </Stack.Navigator>
    );
};

export default RootNavigator;
