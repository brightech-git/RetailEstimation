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
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoginContext } from "../../../Context/LoginContext";
import { useTheme } from "../../../Context/ThemeContext";
import { moderateScale } from "../../../Utills/Scalling";
import { StyleSheet } from "react-native";
import { fontFor } from "../../../Utills/Theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useEmployeeList from "../../Hook/useEmployeeList";


// Companies with this COMPANYID share one login but operate as several
// separate companies underneath - instead of picking a cost centre, the
// user picks which company (COMPANYID) to work as.
const MULTI_COMPANY_ID = "15";

const SelectCostCenterScreen = ({ navigation }) => {
  const {
    companyName,
    companyId,
    companyUrl,
    costOptions,
    selectedCostId,
    setSelectedCostId,
    costLoading,
    fetchCostOptions,
    hasCostCentres,
    companyIdOptions,
    companyIdLoading,
    fetchCompanyIdOptions,
    selectCompanyId,
    logout,
  } = useContext(LoginContext);
  const { theme, isDarkMode } = useTheme();
  const { COLORS } = theme;
  const styles = getStyles(theme);

  const isCompanySelectMode = String(companyId) === MULTI_COMPANY_ID;

  const [pickedCostId, setPickedCostId] = useState("");
  const [pickedCompanyId, setPickedCompanyId] = useState("");
  const [continuing, setContinuing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Employee picker state
  const [empModalVisible, setEmpModalVisible] = useState(false);
  const {
    employees: empList,
    loading: empLoading,
    loadEmployees,
  } = useEmployeeList(companyUrl);
  const [empSearch, setEmpSearch] = useState("");
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [pendingNav, setPendingNav] = useState(null);

  useEffect(() => {
    if (!companyUrl) return;

    if (isCompanySelectMode) {
      fetchCompanyIdOptions(companyUrl).then(() => setHasFetched(true));
    } else {
      fetchCostOptions(companyUrl).then(() => setHasFetched(true));
    }
  }, [companyUrl, isCompanySelectMode]);

  // Auto-navigate when hasCostCentres becomes false (no cost centres configured)
  useEffect(() => {
    if (!isCompanySelectMode && hasCostCentres === false) {
      openEmpPicker(() => navigation.navigate("Home", { fromCostCenter: true }));
    }
  }, [hasCostCentres, isCompanySelectMode]);

  const openEmpPicker = async (navCallback) => {
    setPendingNav(() => navCallback);
    setEmpSearch("");
    setEmpModalVisible(true);
    await loadEmployees();
  };

  const confirmEmployee = async (emp) => {
    setSelectedEmpId(String(emp.empId));
    await AsyncStorage.setItem("EMPLOYEE_ID", String(emp.empId));
    setEmpModalVisible(false);
    pendingNav?.();
  };

  const ADMIN_EMP = { empId: 999, empName: "ADMINISTRATOR" };

  const filteredEmpList = (() => {
    const adminMatches = !empSearch.trim() ||
      "999".includes(empSearch) ||
      "administrator".includes(empSearch.toLowerCase());
    const filtered = empSearch.trim()
      ? empList.filter(
          (e) =>
            String(e.empId).includes(empSearch) ||
            (e.empName || "").toLowerCase().includes(empSearch.toLowerCase())
        )
      : empList;
    return adminMatches ? [ADMIN_EMP, ...filtered] : filtered;
  })();

  // Just highlight the tapped item - selection is only committed when
  // the user presses Continue.
  const handlePick = (item) => {
    setPickedCostId(item.COSTID);
  };

  const handlePickCompanyId = (id) => {
    setPickedCompanyId(id);
  };

  const proceedWithCompanyId = async (companyIdToUse) => {
    if (continuing || !companyIdToUse) return;
    setContinuing(true);
    try {
      await selectCompanyId(companyIdToUse);
      openEmpPicker(() => navigation.navigate("Home", { fromCostCenter: true }));
    } finally {
      setContinuing(false);
    }
  };

  const proceedToHome = async (costIdToUse) => {
    if (continuing) return;
    setContinuing(true);
    try {
      await setSelectedCostId(costIdToUse || "");
      openEmpPicker(() => navigation.navigate("Home", { fromCostCenter: true }));
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
          <Text style={styles.title}>
            {isCompanySelectMode ? "Select Company Id" : "Select Cost Centre"}
          </Text>
          {companyName ? (
            <Text style={styles.subtitle}>{companyName}</Text>
          ) : null}

          <View style={styles.card}>
            {isCompanySelectMode ? (
              companyIdLoading || !hasFetched ? (
                <ActivityIndicator
                  size="large"
                  color={theme.COLORS.primary}
                  style={{ margin: moderateScale(24) }}
                />
              ) : companyIdOptions.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No company IDs were found for this account.
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => {
                      setHasFetched(false);
                      fetchCompanyIdOptions(companyUrl).finally(() =>
                        setHasFetched(true)
                      );
                    }}
                  >
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList
                  data={companyIdOptions}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.item,
                        pickedCompanyId === item && styles.itemSelected,
                      ]}
                      onPress={() => handlePickCompanyId(item)}
                    >
                      <Text
                        style={[
                          styles.itemText,
                          pickedCompanyId === item && styles.itemTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )
            ) : costLoading || !hasFetched ? (
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

          {isCompanySelectMode
            ? companyIdOptions.length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    (!pickedCompanyId || continuing) &&
                      styles.continueButtonDisabled,
                  ]}
                  onPress={() => proceedWithCompanyId(pickedCompanyId)}
                  disabled={!pickedCompanyId || continuing}
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
              )
            : costOptions.length > 0 && (
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

      {/* Employee Picker Modal */}
      <Modal visible={empModalVisible} transparent animationType="fade" onRequestClose={() => setEmpModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Employee</Text>
            <TextInput
              style={styles.modalSearch}
              placeholder="Search by name or ID"
              placeholderTextColor={COLORS.placeholder}
              value={empSearch}
              onChangeText={setEmpSearch}
              autoFocus
            />
            {empLoading ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={filteredEmpList}
                keyExtractor={(item) => String(item.empId)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.item, selectedEmpId === String(item.empId) && styles.itemSelected]}
                    onPress={() => confirmEmployee(item)}
                  >
                    <Text style={[styles.itemText, selectedEmpId === String(item.empId) && styles.itemTextSelected]}>
                      {item.empId} - {item.empName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
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
      fontFamily: fontFor("600"),
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
      minHeight: moderateScale(46),
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(8),
      borderRadius: SIZES.radius,
      backgroundColor: COLORS.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: moderateScale(12),
    },
    continueWithoutText: {
      textAlign: "center",
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(20),
    },
    modalContent: {
      width: "100%",
      maxWidth: moderateScale(480),
      maxHeight: "70%",
      backgroundColor: COLORS.card,
      borderRadius: SIZES.radius_lg,
      padding: moderateScale(16),
    },
    modalTitle: {
      color: COLORS.text,
      fontSize: moderateScale(18),
      ...FONTS.h5,
      marginBottom: moderateScale(12),
      textAlign: "center",
    },
    modalSearch: {
      backgroundColor: COLORS.input,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
      borderRadius: SIZES.radius,
      paddingHorizontal: moderateScale(12),
      paddingVertical: moderateScale(8),
      color: COLORS.text,
      marginBottom: moderateScale(10),
      ...FONTS.text,
    },
    modalEmpty: {
      textAlign: "center",
      color: COLORS.placeholder,
      marginVertical: moderateScale(20),
      ...FONTS.text,
    },
  });
};

export default SelectCostCenterScreen;
