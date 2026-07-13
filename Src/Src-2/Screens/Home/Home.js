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
import BarcodeScannerModal from "../../Components/Scanner/Scanner";
import {
  printEstimationSlip,
  useEstimationPreview,
} from "../../../Src-1/Components/PrintReceipt/PrintSlip";
import { useApiBaseUrl } from "../../../Config/Config";
import { useTheme } from "../../../Context/ThemeContext";
import { createHomeStyles } from "./HomeStyles";
import { useEstimation } from "../../../Src-1/Hook/UseEstimation";
import { LoginContext } from "../../../Context/LoginContext";
import ItemDetailsCard from "../../Components/ItemDetailCard/ItemDetailCard"; // Import the new component

const HomeScreen1 = () => {
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
  if (!combinedInput) return;

  const parsed = parseCombinedInput(combinedInput);
  if (!parsed) return;

  const { itemId, tagNo } = parsed;

  setLoadingApiData(true);
  setDisplayData([]);
  estimation.setEstBatchNo(null);

  try {
    // Some companies don't use cost centres at all - selectedCostId can
    // legitimately be empty for them. COSTID is still a required query
    // param on the backend, so the key itself must always be sent (an
    // empty value is fine, an entirely missing key 400s).
    const costId = (await estimation.getCostId()) || "";

    // CHECK TAG ISSUED - best-effort. Without a real cost centre this can
    // fail server-side; don't block the estimation lookup on it.
    try {
      const issuedResponse = await fetch(
        `${API_BASE_URL}/tag-details?ITEMID=${itemId}&TAGNO=${tagNo}&COSTID=${encodeURIComponent(
          costId
        )}`
      );
      if (issuedResponse.ok) {
        const issuedData = await issuedResponse.json();
        if (issuedData?.status === "issued") {
          Alert.alert(
            "Tag Already Issued",
            `This tag was already issued on ${issuedData.trandate}\nTransaction No: ${issuedData.tranno}`
          );
          setLoadingApiData(false);
          return;
        }
      } else {
        console.warn(
          "tag-details check failed, continuing without it:",
          issuedResponse.status
        );
      }
    } catch (issuedErr) {
      console.warn("tag-details check errored, continuing without it:", issuedErr);
    }

    // ESTIMATION API
    const response = await fetch(
      `${API_BASE_URL}/estimationTotal?ITEMID=${itemId}&TAGNO=${tagNo}&COSTID=${encodeURIComponent(
        costId
      )}`
    );
    console.log("🔵 Estimation API URL:", response.url);

    const data = await response.json();

    setDisplayData(data || []);
    estimation.setITEMID(itemId);
    estimation.setTAGNO(tagNo);
    setValidationError("");

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
  estimation.setEstBatchNo(null);   // ← CLEAR SLIP HERE
  setValidationError("");           // prevent ghost error
  setCombinedInput(data);
  estimation.setScannerVisible(false);

  setTimeout(() => {
    fetchApiData();
  }, 500);
};


  // Handle submit button press
  const handleSubmit = async () => {
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
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Submission Failed",
        error.message || "Unable to submit data"
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  estimation.setEstBatchNo(null); // RESET SLIP WHEN USER EDITS
                  if (text === "" || !text.includes("-")) {
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
              <View style={styles.cardsGrid}>
                {displayData.map((item, index) => (
                  <ItemDetailsCard
                    key={`item-${index}`}
                    item={item}
                    index={index}
                    theme={theme} // Pass theme to component
                  />
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (isSubmitting ||
                  estimation.loading ||
                  displayData.length === 0) &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={
                isSubmitting || estimation.loading || displayData.length === 0
              }
            >
              {isSubmitting || estimation.loading ? (
                <ActivityIndicator size="small" color={theme.COLORS.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSubmitting || estimation.loading
                    ? "Submitting..."
                    : "Submit"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                styles.printButton,
                !estimation.estBatchNo && styles.disabledButton,
              ]}
              onPress={handlePrint}
              disabled={!estimation.estBatchNo}
            >
              <Text style={styles.submitButtonText}>Print Slip</Text>
            </TouchableOpacity>
          </View>

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

export default HomeScreen1;
