
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import StackNavigator from './Src/Navigation/StackNavigator';
import { ThemeProvider, useTheme } from './Src/Context/ThemeContext';


const AppWrapper = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.COLORS.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <StackNavigator />
    </View>
  );
};

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./Src/Src-1/Assets/Fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./Src/Src-1/Assets/Fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./Src/Src-1/Assets/Fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('./Src/Src-1/Assets/Fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Black': require('./Src/Src-1/Assets/Fonts/Poppins/Poppins-Black.ttf'),
  });


  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppWrapper />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
