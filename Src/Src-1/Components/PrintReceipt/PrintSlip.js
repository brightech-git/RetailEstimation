import React, { useState, useEffect, useCallback, useRef } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePrinterService } from "../../Service/IpServices";
import { useApiBaseUrl } from "../../../Config/Config";
import {
  fetchEstimationData,
  printEstimationToPrinter,
  checkPrinterConnection,
  getActivePrinter,
  previewReceiptStyling, // NEW
} from "../../Service/EstimationPrinterService";
import EstimationPreviewModal from "../EstimationPreviewModal/EstimationPreviewModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Preview management for estimation slips
let estimationPreviewCallback = null;

export const showEstimationPreview = (slipData) => {
  console.log("🎬 showEstimationPreview called with slip data");
  if (estimationPreviewCallback) {
    estimationPreviewCallback(slipData);
  } else {
    console.log("❌ No preview callback registered");
  }
};

// Main function to print estimation slip with preview
export const printEstimationSlip = async (estBatchNo, username, apiBaseUrl, useEnhancedStyle = true) => {
  try {
    console.log("🖨️ Starting print process for batch:", estBatchNo);

    if (!apiBaseUrl) {
      Alert.alert("Error", "API base URL is not configured.");
      return;
    }

    const slipData = await fetchEstimationData(
      estBatchNo,
      username,
      apiBaseUrl
    );
    if (slipData) {
      console.log("✅ Slip data fetched successfully, showing preview");
      // Add enhanced style flag to slipData
      const enhancedSlipData = {
        ...slipData,
        useEnhancedStyle // Pass the styling preference
      };
      showEstimationPreview(enhancedSlipData);
    } else {
      Alert.alert("Error", "No data found for printing");
    }
  } catch (error) {
    console.error("❌ Error preparing estimation slip:", error);
    Alert.alert("Error", "Failed to prepare estimation slip for printing.");
  }
};

