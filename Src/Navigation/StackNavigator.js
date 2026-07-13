// AppContainer.js
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

// Screens
import LoginScreen from "../Src-1/screens/Login/LoginScreen";
import SelectCostCenterScreen from "../Src-1/screens/SelectCostCenter/SelectCostCenterScreen";
import HomeScreen from "../Src-1/screens/Home/HomeScreen";
import PrintScreen from "../Src-1/screens/AddPrinter/PrintMain";
import WebViewPrintScreen from "../Src-1/screens/WebViewPrint/WebViewPrintScreen";
import Homescreen1 from "../Src-2/Screens/Home/Home";
import BMGJewellersScreen from "../Src-3/Screens/Home/Home";
import ResultsScreen from "../Src-3/Screens/Result/ResultScreen";
import ChangeStockPassword from "../Src-1/screens/StockPassword/ChangeStockPassword";

// Context
import { LoginProvider, LoginContext } from "../Context/LoginContext";
import { ToastProvider } from "../Src-1/Context/ToastContext";

const Stack = createNativeStackNavigator();
const PERSISTENCE_KEY = "NAVIGATION_STATE";

function AppStack() {
  const { username, loading } = useContext(LoginContext);

  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();

  // 🔥 Restore navigation state
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = savedState ? JSON.parse(savedState) : undefined;

        if (state !== undefined && username) {
          setInitialState(state);
        }
      } catch (e) {
        console.log("Failed to restore navigation state", e);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, [username]);

  // 🔥 Clear navigation state when user logs out
  useEffect(() => {
    if (!username) {
      AsyncStorage.removeItem(PERSISTENCE_KEY);
    }
  }, [username]);

  if (loading || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </View>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
      theme={DefaultTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!username ? (
          // 🔐 If not logged in
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // 🔓 If logged in
          <>
            <Stack.Screen
              name="SelectCostCenter"
              component={SelectCostCenterScreen}
            />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Homescreen1" component={Homescreen1} />
            <Stack.Screen name="Print" component={PrintScreen} />
            <Stack.Screen name="WebViewPrint" component={WebViewPrintScreen} />
            <Stack.Screen name="BMGJewellers" component={BMGJewellersScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen
              name="ChangeStockPassword"
              component={ChangeStockPassword}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppContainer() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginProvider>
        <ToastProvider>
          <AppStack />
        </ToastProvider>
      </LoginProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});