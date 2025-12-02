import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MainHeader from "../../Components/Header/Header";
import Footer from "../../Components/Footer/Footer";
import BarcodeScannerModal from "../../../Src-1/Components/BarCodeScanner/BarcodeScannerModal";
import {
  printEstimationSlip,
  useEstimationPreview,
} from "../../../Src-1/Components/PrintReceipt/PrintSlip";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createHomeStyles } from "./HomeStyles";
import { useEstimation } from "../../../Src-1/Hook/UseEstimation";
import { LoginContext } from "../../../Context/LoginContext";

const HomeScreen = () => {
  const { theme } = useTheme();
  const styles = createHomeStyles(theme);
  const API_BASE_URL = useApiBaseUrl();
  const { username } = useContext(LoginContext);

  const estimationPreview = useEstimationPreview();
  const EstimationPreviewComponent =
    estimationPreview?.EstimationPreviewComponent || null;

  const estimation = useEstimation(API_BASE_URL);

  // Local state to store only current display data
  const [displayData, setDisplayData] = useState([]);
  const [loadingApiData, setLoadingApiData] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [combinedInput, setCombinedInput] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref to store displayData for submission
  const displayDataRef = useRef([]);

  // Update ref whenever displayData changes
  useEffect(() => {
    displayDataRef.current = displayData;
  }, [displayData]);

  // Get employee ID from AsyncStorage on component mount
  useEffect(() => {
    const getEmployeeId = async () => {
      try {
        const empId = await AsyncStorage.getItem("EMPLOYEE_ID");
        if (empId) {
          setEmployeeId(empId);
          estimation.setEmp(empId); // Set in estimation hook too
        }
      } catch (error) {
        console.error("Error fetching employee ID:", error);
      }
    };

    getEmployeeId();
  }, []);

  const handlePrint = async () => {
    if (!estimation.estBatchNo) {
      Alert.alert(
        "No slip available",
        "Please submit first to generate a slip"
      );
      return;
    }
    try {
      await printEstimationSlip(estimation.estBatchNo, username, API_BASE_URL);
    } catch (err) {
      Alert.alert("Print Failed", err.message || "Unable to generate slip");
    }
  };

  // Function to parse combined input (ITEMID-TAGNO)
  const parseCombinedInput = (input) => {
    const trimmedInput = input.trim();

    // Check if input contains a hyphen
    if (!trimmedInput.includes("-")) {
      setValidationError("Please enter in format: ITEMID-TAGNO");
      return null;
    }

    const parts = trimmedInput.split("-");

    if (parts.length !== 2) {
      setValidationError("Invalid format. Use: ITEMID-TAGNO");
      return null;
    }

    const itemId = parts[0].trim();
    const tagNo = parts[1].trim();

    if (!itemId || !tagNo) {
      setValidationError("Both ITEMID and TAGNO are required");
      return null;
    }

    setValidationError("");
    return { itemId, tagNo };
  };

  // Fetch API data based on combined input
  const fetchApiData = async () => {
    if (!combinedInput) {
      Alert.alert("Validation", "Please enter ITEMID-TAGNO");
      return;
    }

    // Parse the combined input
    const parsed = parseCombinedInput(combinedInput);
    if (!parsed) {
      return;
    }

    const { itemId, tagNo } = parsed;

    setLoadingApiData(true);
    setDisplayData([]); // Clear previous data locally

    try {
      const response = await fetch(
        `https://est.bmgjewellers.com/api/v1/estimationTotal?ITEMID=${itemId}&TAGNO=${tagNo}`
      );
      const data = await response.json();
      setDisplayData(data || []);

      // Also update the estimation hook values
      estimation.setITEMID(itemId);
      estimation.setTAGNO(tagNo);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch data from API");
    } finally {
      setLoadingApiData(false);
    }
  };

  // Handle barcode scanning
  const handleBarcodeScan = () => {
    estimation.setScannerVisible(true);
    estimation.setScanningField("combined");
  };

  // Handle scanned barcode data
  const handleScannedData = (data) => {
    setCombinedInput(data);
    estimation.setScannerVisible(false);

    // Auto-fetch data after scanning
    setTimeout(() => {
      fetchApiData();
    }, 500);
  };

  // Handle submit button press
  const handleSubmit = async () => {
    // Get current data from ref (most up-to-date)
    const currentData = displayDataRef.current;
    
    if (!currentData || currentData.length === 0) {
      Alert.alert("No data", "Please fetch data before submitting");
      return;
    }

    console.log("Submitting data from home:", currentData);
    setIsSubmitting(true);

    try {
      // Set data to estimation hook before submitting
     const batchNo = await estimation.submitData(currentData);

      
      if (batchNo) {
        console.log("Submission successful. Batch No:", batchNo);
        estimation.setEstBatchNo(batchNo);
        
        // Clear local data after successful submission
        setDisplayData([]);
        setCombinedInput("");
        
        Alert.alert(
          "Success",
          `Data submitted successfully! Batch No: ${batchNo}`,
          [{ text: "OK" }]
        );
      } else {
        // Alert.alert("Submission Failed", "No batch number returned");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Submission Failed", error.message || "Unable to submit data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAndPrint = async () => {
  await handleSubmit();   // let submission finish
  setTimeout(() => {
    
  }, 1000);
  handlePrint();          // then print
};

  const renderItemCard = (item, index) => {
    const grossAmount = parseFloat(item.GrossAmount) || 0;
    const gstAmount = parseFloat(item.GSTAmount) || 0;
    const grandTotal = parseFloat(item.GrandTotal) || 0;

    return (
      <View key={`item-${index}`} style={styles.itemCard}>
        <View style={styles.cardImageContainer}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderIcon}>💎</Text>
          </View>
        </View>

        <View style={styles.cardTagSection}>
          <Text style={styles.cardTagNumber}>{item.TAGNO || "N/A"}</Text>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardDetailsSection}>
          <View style={styles.cardDetailRow}>
            <Text style={styles.cardDetailLabel}>Item Name</Text>
            <Text style={styles.cardDetailValue}>{item.ITEMNAME || "N/A"}</Text>
          </View>

          {item.SUBITEMNAME && (
            <View style={styles.cardDetailRow}>
              <Text style={styles.cardDetailLabel}>Sub Item Name</Text>
              <Text style={styles.cardDetailValue}>{item.SUBITEMNAME}</Text>
            </View>
          )}

          <View style={styles.cardDetailRow}>
            <Text style={styles.cardDetailLabel}>Pieces</Text>
            <Text style={styles.cardDetailValue}>{item.PCS || "0"}</Text>
          </View>

          <View style={styles.cardDetailRow}>
            <Text style={styles.cardDetailLabel}>Gross Amount</Text>
            <Text style={styles.cardDetailValue}>
              ₹ {grossAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.cardDetailRow}>
            <Text style={styles.cardDetailLabel}>GST Amount</Text>
            <Text style={styles.cardDetailValue}>₹ {gstAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.cardDivider} />
          <View style={[styles.cardDetailRow, styles.cardGrandTotalRow]}>
            <Text style={styles.cardGrandTotalLabel}>Grand Total</Text>
            <Text style={styles.cardGrandTotalValue}>
              ₹{" "}
              {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <MainHeader />
        <View style={styles.container}>
          {/* Combined Input Field with Camera and Fetch Buttons */}
          <View style={styles.combinedInputContainer}>
            <View style={styles.combinedInputWrapper}>
              <TextInput
                style={styles.combinedInput}
                placeholder="(e.g., ABC123-456)"
                placeholderTextColor={theme.COLORS.placeholder}
                value={combinedInput}
                onChangeText={(text) => {
                  setCombinedInput(text);
                  setValidationError("");
                  // Only clear display data when input changes significantly
                  if (text === "" || !text.includes('-')) {
                    setDisplayData([]);
                  }
                }}
                returnKeyType="done"
              />

              {/* Camera Icon for Barcode Scanner */}
              <TouchableOpacity
                style={styles.scannerButton}
                onPress={handleBarcodeScan}
              >
                <Icon name="camera" size={24} color={theme.COLORS.primary} />
              </TouchableOpacity>

              {/* Fetch Button */}
              <TouchableOpacity
                style={styles.fetchButton}
                onPress={fetchApiData}
                disabled={loadingApiData}
              >
                <Text style={styles.fetchButtonText}>
                  {loadingApiData ? "Fetching..." : "Fetch"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fetchButton}
                onPress={handleSubmitAndPrint}
                disabled={loadingApiData}
              >
                <Text style={styles.fetchButtonText}>
                  {loadingApiData ? "Submitting..." : "Submit & Print"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Validation Error Message */}
            {validationError ? (
              <Text style={styles.errorText}>{validationError}</Text>
            ) : null}

            {/* Helper Text */}
            <Text style={styles.helperText}>
              Format: ITEMID-TAGNO (separated by hyphen)
            </Text>
          </View>

          {/* Loading Indicator for API fetch */}
          {loadingApiData && (
            <ActivityIndicator
              size="large"
              color={theme.COLORS.primary}
              style={styles.loader}
            />
          )}

          {/* Display API Data */}
          {displayData.length > 0 && (
            <View style={styles.itemsContainer}>
              <Text style={styles.itemsCount}>
                {displayData.length} item{displayData.length > 1 ? 's' : ''} found
              </Text>
              <View style={styles.cardsGrid}>
                {displayData.map((item, index) => renderItemCard(item, index))}
              </View>
            </View>
          )}

          {/* Scanner Modal */}
          <BarcodeScannerModal
            visible={estimation.scannerVisible}
            onClose={() => estimation.setScannerVisible(false)}
            scanningField={estimation.scanningField}
            onScanned={handleScannedData}
          />

          {/* Print Preview Component */}
          {EstimationPreviewComponent &&
            React.isValidElement(EstimationPreviewComponent) &&
            EstimationPreviewComponent}
        </View>
      </ScrollView>
      <Footer />
    </>
  );
};

export default HomeScreen;