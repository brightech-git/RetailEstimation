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
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useToast } from "../../Context/ToastContext";
import Footer from "../../../Components/Footer/Footer";
import { useTheme } from "../../../Context/ThemeContext";
import { getStyles } from "./LoginStyles";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const { login, loading } = useContext(LoginContext);
  const { showToast } = useToast();
  const { theme, isDarkMode } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 40, friction: 7, useNativeDriver: true }),
      Animated.spring(formScale, { toValue: 1, tension: 30, friction: 8, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      showToast("Please enter username and password", "warning");
      return;
    }

    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }),
    ]).start();

    try {
      const success = await login(username, password);
      if (success) {
        setUsername("");
        setPassword("");
        showToast("Login successful!", "success");
      } else {
        showToast("Invalid username or password", "error");
      }
    } catch {
      showToast("Login failed. Please try again", "error");
    }
  };

  const styles = getStyles(theme);

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
              <Text style={styles.title} adjustsFontSizeToFit minimumFontScale={0.7}>
                Retail{"\n"}
                <Text style={styles.titleAccent}>Jewellery Estimation</Text>
              </Text>
              <Text style={styles.subtitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
                Exquisite Craftsmanship
              </Text>
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
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Password"
                      placeholderTextColor={theme.COLORS.placeholder}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={styles.eyeIcon}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={theme.COLORS.placeholder}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
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

    </>
  );
};

export default LoginScreen;