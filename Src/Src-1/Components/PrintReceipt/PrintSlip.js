import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Alert, ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePrinterService } from "../../Service/IpServices";
import { useApiBaseUrl } from "../../../Config/Config";
import {
  fetchEstimationData,
  printEstimationToPrinter,
  renderReceiptBitmap,
  sendReceiptBitmapToPrinter,
  checkPrinterConnection,
  getActivePrinter,
} from "../../Service/EstimationPrinterService";
import EstimationPreviewModal from "../EstimationPreviewModal/EstimationPreviewModal";
import ImageBitmapProcessor from "../../../Utills/ImageBitmapProcessor";
import { LoginContext } from "../../../Context/LoginContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useEmployeeDisplay from "../../Hook/useEmployeeDisplay";
import { SoftControlService } from "../../Service/SoftControlService";
import { EmployeeService } from "../../Service/EmployeeService";

// Preview management for estimation slips
// One entry per mounted screen using useEstimationPreview; the most recent
// (top of the navigation stack) shows the preview. A stack rather than a
// single slot so leaving e.g. Quick Estimate hands the preview back to the
// Home screen underneath instead of clearing it.
const estimationPreviewCallbacks = [];

export const showEstimationPreview = (slipData) => {
  console.log("🎬 showEstimationPreview called with slip data");
  const callback = estimationPreviewCallbacks[estimationPreviewCallbacks.length - 1];
  if (callback) {
    callback(slipData);
  } else {
    console.log("❌ No preview callback registered");
  }
};

// Main function to print estimation slip with preview
export const printEstimationSlip = async (
  estBatchNo,
  username,
  apiBaseUrl,
  empId,
  purchaseEstBatchNo,
  purchaseOnly = false,
) => {
  try {
    console.log("🖨️ Starting print process for batch:", estBatchNo);

    if (!apiBaseUrl) {
      Alert.alert("Error", "API base URL is not configured.");
      return;
    }

    const slipData = await fetchEstimationData(
      estBatchNo,
      apiBaseUrl,
      empId,
      purchaseEstBatchNo,
      purchaseOnly,
    );

    if (slipData) {
      console.log("✅ Slip data fetched successfully, showing preview");
      showEstimationPreview(slipData);
    } else {
      Alert.alert("Error", "No data found for printing");
    }
  } catch (error) {
    console.error("❌ Error preparing estimation slip:", error);
    Alert.alert("Error", "Failed to prepare estimation slip for printing.");
  }
};

