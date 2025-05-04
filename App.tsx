import { useEffect } from 'react';
import { View } from "react-native";
import { useFonts } from "expo-font";
import { Provider } from 'react-redux';
import { persistor, store } from '@/redux/store';
import * as SplashScreen from 'expo-splash-screen';
import {  NavigationContainer } from '@react-navigation/native';
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PersistGate } from 'redux-persist/integration/react';
import RootNavigator from '@/navigators/RootNavigator';
import { ThemeProvider } from './context/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false
});

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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <NavigationContainer>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <RootNavigator />
              </GestureHandlerRootView>
            </NavigationContainer>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </View>
  );
}