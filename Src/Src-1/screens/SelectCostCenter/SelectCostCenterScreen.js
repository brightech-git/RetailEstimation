// 📁 src/Screens/SelectCostCenter/SelectCostCenterScreen.js
// Shown once, right after a successful login. Uses the company's base
// URL (already resolved by login) to load that company's cost centres,
// and stores the chosen one (SELECTED_COST_ID) before entering Home.
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useTheme } from "../../../Context/ThemeContext";
import { moderateScale } from "../../Utills/Scalling";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const SelectCostCenterScreen = ({ navigation }) => {
  const {
    companyName,
    companyUrl,
    costOptions,
    selectedCostId,
    setSelectedCostId,
    costLoading,
    fetchCostOptions,
    logout,
  } = useContext(LoginContext);
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [pickedCostId, setPickedCostId] = useState(selectedCostId || "");
  const [continuing, setContinuing] = useState(false);
  // Tracks whether we've completed at least one fetch, so the "no cost
  // centres" empty state (with its Continue-without-one option) only
  // shows once we actually know the list is empty - not while loading.
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (companyUrl) {
      fetchCostOptions(companyUrl).finally(() => setHasFetched(true));
    }
  }, [companyUrl]);

  // Just highlight the tapped item - selection is only committed when
  // the user presses Continue.
  const handlePick = (item) => {
    setPickedCostId(item.COSTID);
  };

  const proceedToHome = async (costIdToUse) => {
    if (continuing) return;
    setContinuing(true);
    try {
      // costIdToUse may legitimately be "" - some companies don't use
      // cost centres at all. Downstream API calls already handle a
      // missing/empty cost id gracefully.
      await setSelectedCostId(costIdToUse || "");
      navigation.replace("Home");
    } finally {
      setContinuing(false);
    }
  };

  const handleContinue = () => {
    if (!pickedCostId) return;
    proceedToHome(pickedCostId);
  };

  const handleContinueWithoutCostCentre = () => {
    proceedToHome("");
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={
          isDarkMode
            ? theme.COLORS.gradientPrimary
            : theme.COLORS.gradientSecondary
        }
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Select Cost Centre</Text>
          {companyName ? (
            <Text style={styles.subtitle}>{companyName}</Text>
          ) : null}

          <View style={styles.card}>
            {costLoading || !hasFetched ? (
              <ActivityIndicator
                size="large"
                color={theme.COLORS.primary}
                style={{ margin: moderateScale(24) }}
              />
            ) : costOptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You don't have any cost centres set up for this company.
                  You can continue without one.
                </Text>
                <TouchableOpacity
                  style={styles.continueWithoutButton}
                  onPress={handleContinueWithoutCostCentre}
                  disabled={continuing}
                >
                  {continuing ? (
                    <ActivityIndicator
                      color={theme.COLORS.buttonText}
                      size="small"
                    />
                  ) : (
                    <Text style={styles.continueWithoutText}>
                      Continue without cost centre
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => {
                    setHasFetched(false);
                    fetchCostOptions(companyUrl).finally(() =>
                      setHasFetched(true)
                    );
                  }}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={costOptions}
                keyExtractor={(item) => item.COSTID}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      pickedCostId === item.COSTID && styles.itemSelected,
                    ]}
                    onPress={() => handlePick(item)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        pickedCostId === item.COSTID &&
                          styles.itemTextSelected,
                      ]}
                    >
                      {item.COSTID} - {item.COSTNAME}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {costOptions.length > 0 && (
            <TouchableOpacity
              style={[
                styles.continueButton,
                (!pickedCostId || continuing) &&
                  styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!pickedCostId || continuing}
            >
              {continuing ? (
                <ActivityIndicator
                  color={theme.COLORS.buttonText}
                  size="small"
                />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </>
  );
};

const getStyles = (theme) => {
  const { COLORS, FONTS, SIZES } = theme;
  return StyleSheet.create({
    gradient: { flex: 1, width: "100%", height: "100%" },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: SIZES.padding,
    },
    title: {
      color: COLORS.title,
      textAlign: "center",
      fontSize: moderateScale(24),
      ...FONTS.h5,
      marginBottom: moderateScale(4),
    },
    subtitle: {
      color: COLORS.textLight,
      textAlign: "center",
      marginBottom: moderateScale(20),
      ...FONTS.body,
    },
    card: {
      width: "100%",
      maxWidth: moderateScale(480),
      maxHeight: "60%",
      backgroundColor: COLORS.card,
      borderRadius: SIZES.radius_lg,
      borderWidth: 1.5,
      borderColor: COLORS.borderColor,
      padding: moderateScale(16),
    },
    item: {
      paddingVertical: moderateScale(14),
      paddingHorizontal: moderateScale(16),
      borderRadius: SIZES.radius,
      marginBottom: moderateScale(6),
      backgroundColor: COLORS.input,
    },
    itemSelected: {
      backgroundColor: COLORS.primary + "20",
      borderWidth: 1,
      borderColor: COLORS.primary,
    },
    itemText: {
      fontSize: moderateScale(16),
      color: COLORS.text,
      ...FONTS.text,
    },
    itemTextSelected: {
      color: COLORS.primary,
      fontWeight: "600",
    },
    emptyContainer: {
      alignItems: "center",
      paddingVertical: moderateScale(24),
    },
    emptyText: {
      textAlign: "center",
      color: COLORS.placeholder,
      marginBottom: moderateScale(16),
      ...FONTS.text,
    },
    continueWithoutButton: {
      width: "100%",
      height: moderateScale(46),
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateScale(12),
    },
    continueWithoutText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(15),
      ...FONTS.subheading,
    },
    retryButton: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(20),
      borderRadius: SIZES.radius,
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    retryText: {
      color: COLORS.text,
      ...FONTS.subheading,
    },
    continueButton: {
      width: "100%",
      maxWidth: moderateScale(480),
      height: moderateScale(50),
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginTop: moderateScale(20),
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    continueButtonText: {
      color: COLORS.buttonText,
      fontSize: moderateScale(16),
      ...FONTS.subheading,
    },
    logoutButton: {
      marginTop: moderateScale(16),
    },
    logoutText: {
      color: COLORS.textLight,
      ...FONTS.text,
      textDecorationLine: "underline",
    },
  });
};

export default SelectCostCenterScreen;