// Main hook for estimation printing.
// options.autoPrint: skip the preview and send the slip straight to the
// current printer (one copy) as soon as it and its receipt details
// (employee name, OFFERPRINTGST) are ready.
export const useEstimationPreview = (employeeId, { autoPrint = false } = {}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [slipData, setSlipData] = useState(null);
  const [offerPrintGst, setOfferPrintGst] = useState('N');
  const [estTabPrint, setEstTabPrint] = useState('N');
  const [estItemOrSubItem, setEstItemOrSubItem] = useState('I');
  const receiptControlsRef = useRef(Promise.resolve({ offerVal: 'N', tabVal: 'N', nameVal: 'I' }));
  // slipData the soft-control lookups have finished for
  const [offerReadyFor, setOfferReadyFor] = useState(null);
  // slipData waiting to be auto-printed
  const [autoPrintPending, setAutoPrintPending] = useState(null);
  const [autoPrinting, setAutoPrinting] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [printStage, setPrintStage] = useState(null);
  const printInProgressRef = useRef(false);
  const [currentPrinter, setCurrentPrinter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printerStatus, setPrinterStatus] = useState({
    connected: false,
    checking: false,
    lastChecked: null,
    error: null,
  });

  const navigation = useNavigation();
  const API_BASE_URL = useApiBaseUrl();
  const printerService = usePrinterService();
  const isMounted = useRef(true);
  const isLoading = useRef(false);
  const imageProcessorRef = useRef(null);
  // Pre-warmed bitmap render, kicked off as soon as the preview modal opens
  // so html2canvas/CDN/font work happens while the user is still looking at
  // the preview instead of after they tap Print.
  const bitmapPromiseRef = useRef(null);
  const bitmapForSlipRef = useRef(null);

  const {
    username: loggedInUsername,
    companyName,
    companyLogo,
    companyLogoUrl,
    selectedCostId,
  } = useContext(LoginContext);

  const companyLogoFullPath = companyLogoUrl
    ? `${companyLogoUrl.replace(/\/$/, "")}/${encodeURI(
        companyLogo?.replace(/^\//, "") || "",
      )}`
    : null;

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
// Load active printer from the service - UPDATED to handle no active printer gracefully
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
        error: null, // No error, just no active printer
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
        error: "Failed to load printer configuration", // Generic error
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

  const autoPrintRef = useRef(autoPrint);
  autoPrintRef.current = autoPrint;

  // Preview callback setup
  useEffect(() => {
    console.log("📞 Setting up estimation preview callback");

    const callback = (data) => {
      try {
        console.log("🎬 Preview callback triggered with data");
        setSlipData(data);
        if (autoPrintRef.current) {
          console.log("🖨️ Auto-print: queued, preview skipped");
          setAutoPrintPending(data);
          return;
        }
        console.log("👁️ Showing preview modal",slipData);
        setPreviewVisible(true);
      } catch (error) {
        console.error("❌ Error showing preview:", error);
        Alert.alert("Error", "Failed to show preview");
      }
    };

    estimationPreviewCallbacks.push(callback);

    return () => {
      console.log("🧹 Cleaning up preview callback");
      const idx = estimationPreviewCallbacks.indexOf(callback);
      if (idx !== -1) estimationPreviewCallbacks.splice(idx, 1);
    };
  }, []);

  const hidePreview = useCallback(() => {
    console.log("👁️ Hiding preview modal");
    setPreviewVisible(false);
  }, []);

  // Load receipt controls on mount and refresh them when receipt/context changes.
  useEffect(() => {
    console.log('[ESTITEMORSUBITEM] lookup effect', JSON.stringify({
      hasSlipData: Boolean(slipData),
      hasApiBaseUrl: Boolean(API_BASE_URL),
      costId: selectedCostId || '',
    }));
    if (!API_BASE_URL) {
      console.log('[ESTITEMORSUBITEM] lookup skipped: API base URL is not ready');
      setOfferReadyFor(slipData);
      return;
    }
    console.log('🔍 Fetching soft controls, selectedCostId:', selectedCostId);
    const svc = new SoftControlService(API_BASE_URL);
    let cancelled = false;
    setOfferReadyFor(null);
    const controlIds = ['OFFERPRINTGST', 'ESTTABPRINT', 'ESTITEMORSUBITEM'];
    receiptControlsRef.current = Promise.all(controlIds.map(async (id) =>
      [id, await svc.getControlValue(selectedCostId || '', id)]))
      .then((entries) => Object.fromEntries(entries))
      .then((values) => {
      const offerVal = values.OFFERPRINTGST || 'N';
      const tabVal = values.ESTTABPRINT || 'N';
      let nameVal = values.ESTITEMORSUBITEM || 'I';
      nameVal = String(nameVal || 'I').trim().toUpperCase();
      if (cancelled) return { offerVal, tabVal, nameVal };
      setOfferPrintGst(offerVal || 'N');
      setEstTabPrint(tabVal || 'N');
      setEstItemOrSubItem(nameVal);
      console.log('ESTITEMORSUBITEM applied:', nameVal);
      console.log('🖨️ ESTTABPRINT soft control value:', tabVal, '| applied:', tabVal || 'N');
      setOfferReadyFor(slipData);
      return { offerVal: offerVal || 'N', tabVal: tabVal || 'N', nameVal };
    });
    return () => { cancelled = true; };
  }, [slipData, API_BASE_URL, selectedCostId]);

  // Home has no employee prop: use the employee saved at initial selection.
  useEffect(() => {
    let cancelled = false;
    const refreshEmployee = async () => {
      const id = await AsyncStorage.getItem('EMPLOYEE_ID');
      if (!cancelled) setSelectedEmployeeId(id);
    };
    refreshEmployee().catch((error) => console.log('[ReceiptEmployee]', error.message));
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEmployee().catch((error) => console.log('[ReceiptEmployee]', error.message));
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [navigation, slipData]);
  // Prefer the emp on the slip (typed by the user) over the login employee
  const empIdForDisplay = slipData?.sample?.empid || selectedEmployeeId || employeeId;
  const empDisplay = useEmployeeDisplay(API_BASE_URL, empIdForDisplay);

  // Pre-warm the receipt bitmap render as soon as the preview is shown, so
  // the ~40s html2canvas/CDN/font pipeline runs while the user is reviewing
  // the slip instead of after they tap Print. executePrint just awaits this
  // cached promise instead of starting the render from scratch.
  useEffect(() => {
    if (!previewVisible || !slipData || offerReadyFor !== slipData) return;

    // Keyed to the slip currently on screen so a stale render from a
    // previous slip is never sent for a different one.
    bitmapForSlipRef.current = slipData;

    const companyInfo = {
      companyName,
      companyLogoUri: companyLogoFullPath,
      username: loggedInUsername,
      costId: selectedCostId,
      empDisplay,
    };

    console.log("🔥 Pre-warming receipt bitmap render...");
    bitmapPromiseRef.current = renderReceiptBitmap(
      slipData,
      imageProcessorRef,
      companyInfo,
      576,
      offerPrintGst,
      estTabPrint,
      estItemOrSubItem
    ).catch((err) => {
      console.warn("⚠️ Pre-warm bitmap render failed:", err);
      return null;
    });
  }, [previewVisible, slipData, companyName, companyLogoFullPath, loggedInUsername, selectedCostId, empDisplay, offerPrintGst, estTabPrint, estItemOrSubItem, offerReadyFor]);

const executePrint = useCallback(async (printCount = 1) => {
  if (printInProgressRef.current) return;
  printInProgressRef.current = true;
  setPreviewVisible(false);
  setPrintStage("Checking printer connection...");
  try {
    console.log(`🖨️ Execute print called for ${printCount} copies, current printer:`, currentPrinter?.name);

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
              executePrint(printCount);
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

    console.log(`✅ Printer is connected, proceeding with ${printCount} copies...`);
    setPreviewVisible(false);

    if (slipData) {
      console.log(`📄 Printing ${printCount} copies with printer:`, currentPrinter.name);

      const currentEmployeeId = await loadEmployeeId();
      setPrintStage("Preparing your receipt...");
      const receiptControls = await receiptControlsRef.current;

      // Use the emp on the slip (typed by user) — fall back to login emp
      const slipEmpIdRaw = slipData?.sample?.empid;
      const slipEmpIdStr = slipEmpIdRaw ? String(slipEmpIdRaw).trim().replace(/^E/i, '') : null;
      let resolvedEmpDisplay = empDisplay;
      if (slipEmpIdStr) {
        const [savedEmployeeId, savedEmployeeName] = await Promise.all([
          AsyncStorage.getItem('EMPLOYEE_ID'), AsyncStorage.getItem('EMPLOYEE_NAME'),
        ]);
        const normalizeId = (id) => String(id ?? '').trim().replace(/^E/i, '').replace(/^0+(?=\d)/, '');
        const idLabel = `E${slipEmpIdStr}`;
        if (savedEmployeeName && normalizeId(savedEmployeeId) === normalizeId(slipEmpIdStr)) {
          resolvedEmpDisplay = `${idLabel}-${savedEmployeeName.trim().toUpperCase()}`;
        } else {
          try {
            const found = await new EmployeeService(API_BASE_URL).getEmployeeById(slipEmpIdStr);
            resolvedEmpDisplay = found?.empName ? `${idLabel}-${String(found.empName).trim().toUpperCase()}` : idLabel;
          } catch (_) {
            resolvedEmpDisplay = idLabel;
          }
        }
      }

      const companyInfo = {
        companyName,
        companyLogoUri: companyLogoFullPath,
        username: loggedInUsername,
        costId: selectedCostId,
        empDisplay: resolvedEmpDisplay,
      };

      let bitmap = null;
      try {
        // Use the pre-warmed bitmap (kicked off when the preview opened)
        // if it's still for the slip currently being printed, so the
        // ~40s render/CDN/font work has already happened by the time the
        // user taps Print. Otherwise render fresh as a fallback.
        // Always render fresh so the correct slip emp (not login emp) is used.
        if (false && bitmapForSlipRef.current === slipData && bitmapPromiseRef.current && selectedEmployeeDisplay === empDisplay) {
          console.log("⚡ Using pre-warmed receipt bitmap...");
          bitmap = await bitmapPromiseRef.current;
        }
        if (!bitmap) {
          console.log("🖼️ No pre-warmed bitmap available, rendering now...");
          bitmap = await renderReceiptBitmap(slipData, imageProcessorRef, companyInfo, 576, receiptControls.offerVal, receiptControls.tabVal, receiptControls.nameVal);
        }

        // Send every copy over a single TCP connection instead of
        // reconnecting/re-rendering per copy.
      } catch (imageError) {
        // Fall back to the plain ESC/POS text receipt if the WebView
        // render/capture/send fails (e.g. no network for the CDN scripts).
        console.warn(
          "⚠️ Image receipt print failed, falling back to text receipt:",
          imageError
        );
        for (let copy = 0; copy < printCount; copy++) {
          setPrintStage(`Printing receipt ${copy + 1} of ${printCount}...`);
          await printEstimationToPrinter(slipData, currentPrinter, currentEmployeeId, API_BASE_URL, receiptControls.offerVal, receiptControls.nameVal);
        }
        console.log(`✅ All ${printCount} copies printed successfully (text fallback)`);
      } finally {
        bitmapPromiseRef.current = null;
        bitmapForSlipRef.current = null;
      }

      // Transfer errors may occur after paper has already printed. Propagate
      // them instead of sending a text fallback into an unfinished raster job.
      if (bitmap) {
        setPrintStage(printCount > 1
          ? `Printing ${printCount} receipt copies...`
          : "Printing your receipt...");
        await sendReceiptBitmapToPrinter(bitmap, currentPrinter, printCount);
      }

      setPrintStage(null);
      if (printCount > 1) {
        Alert.alert("Success", `${printCount} copies printed successfully!`);
      } else {
        Alert.alert("Success", "Estimation slip printed successfully!");
      }
    } else {
      console.log("❌ No slip data available for printing");
      Alert.alert("Error", "No data available for printing");
    }
  } catch (error) {
    setPrintStage(null);
    console.error("❌ Print error:", error);
    Alert.alert("Print Error", error.message || "Failed to print slip");
  } finally {
    printInProgressRef.current = false;
    setPrintStage(null);
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
  companyName,
  companyLogoFullPath,
  loggedInUsername,
  selectedCostId,
  empDisplay,
  offerPrintGst,
  estTabPrint,
]);

  // Auto-print: once the queued slip's receipt details are resolved and the
  // active printer has loaded, print one copy without showing the preview.
  const slipEmpId = selectedEmployeeId || employeeId || slipData?.sample?.empid;
  useEffect(() => {
    if (!autoPrintPending || autoPrintPending !== slipData) return;
    if (loading) return; // active printer still loading
    if (offerReadyFor !== slipData) return;
    if (slipEmpId && !empDisplay) return;

    setAutoPrintPending(null);
    setAutoPrinting(true);
    executePrint(1).finally(() => setAutoPrinting(false));
  }, [autoPrintPending, slipData, loading, offerReadyFor, slipEmpId, empDisplay, executePrint]);

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
        slipData: !!slipData
      });
    }
  }, [previewVisible, currentPrinter, slipData]);

  const EstimationPreviewComponent = React.useMemo(
    () => (
      <>
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
          offerPrintGst={offerPrintGst}
          estTabPrint={estTabPrint}
          estItemOrSubItem={estItemOrSubItem}
        />
        {/* Hidden WebView that renders the Trajan-Pro receipt HTML and
            captures it to a 1-bit bitmap for printing. */}
        <ImageBitmapProcessor ref={imageProcessorRef} />
        <Modal
          visible={printStage !== null}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => {}}
        >
          <View style={printProgressStyles.overlay}>
            <View style={printProgressStyles.card} accessibilityViewIsModal>
              <Text style={printProgressStyles.rocket} accessibilityElementsHidden>{"\uD83D\uDE80"}</Text>
              <Text style={printProgressStyles.title}>Printing in progress</Text>
              <ActivityIndicator size="large" color="#2563eb" style={printProgressStyles.spinner} />
              <Text style={printProgressStyles.stage} accessibilityLiveRegion="polite">{printStage}</Text>
              <Text style={printProgressStyles.hint}>Please wait while your receipt prints.</Text>
            </View>
          </View>
        </Modal>
      </>
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
      offerPrintGst,
      estTabPrint,
      printStage,
      estItemOrSubItem,
    ]
  );

  const handlePrintEstimationSlip = useCallback(
    (estBatchNo, username) => {
      console.log("📞 printEstimationSlip called from hook");
      return printEstimationSlip(estBatchNo, username, API_BASE_URL);
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
    // autoPrint mode: true from slip received until printing finishes
    autoPrinting: autoPrinting || !!autoPrintPending,
  };
};

export default useEstimationPreview;

const printProgressStyles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", padding: 24 },
  card: { width: "100%", maxWidth: 360, borderRadius: 20, backgroundColor: "#fff", padding: 28, alignItems: "center" },
  rocket: { fontSize: 42, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center" },
  spinner: { marginVertical: 22 },
  stage: { fontSize: 16, fontWeight: "600", color: "#2563eb", textAlign: "center" },
  hint: { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 12 },
});
