// AppContainer.js
import React, { useContext } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dimensions } from "react-native";
import AsynchStorage from "@react-native-async-storage/async-storage";

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
const { width } = Dimensions.get("window");
const isTablet = width >= 768;

// Inner stack handles proper back navigation between screens
function AppScreensStack() {

  // AsynchStorage.clear(); // Clear AsyncStorage on app start for testing purposes (remove in production)
  const { hasCostCentres } = useContext(LoginContext);
  const initialRoute = hasCostCentres === false ? "Home" : "SelectCostCenter";
  return (
    <InnerStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a1b9a" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
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
      <ToastProvider>
        <LoginProvider>
          <AppStack />
        </LoginProvider>
      </ToastProvider>
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