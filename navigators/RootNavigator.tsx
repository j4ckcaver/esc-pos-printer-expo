import * as React from 'react';
import { type NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/HomeScreen';
import PrintScreen from '@/screens/PrintScreen';
import PrinterDetailsScreen from '@/screens/PrinterDetailsScreen';
import PrinterSearchScreen from '@/screens/PrinterSearchScreen';
import ThemeToggleButton from '@/component/common/ThemeToggleButton';

export type ScreenNames = ['Home', 'PrinterSearch', "PrinterDetails", "Print"];

export type RootStackParamList = {
    Home: undefined;
    PrinterSearch: undefined;
    PrinterDetails: any;
    Print: any;
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
                options={({ navigation }) => ({
                    title: "Thermal Printer",
                    headerRight: () => <ThemeToggleButton />,
                })}
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
