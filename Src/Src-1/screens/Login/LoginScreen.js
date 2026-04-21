// 📁 src/Screens/Login/LoginScreen.js
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useToast } from "../../Context/ToastContext";
import Footer from "../../Components/Footer/Footer";
import { useTheme } from "../../../Context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStyles } from "./LoginStyles";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const {
    login,
    loading,
    costOptions,
    selectedCostId,
    setSelectedCostId,
    costLoading,
    fetchCostOptions,
  } = useContext(LoginContext);
  const { showToast } = useToast();
  const { theme, isDarkMode } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formScale = useRef(new Animated.Value(0.95)).current;

  // Fetch cost options when screen mounts
  useEffect(() => {
    fetchCostOptions();
  }, []);

  // UI animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(formScale, {
        toValue: 1,
        tension: 30,
        friction: 8,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password || !employeeId) {
      showToast("Please enter username, password & Employee ID", "warning");
      return;
    }
    if (!selectedCostId) {
      showToast("Please select a Cost ID", "warning");
      return;
    }

    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    try {
      // login() does NOT send costId to backend
      const success = await login(username, password);

      if (success) {
        await AsyncStorage.setItem("EMPLOYEE_ID", employeeId);
        console.log("Employee ID saved:", employeeId);
        setUsername("");
        setPassword("");
        setEmployeeId("");
        showToast("Login successful!", "success");
        setTimeout(() => navigation.replace("Home"), 600);
      } else {
        showToast("Invalid username or password", "error");
      }
    } catch (err) {
      showToast("Login failed. Please try again", "error");
    }
  };

  const styles = getStyles(theme);

  // Renders selected cost name for dropdown button
  const getSelectedCostName = () => {
    const selected = costOptions.find(opt => opt.COSTID === selectedCostId);
    return selected ? `${selected.COSTID} - ${selected.COSTNAME}` : "Select Cost ID";
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={isDarkMode ? theme.COLORS.gradientPrimary : theme.COLORS.gradientSecondary}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <Animated.View
            style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            {/* Logo */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
              <Text style={styles.title}>
                Retail{"\n"}
                <Text style={styles.titleAccent}>Jewellery Estimation</Text>
              </Text>
              <Text style={styles.subtitle}>Exquisite Craftsmanship</Text>
            </Animated.View>

            {/* Form */}
            <Animated.View style={[styles.formContainer, { transform: [{ scale: formScale }] }]}>
              <LinearGradient
                colors={
                  isDarkMode
                    ? [theme.COLORS.surface, theme.COLORS.surfaceVariant]
                    : [theme.COLORS.card, theme.COLORS.surface]
                }
                style={styles.glassBackground}
              >
                <View style={styles.formInner}>
                  <Text style={styles.formTitle}>Welcome Back</Text>

                  <TextInput
                    style={styles.input1}
                    placeholder="Username"
                    placeholderTextColor={theme.COLORS.placeholder}
                    value={username}
                    onChangeText={setUsername}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={theme.COLORS.placeholder}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Employee ID"
                    placeholderTextColor={theme.COLORS.placeholder}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />

                  {/* Cost ID Dropdown */}
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdownVisible(true)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        !selectedCostId && styles.dropdownPlaceholder,
                      ]}
                    >
                      {costLoading ? "Loading cost options..." : getSelectedCostName()}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, (loading || costLoading) && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading || costLoading}
                    activeOpacity={0.85}
                  >
                    <LinearGradient colors={theme.COLORS.gradientPrimary} style={styles.gradientButton}>
                      {loading ? (
                        <ActivityIndicator color={theme.COLORS.title} size="small" />
                      ) : (
                        <Text style={styles.buttonText}>SIGN IN</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        </KeyboardAvoidingView>

        <Footer />
      </LinearGradient>

      {/* Cost ID Selection Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Cost ID</Text>
                {costLoading ? (
                  <ActivityIndicator size="large" color={theme.COLORS.primary} style={{ margin: 20 }} />
                ) : costOptions.length === 0 ? (
                  <Text style={styles.modalEmptyText}>No cost options available</Text>
                ) : (
                  <FlatList
                    data={costOptions}
                    keyExtractor={(item) => item.COSTID}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.modalItem,
                          selectedCostId === item.COSTID && styles.modalItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedCostId(item.COSTID);
                          setDropdownVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modalItemText,
                            selectedCostId === item.COSTID && styles.modalItemTextSelected,
                          ]}
                        >
                          {item.COSTID} - {item.COSTNAME}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setDropdownVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default LoginScreen;