import { useEffect } from 'react';
import { View } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {  NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from '@/navigators/RootNavigator';
import { ThemeProvider } from './context/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {

  const [loaded] = useFonts({
    "Inter": require("@/assets/fonts/Inter-Black.otf"),
  });

  useEffect(() => {
    if (loaded) {
      // Hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider>
            <NavigationContainer>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootNavigator />
              </GestureHandlerRootView>
            </NavigationContainer>
      </ThemeProvider>
    </View>
  );
}