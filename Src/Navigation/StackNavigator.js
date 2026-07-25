// AppContainer.js
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";

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

// Sidebar (drawer content)
import Sidebar from "../Components/Sidebar/Sidebar";

// Context
import { LoginProvider, LoginContext } from "../Context/LoginContext";
import { ToastProvider } from "../Src-1/Context/ToastContext";
import { useTheme } from "../Context/ThemeContext";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const InnerStack = createNativeStackNavigator();
// Bumped to v2: the navigator tree changed from a plain stack to a
// stack-wrapping-a-drawer, so any state persisted under the old key would
// have an incompatible shape and could fail to restore.
const PERSISTENCE_KEY = "NAVIGATION_STATE_V3";
const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Inner stack handles proper back navigation between screens
function AppScreensStack() {
  return (
    <InnerStack.Navigator screenOptions={{ headerShown: false }}>
      <InnerStack.Screen name="SelectCostCenter" component={SelectCostCenterScreen} />
      <InnerStack.Screen name="Home" component={HomeScreen} />
      <InnerStack.Screen name="Homescreen1" component={Homescreen1} />
      <InnerStack.Screen name="Print" component={PrintScreen} />
      <InnerStack.Screen name="WebViewPrint" component={WebViewPrintScreen} />
      <InnerStack.Screen name="BMGJewellers" component={BMGJewellersScreen} />
      <InnerStack.Screen name="Results" component={ResultsScreen} />
      <InnerStack.Screen name="ChangeStockPassword" component={ChangeStockPassword} />
    </InnerStack.Navigator>
  );
}

// 🔓 Drawer wraps the stack so the sidebar is available from every screen.
function MainDrawer() {
  const { theme } = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: isTablet ? 320 : "80%",
          backgroundColor: theme.COLORS.background,
        },
        overlayColor: "rgba(0,0,0,0.4)",
        swipeEdgeWidth: 40,
      }}
    >
      <Drawer.Screen
        name="AppScreens"
        component={AppScreensStack}
        options={{ swipeEnabled: true, drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
}

function AppStack() {
  const { username, loading } = useContext(LoginContext);
  const { theme, isDarkMode } = useTheme();

  const navTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.COLORS.background,
      card: theme.COLORS.card,
      text: theme.COLORS.text,
      border: theme.COLORS.outline,
      primary: theme.COLORS.primary,
      notification: theme.COLORS.notification,
    },
  };

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
      theme={navTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!username ? (
          // 🔐 If not logged in
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // 🔓 If logged in — everything lives inside the drawer/sidebar
          <Stack.Screen name="Main" component={MainDrawer} />
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