// Main hook for estimation printing
export const useEstimationPreview = (employeeId) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const [currentPrinter, setCurrentPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printerStatus, setPrinterStatus] = useState({
    connected: false,
    checking: false,
    lastChecked: null,
    error: null,
  });
  const [receiptPreview, setReceiptPreview] = useState(null); // NEW: For styling preview
  const [useEnhancedStyle, setUseEnhancedStyle] = useState(true); // NEW: Toggle for enhanced styling

  const navigation = useNavigation();
  const API_BASE_URL = useApiBaseUrl();
  const printerService = usePrinterService();
  const isMounted = useRef(true);
  const isLoading = useRef(false);

  // Load employee ID from storage if not provided
  const loadEmployeeId = useCallback(async () => {
    try {
      if (employeeId) {
        console.log("✅ Employee ID provided:", employeeId);
        return employeeId;
      }

      console.log("🔄 Loading employee ID from storage...");
      const storedEmployeeId = await AsyncStorage.getItem("EMPLOYEE_ID");
      if (storedEmployeeId) {
        console.log("✅ Employee ID loaded from storage:", storedEmployeeId);
        return storedEmployeeId;
      }

      // Try to get from user data
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const empId = parsedUser.employeeId || parsedUser.id;
        if (empId) {
          console.log("✅ Employee ID from user data:", empId);
          return empId.toString();
        }
      }

      console.log("❌ No employee ID found");
      return null;
    } catch (error) {
      console.error("❌ Error loading employee ID:", error);
      return null;
    }
  }, [employeeId]);

  // NEW: Generate receipt preview
  const generateReceiptPreview = useCallback((slipData) => {
    if (!slipData) return;
    
    try {
      const preview = previewReceiptStyling(slipData);
      setReceiptPreview(preview);
      console.log("🎨 Receipt styling preview generated");
    } catch (error) {
      console.error("❌ Error generating receipt preview:", error);
    }
  }, []);

  // Check printer connectivity
  const checkPrinterConnectivity = useCallback(async (printer = null) => {
    if (!isMounted.current) return;

    console.log("🔍 Checking printer connectivity...");
    setPrinterStatus((prev) => ({ ...prev, checking: true, error: null }));

    try {
      const currentEmployeeId = await loadEmployeeId();
      const status = await checkPrinterConnection(printer, currentEmployeeId, API_BASE_URL);
      console.log(
        `📊 Printer connectivity result: ${
          status.connected ? "CONNECTED" : "DISCONNECTED"
        }`
      );

      if (isMounted.current) {
        setPrinterStatus({
          connected: status.connected,
          checking: false,
          lastChecked: new Date(),
          error: status.error,
          printer: status.printer,
        });
      }

      return status;
    } catch (error) {
      console.error("❌ Error checking printer connectivity:", error);
      if (isMounted.current) {
        setPrinterStatus((prev) => ({
          ...prev,
          checking: false,
          connected: false,
          error: error.message,
        }));
      }
      return { connected: false, error: error.message };
    }
  }, [API_BASE_URL, loadEmployeeId]);

  // Load active printer from the service
  const loadActivePrinter = useCallback(async () => {
    if (isLoading.current) {
      console.log("⏳ Load active printer already in progress, skipping...");
      return;
    }

    try {
      isLoading.current = true;
      setLoading(true);

      // Get employee ID first
      const currentEmployeeId = await loadEmployeeId();
      console.log("🖨️ Loading active printer for employee:", currentEmployeeId);

      if (!currentEmployeeId) {
        console.log("❌ No employee ID provided, cannot load printers");
        setPrinterStatus({
          connected: false,
          checking: false,
          lastChecked: new Date(),
          error: "Employee ID not available",
        });
        return;
      }

      if (!API_BASE_URL) {
        console.log("❌ No API base URL available");
        setPrinterStatus({
          connected: false,
          checking: false,
          lastChecked: new Date(),
          error: "API configuration not available",
        });
        return;
      }

      console.log("📡 Calling getActivePrinter with:", { 
        employeeId: currentEmployeeId, 
        API_BASE_URL 
      });
      const activePrinter = await getActivePrinter(currentEmployeeId, API_BASE_URL);
      
      if (!isMounted.current) return;

      if (activePrinter) {
        console.log("✅ Active printer found:", activePrinter.name);
        setCurrentPrinter(activePrinter);

        // Check connectivity for the active printer
        console.log("🔍 Checking connectivity for active printer...");
        await checkPrinterConnectivity(activePrinter);
      } else {
        console.log("ℹ️ No active printer configured");
        setCurrentPrinter(null);
        setPrinterStatus({
          connected: false,
          checking: false,
          lastChecked: new Date(),
          error: null,
        });
      }
    } catch (error) {
      console.error("❌ Error loading active printer:", error);
      if (isMounted.current) {
        setCurrentPrinter(null);
        setPrinterStatus({
          connected: false,
          checking: false,
          lastChecked: new Date(),
          error: "Failed to load printer configuration",
        });
      }
    } finally {
      if (isMounted.current) {
        isLoading.current = false;
        setLoading(false);
      }
    }
  }, [API_BASE_URL, checkPrinterConnectivity, loadEmployeeId]);

  // Initial load
  useEffect(() => {
    console.log("🏁 useEstimationPreview hook mounted");
    isMounted.current = true;
    loadActivePrinter();

    return () => {
      console.log("🧹 useEstimationPreview hook unmounted");
      isMounted.current = false;
    };
  }, []);

  // Refresh printer when component comes into focus
  useEffect(() => {
    let timeoutId;

    const handleFocus = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.log("🔄 Refreshing printer config on screen focus");
        loadActivePrinter();
      }, 500);
    };

    const unsubscribe = navigation.addListener("focus", handleFocus);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [navigation, loadActivePrinter]);

  // Preview callback setup
  useEffect(() => {
    console.log("📞 Setting up estimation preview callback");

    estimationPreviewCallback = (data) => {
      try {
        console.log("🎬 Preview callback triggered with data");
        
        // Extract styling preference
        const { useEnhancedStyle = true, ...slipDataWithoutStyle } = data;
        setUseEnhancedStyle(useEnhancedStyle);
        
        setSlipData(slipDataWithoutStyle);
        
        // Generate receipt preview
        generateReceiptPreview(slipDataWithoutStyle);
        
        console.log("👁️ Showing preview modal");
        setPreviewVisible(true);
      } catch (error) {
        console.error("❌ Error showing preview:", error);
        Alert.alert("Error", "Failed to show preview");
      }
    };

    return () => {
      console.log("🧹 Cleaning up preview callback");
      estimationPreviewCallback = null;
    };
  }, [generateReceiptPreview]);

  const hidePreview = useCallback(() => {
    console.log("👁️ Hiding preview modal");
    setPreviewVisible(false);
    setReceiptPreview(null);
  }, []);

  const executePrint = useCallback(async () => {
    try {
      console.log("🖨️ Execute print called, current printer:", currentPrinter?.name);
      console.log("🎨 Using enhanced style:", useEnhancedStyle);

      if (!currentPrinter) {
        console.log("ℹ️ No current printer selected for printing");
        Alert.alert(
          "No Printer Selected",
          "Please set a current printer in Printer Settings before printing.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                console.log("⚙️ Navigating to printer settings");
                navigation.navigate("Print");
                hidePreview();
              },
            },
          ]
        );
        return;
      }

      // Check connectivity before printing
      console.log("🔍 Performing pre-print connectivity check...");
      setPrinterStatus((prev) => ({ ...prev, checking: true }));

      const status = await checkPrinterConnectivity(currentPrinter);

      if (!status.connected) {
        console.log("❌ Printer is not connected, showing error");
        Alert.alert(
          "Printer Offline",
          `Cannot connect to printer "${currentPrinter.name}".\n\nPlease check:\n• Printer power\n• Network connection\n• IP address: ${currentPrinter.ip_address}\n\nError: ${status.error}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Retry",
              onPress: () => {
                console.log("🔄 Retrying print after connectivity failure");
                executePrint();
              },
            },
            {
              text: "Printer Settings",
              onPress: () => {
                console.log("⚙️ Opening printer settings from error");
                navigation.navigate("Print");
                hidePreview();
              },
            },
          ]
        );
        return;
      }

      console.log("✅ Printer is connected, proceeding with print...");
      setPreviewVisible(false);

      if (slipData) {
        console.log("📄 Printing slip data with enhanced styling:", useEnhancedStyle);
        
        const currentEmployeeId = await loadEmployeeId();
        await printEstimationToPrinter(
          slipData, 
          currentPrinter, 
          currentEmployeeId, 
          API_BASE_URL,
          useEnhancedStyle // Pass enhanced style flag
        );
        console.log("✅ Print job completed successfully");
        
        Alert.alert("Success", "Estimation slip printed successfully!");
      } else {
        console.log("❌ No slip data available for printing");
        Alert.alert("Error", "No data available for printing");
      }
    } catch (error) {
      console.error("❌ Print error:", error);
      Alert.alert("Print Error", error.message || "Failed to print slip");
    } finally {
      setPrinterStatus((prev) => ({ ...prev, checking: false }));
    }
  }, [
    currentPrinter,
    slipData,
    navigation,
    hidePreview,
    checkPrinterConnectivity,
    API_BASE_URL,
    loadEmployeeId,
    useEnhancedStyle, // Add to dependencies
  ]);

  // NEW: Toggle enhanced styling
  const toggleEnhancedStyle = useCallback(() => {
    setUseEnhancedStyle(prev => !prev);
    console.log("🎨 Enhanced styling toggled:", !useEnhancedStyle);
    
    // Regenerate preview if slipData exists
    if (slipData) {
      generateReceiptPreview(slipData);
    }
  }, [useEnhancedStyle, slipData, generateReceiptPreview]);

  // Manual connectivity check function
  const manualConnectivityCheck = useCallback(async () => {
    if (!currentPrinter) {
      console.log("❌ No printer selected for manual check");
      Alert.alert("No Printer", "No printer selected to check");
      return { connected: false, error: "No printer selected" };
    }

    console.log("🔍 Manual connectivity check requested");
    const status = await checkPrinterConnectivity(currentPrinter);

    if (status.connected) {
      console.log("✅ Manual check: Printer is online");
      Alert.alert(
        "Printer Online",
        `Successfully connected to ${currentPrinter.name}`
      );
    } else {
      console.log("❌ Manual check: Printer is offline");
      Alert.alert(
        "Printer Offline",
        `Cannot connect to ${currentPrinter.name}\n\nError: ${status.error}`
      );
    }

    return status;
  }, [currentPrinter, checkPrinterConnectivity]);

  // Enhanced refresh function
  const refreshPrinter = useCallback(async () => {
    console.log("🔄 Manual printer refresh requested");
    setLoading(true);
    await loadActivePrinter();
  }, [loadActivePrinter]);

  // Debug current printer state
  useEffect(() => {
    if (previewVisible) {
      console.log("🔍 DEBUG - Preview modal opened with:", {
        currentPrinter,
        hasCurrentPrinter: !!currentPrinter,
        printerName: currentPrinter?.name,
        printerIp: currentPrinter?.ip_address,
        slipData: !!slipData,
        useEnhancedStyle,
        receiptPreview: !!receiptPreview
      });
    }
  }, [previewVisible, currentPrinter, slipData, useEnhancedStyle, receiptPreview]);

  const EstimationPreviewComponent = React.useMemo(
    () => (
      <EstimationPreviewModal
        visible={previewVisible}
        onClose={hidePreview}
        onPrint={executePrint}
        slipData={slipData}
        currentPrinter={currentPrinter}
        printerStatus={printerStatus}
        onCheckConnection={manualConnectivityCheck}
        onRefreshPrinter={refreshPrinter}
        navigation={navigation}
        receiptPreview={receiptPreview} // NEW
        useEnhancedStyle={useEnhancedStyle} // NEW
        onToggleEnhancedStyle={toggleEnhancedStyle} // NEW
      />
    ),
    [
      previewVisible,
      hidePreview,
      executePrint,
      slipData,
      currentPrinter,
      printerStatus,
      manualConnectivityCheck,
      refreshPrinter,
      navigation,
      receiptPreview, // NEW
      useEnhancedStyle, // NEW
      toggleEnhancedStyle, // NEW
    ]
  );

  const handlePrintEstimationSlip = useCallback(
    (estBatchNo, username, useEnhancedStyle = true) => {
      console.log("📞 printEstimationSlip called from hook with enhanced:", useEnhancedStyle);
      return printEstimationSlip(estBatchNo, username, API_BASE_URL, useEnhancedStyle);
    },
    [API_BASE_URL]
  );

  return {
    EstimationPreviewComponent,
    currentPrinter,
    loading,
    printerStatus,
    hasCurrentPrinter: !!currentPrinter,
    printEstimationSlip: handlePrintEstimationSlip,
    refreshPrinter,
    checkPrinterConnection: manualConnectivityCheck,
    printerIp: currentPrinter?.ip_address,
    printerName: currentPrinter?.name,
    lastChecked: printerStatus.lastChecked,
    useEnhancedStyle, // NEW
    toggleEnhancedStyle, // NEW
    receiptPreview, // NEW
  };
};

export default useEstimationPreview;